const prisma = require('../config/db');
const ApiError = require('../utils/apiError');
const logger = require('../config/logger');
const stripeService = require('./stripe.service');

/**
 * Calculate authoritative order total from products in database
 *
 * @param {Array<{productId: string, quantity: number}>} items
 * @returns {Promise<{subtotal: number, shippingFee: number, totalAmount: number}>}
 */
const calculateCartTotal = async (items) => {
  if (!items || items.length === 0) {
    throw ApiError.badRequest('Cart is empty');
  }

  let subtotal = 0;
  for (const item of items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
      select: { id: true, name: true, price: true, isActive: true },
    });

    if (!product || !product.isActive) {
      throw ApiError.badRequest(`Product "${item.productId}" is not available`);
    }

    subtotal += Number(product.price) * item.quantity;
  }

  const shippingFee = subtotal >= 500 ? 0 : 99; // Flat $99 CAD or free over $500
  const totalAmount = subtotal + shippingFee;

  return { subtotal, shippingFee, totalAmount };
};

/**
 * Create a Stripe PaymentIntent for the customer's cart (Card only)
 *
 * @param {Object} params
 * @param {Array} params.items - Cart items [{productId, quantity}]
 * @param {string|null} params.userId - Authenticated user ID (optional)
 * @param {string} [params.email] - Customer email (optional)
 * @param {string} [params.orderId] - Optional existing order ID
 * @returns {Promise<{clientSecret: string, paymentIntentId: string, amount: number}>}
 */
const createPaymentIntent = async ({ items, userId, email, orderId }) => {
  let totalAmount = 0;
  let metadata = {
    userId: userId || 'GUEST',
  };

  if (orderId) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
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
 *
 * @param {Object} params
 * @param {string} params.orderId - Database Order ID
 * @param {string} params.paymentIntentId - Stripe PaymentIntent ID (pi_...)
 * @param {string|null} params.userId - Authenticated user ID
 */
const confirmOrderPayment = async ({ orderId, paymentIntentId, userId }) => {
  if (!orderId) {
    throw ApiError.badRequest('Order ID is required');
  }

  if (!paymentIntentId) {
    throw ApiError.badRequest('PaymentIntent ID is required');
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true, address: true },
  });

  if (!order) {
    throw ApiError.notFound('Order not found');
  }

  // 1. Authorize user (if order belongs to an authenticated user)
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
  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: {
      paymentStatus: 'PAID',
      status: 'CONFIRMED',
      paymentMethod: 'STRIPE',
      stripePaymentIntentId: paymentIntent.id,
    },
    include: {
      items: true,
      address: true,
    },
  });

  logger.info(`🎉 Order ${order.orderNumber} successfully confirmed & marked PAID via Stripe (${paymentIntent.id})`);

  return {
    success: true,
    order: updatedOrder,
    paymentIntentId: paymentIntent.id,
  };
};

/**
 * Handle Stripe webhook events asynchronously
 *
 * @param {Buffer|string} rawBody - Raw body from request
 * @param {string} signature - Stripe signature header
 */
const handleStripeWebhook = async (rawBody, signature) => {
  const event = stripeService.constructWebhookEvent(rawBody, signature);
  logger.info(`🔔 Stripe webhook event received: ${event.type} [${event.id}]`);

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata?.orderId;

      // Find order by metadata orderId or by matching stripePaymentIntentId
      const order = orderId
        ? await prisma.order.findUnique({ where: { id: orderId } })
        : await prisma.order.findFirst({ where: { stripePaymentIntentId: paymentIntent.id } });

      if (order) {
        if (order.paymentStatus === 'PAID') {
          logger.info(`⚡ Order ${order.orderNumber} already marked PAID. Webhook skipped.`);
          return { received: true };
        }

        await prisma.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: 'PAID',
            status: 'CONFIRMED',
            paymentMethod: 'STRIPE',
            stripePaymentIntentId: paymentIntent.id,
          },
        });

        logger.info(`🎉 Order ${order.orderNumber} marked PAID via webhook (PaymentIntent: ${paymentIntent.id})`);
      } else {
        logger.warn(`⚠️ No order found matching PaymentIntent ${paymentIntent.id} in webhook handler.`);
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata?.orderId;

      const order = orderId
        ? await prisma.order.findUnique({ where: { id: orderId } })
        : await prisma.order.findFirst({ where: { stripePaymentIntentId: paymentIntent.id } });

      if (order && order.paymentStatus !== 'PAID') {
        await prisma.order.update({
          where: { id: order.id },
          data: { paymentStatus: 'FAILED' },
        });
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
