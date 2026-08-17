const Stripe = require('stripe');
const prisma = require('../config/db');
const ApiError = require('../utils/apiError');
const logger = require('../config/logger');

// Lazy initialization of Stripe client
const getStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey || secretKey.includes('placeholder')) {
    logger.warn('⚠️ STRIPE_SECRET_KEY is using placeholder. Set a valid test secret key to test live Stripe calls.');
  }
  return new Stripe(secretKey || 'sk_test_placeholder', {
    apiVersion: '2023-10-16',
  });
};

/**
 * Create or reuse Payment Intent for an order
 * Uses idempotencyKey based on orderId to prevent duplicate charges if user network drops
 */
const createPaymentIntent = async (orderId, userId) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) {
    throw ApiError.notFound('Order not found');
  }

  // Authorize user (if order belongs to a specific user)
  if (order.userId && userId && order.userId !== userId) {
    throw ApiError.forbidden('Unauthorized access to this order');
  }

  if (order.paymentStatus === 'PAID') {
    throw ApiError.badRequest('This order has already been paid');
  }

  // If order already has client secret, return existing one
  if (order.stripeClientSecret && order.stripePaymentIntentId) {
    return {
      clientSecret: order.stripeClientSecret,
      paymentIntentId: order.stripePaymentIntentId,
      order,
    };
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey || secretKey.includes('placeholder')) {
    throw ApiError.badRequest('Stripe API Key is not configured yet. Please copy your test secret key (sk_test_...) from https://dashboard.stripe.com/test/apikeys into server/.env file as STRIPE_SECRET_KEY.');
  }

  const stripe = getStripe();
  // Amount in smallest currency unit (cents for CAD)
  const amountInCents = Math.round(Number(order.totalAmount) * 100);

  try {
    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: amountInCents,
        currency: 'cad',
        payment_method_types: ['card'],
        description: `Order ${order.orderNumber} - Hisna Gifts`,
        metadata: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          userId: userId || 'GUEST',
        },
      },
      {
        // Idempotency key ensures Stripe won't double-create intent if network drops
        idempotencyKey: `intent_${order.id}`,
      }
    );

    // Save intent ID & secret to database
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        stripePaymentIntentId: paymentIntent.id,
        stripeClientSecret: paymentIntent.client_secret,
        paymentMethod: 'STRIPE',
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      order: updatedOrder,
    };
  } catch (error) {
    logger.error('Stripe PaymentIntent creation failed:', error);
    if (error.type === 'StripeAuthenticationError' || error.message?.includes('Invalid API Key')) {
      throw ApiError.badRequest('Invalid Stripe Secret Key provided. Please check your STRIPE_SECRET_KEY in server/.env file.');
    }
    throw ApiError.internal(error.message || 'Failed to initialize payment gateway');
  }
};

/**
 * Process Stripe Webhook events with signature verification
 */
const handleWebhook = async (rawBody, signature) => {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    if (webhookSecret && !webhookSecret.includes('placeholder')) {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } else {
      // Fallback for development if secret not configured yet
      logger.warn('⚠️ Processing raw webhook payload without signature verification (set STRIPE_WEBHOOK_SECRET in production).');
      event = JSON.parse(rawBody.toString());
    }
  } catch (err) {
    logger.error(`Webhook signature verification failed: ${err.message}`);
    throw ApiError.badRequest(`Webhook Signature Error: ${err.message}`);
  }

  logger.info(`Received Stripe Webhook Event: ${event.type}`);

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata?.orderId;

      if (orderId) {
        await prisma.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: 'PAID',
            status: 'CONFIRMED',
          },
        });
        logger.info(`✅ Order ${orderId} marked as PAID via Stripe Webhook`);
      } else {
        // Fallback search by paymentIntent.id
        await prisma.order.updateMany({
          where: { stripePaymentIntentId: paymentIntent.id },
          data: {
            paymentStatus: 'PAID',
            status: 'CONFIRMED',
          },
        });
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata?.orderId;
      logger.warn(`❌ Payment failed for PaymentIntent ${paymentIntent.id}`);

      if (orderId) {
        await prisma.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: 'FAILED',
          },
        });
      }
      break;
    }

    default:
      logger.info(`Unhandled webhook event type: ${event.type}`);
  }

  return { received: true };
};

module.exports = {
  createPaymentIntent,
  handleWebhook,
};
