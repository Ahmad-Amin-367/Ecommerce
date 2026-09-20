const { Order, OrderItem, Product, Address, User } = require('../models');
const ApiError = require('../utils/apiError');
const logger = require('../config/logger');
const stripeService = require('./stripe.service');
const { sendOrderConfirmationEmail } = require('./email.service');

/**
 * Calculate authoritative order total from products in database
 */
const calculateCartTotal = async (items, deliveryInfo = {}) => {
  if (!items || items.length === 0) {
    throw ApiError.badRequest('Cart is empty');
  }

  let subtotal = 0;
  for (const item of items) {
    const product = await Product.findByPk(item.productId, {
      attributes: ['id', 'name', 'price', 'isActive'],
    });

    if (!product || !product.isActive) {
      throw ApiError.badRequest(`Product "${item.productId}" is not available`);
    }

    subtotal += Number(product.price) * item.quantity;
  }

  let shippingFee = 0;
  if (deliveryInfo.fulfillmentType === 'PICKUP') {
    shippingFee = 0;
  } else if (deliveryInfo.postalCode) {
    const deliveryService = require('./delivery.service');
    const deliveryCalc = await deliveryService.calculateDeliveryFee({
      postalCode: deliveryInfo.postalCode,
      fulfillmentType: deliveryInfo.fulfillmentType || 'DELIVERY',
      items,
    });
    shippingFee = deliveryCalc.isAvailable ? Number(deliveryCalc.fee) || 0 : 0;
  }

  const totalAmount = subtotal + shippingFee;

  return { subtotal, shippingFee, totalAmount };
};

/**
 * Create a Stripe PaymentIntent for the customer's cart
 */
const createPaymentIntent = async ({ items, userId, email, orderId }) => {
  let totalAmount = 0;
  let metadata = {
    userId: userId || 'GUEST',
  };

  if (orderId) {
    const order = await Order.findByPk(orderId);
    if (!order) throw ApiError.notFound('Order not found');
    totalAmount = Number(order.totalAmount);
    metadata.orderId = order.id;
    metadata.orderNumber = order.orderNumber;
  } else if (items && items.length > 0) {
    const calculated = await calculateCartTotal(items);
    totalAmount = calculated.totalAmount;
    metadata.itemCount = items.length.toString();
  } else {
    throw ApiError.badRequest('Either orderId or cart items must be provided');
  }

  const amountInCents = Math.round(totalAmount * 100);
  if (amountInCents <= 0) {
    throw ApiError.badRequest('Invalid order total amount');
  }

  const idempotencyKey = orderId ? `pi_order_${orderId}` : undefined;

  const paymentIntent = await stripeService.createPaymentIntent({
    amountInCents,
    currency: process.env.PAYMENT_CURRENCY || 'cad',
    metadata,
    idempotencyKey,
    receiptEmail: email,
  });

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
    amount: totalAmount,
    currency: paymentIntent.currency,
  };
};

/**
 * Confirm a completed payment for an order and mark it PAID
 */
const confirmOrderPayment = async ({ orderId, paymentIntentId, userId }) => {
  if (!orderId) {
    throw ApiError.badRequest('Order ID is required');
  }

  if (!paymentIntentId) {
    throw ApiError.badRequest('PaymentIntent ID is required');
  }

  const order = await Order.findByPk(orderId, {
    include: [
      {
        model: OrderItem,
        as: 'items',
        include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'images'] }],
      },
      { model: Address, as: 'address' },
      { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
    ],
  });

  if (!order) {
    throw ApiError.notFound('Order not found');
  }

  // 1. Authorize user
  if (order.userId && userId && order.userId !== userId) {
    throw ApiError.forbidden('Unauthorized access to this order');
  }

  // 2. Double-charge safeguard: If order is already paid, return early
  if (order.paymentStatus === 'PAID') {
    logger.info(`⚡ Order ${order.orderNumber} is already marked as PAID. Returning existing order.`);
    return {
      success: true,
      alreadyPaid: true,
      order,
      message: 'This order has already been paid successfully.',
    };
  }

  // 3. Verify PaymentIntent status directly with Stripe
  const paymentIntent = await stripeService.retrievePaymentIntent(paymentIntentId);

  if (paymentIntent.status !== 'succeeded') {
    logger.warn(`PaymentIntent ${paymentIntentId} status is ${paymentIntent.status}, not 'succeeded'`);
    throw ApiError.badRequest(`Payment has not succeeded. Current status: ${paymentIntent.status}`);
  }

  // 4. Verify amount matches order total
  const expectedAmountInCents = Math.round(Number(order.totalAmount) * 100);
  if (paymentIntent.amount !== expectedAmountInCents) {
    logger.error(
      `❌ Payment amount mismatch for order ${order.orderNumber}. Expected ${expectedAmountInCents}, got ${paymentIntent.amount}`
    );
    throw ApiError.badRequest('Payment amount does not match order total.');
  }

  // 5. Update Order in database to PAID & CONFIRMED
  await order.update({
    paymentStatus: 'PAID',
    status: 'CONFIRMED',
    paymentMethod: 'STRIPE',
    stripePaymentIntentId: paymentIntent.id,
  });

  const updatedOrder = await Order.findByPk(orderId, {
    include: [
      {
        model: OrderItem,
        as: 'items',
        include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'images'] }],
      },
      { model: Address, as: 'address' },
      { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
    ],
  });

  logger.info(`🎉 Order ${order.orderNumber} successfully confirmed & marked PAID via Stripe (${paymentIntent.id})`);

  // Send Order Confirmation Email asynchronously
  sendOrderConfirmationEmail(updatedOrder).catch((err) =>
    logger.error(`Failed to send order confirmation email: ${err.message}`)
  );

  return {
    success: true,
    order: updatedOrder,
    paymentIntentId: paymentIntent.id,
  };
};

/**
 * Handle Stripe webhook events asynchronously
 */
const handleStripeWebhook = async (rawBody, signature) => {
  const event = stripeService.constructWebhookEvent(rawBody, signature);
  logger.info(`🔔 Stripe webhook event received: ${event.type} [${event.id}]`);

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata?.orderId;

      const order = orderId
        ? await Order.findByPk(orderId)
        : await Order.findOne({ where: { stripePaymentIntentId: paymentIntent.id } });

      if (order) {
        if (order.paymentStatus === 'PAID') {
          logger.info(`⚡ Order ${order.orderNumber} already marked PAID. Webhook skipped.`);
          return { received: true };
        }

        await order.update({
          paymentStatus: 'PAID',
          status: 'CONFIRMED',
          paymentMethod: 'STRIPE',
          stripePaymentIntentId: paymentIntent.id,
        });

        const updatedOrder = await Order.findByPk(order.id, {
          include: [
            {
              model: OrderItem,
              as: 'items',
              include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'images'] }],
            },
            { model: Address, as: 'address' },
            { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
          ],
        });

        logger.info(`🎉 Order ${order.orderNumber} marked PAID via webhook (PaymentIntent: ${paymentIntent.id})`);

        sendOrderConfirmationEmail(updatedOrder).catch((err) =>
          logger.error(`Failed to send webhook order confirmation email: ${err.message}`)
        );
      } else {
        logger.warn(`⚠️ No order found matching PaymentIntent ${paymentIntent.id} in webhook handler.`);
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata?.orderId;

      const order = orderId
        ? await Order.findByPk(orderId)
        : await Order.findOne({ where: { stripePaymentIntentId: paymentIntent.id } });

      if (order && order.paymentStatus !== 'PAID') {
        await order.update({ paymentStatus: 'FAILED' });
        logger.warn(`❌ Order ${order.orderNumber} marked FAILED via webhook: ${paymentIntent.last_payment_error?.message}`);
      }
      break;
    }

    default:
      logger.info(`ℹ️ Unhandled Stripe webhook event type: ${event.type}`);
  }

  return { received: true };
};

module.exports = {
  createPaymentIntent,
  confirmOrderPayment,
  handleStripeWebhook,
};
