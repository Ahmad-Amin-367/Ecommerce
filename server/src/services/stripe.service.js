const Stripe = require('stripe');
const logger = require('../config/logger');
const ApiError = require('../utils/apiError');

/**
 * Get initialized Stripe instance
 */
const getStripeClient = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw ApiError.internal('STRIPE_SECRET_KEY is not configured in server environment variables.');
  }
  return new Stripe(secretKey);
};

/**
 * Create a Stripe PaymentIntent for a one-time order charge (strictly Credit/Debit Card only)
 *
 * @param {Object} params
 * @param {number} params.amountInCents - Amount in smallest currency unit (e.g. 2500 for $25.00 CAD)
 * @param {string} [params.currency] - 3-letter currency code (e.g. 'cad')
 * @param {Object} [params.metadata] - Key-value metadata (orderId, orderNumber, customer info)
 * @param {string} [params.idempotencyKey] - Deterministic key to prevent duplicate PaymentIntents
 * @param {string} [params.receiptEmail] - Optional customer email for Stripe receipt
 * @returns {Promise<Object>} Stripe PaymentIntent object
 */
const createPaymentIntent = async ({
  amountInCents,
  currency = process.env.PAYMENT_CURRENCY || 'cad',
  metadata = {},
  idempotencyKey,
  receiptEmail,
}) => {
  const stripe = getStripeClient();

  if (!amountInCents || amountInCents <= 0) {
    throw ApiError.badRequest('Valid payment amount in cents is required');
  }

  const options = {};
  if (idempotencyKey) {
    options.idempotencyKey = idempotencyKey;
  }

  const payload = {
    amount: Math.round(amountInCents),
    currency: currency.toLowerCase(),
    payment_method_types: ['card'], // Strictly Card payment only (no Apple/Google Pay or wallet redirects)
    metadata: {
      ...metadata,
    },
  };

  if (receiptEmail) {
    payload.receipt_email = receiptEmail;
  }

  try {
    logger.info(`Creating Stripe PaymentIntent for ${amountInCents} ${currency} with key: ${idempotencyKey || 'none'}`);
    const paymentIntent = await stripe.paymentIntents.create(payload, options);
    logger.info(`✅ Stripe PaymentIntent created: ${paymentIntent.id}, Status: ${paymentIntent.status}`);
    return paymentIntent;
  } catch (error) {
    logger.error('❌ Stripe createPaymentIntent error:', error.message);
    throw ApiError.badRequest(error.message || 'Failed to initialize payment with Stripe');
  }
};

/**
 * Retrieve an existing PaymentIntent from Stripe to verify status
 *
 * @param {string} paymentIntentId - ID of the PaymentIntent (pi_...)
 * @returns {Promise<Object>} Stripe PaymentIntent
 */
const retrievePaymentIntent = async (paymentIntentId) => {
  const stripe = getStripeClient();

  if (!paymentIntentId) {
    throw ApiError.badRequest('PaymentIntent ID is required');
  }

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    logger.error(`❌ Failed to retrieve Stripe PaymentIntent ${paymentIntentId}:`, error.message);
    throw ApiError.notFound('Payment information not found on Stripe');
  }
};

/**
 * Cryptographically construct and verify a Stripe Webhook event
 *
 * @param {Buffer|string} rawBody - The unparsed raw request body
 * @param {string} signature - The Stripe-Signature header
 * @returns {Object} Verified Stripe Event object
 */
const constructWebhookEvent = (rawBody, signature) => {
  const stripe = getStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw ApiError.internal('STRIPE_WEBHOOK_SECRET is not configured on server.');
  }

  if (!signature) {
    throw ApiError.badRequest('Missing Stripe signature header.');
  }

  try {
    return stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    logger.error('❌ Stripe Webhook signature verification failed:', error.message);
    throw ApiError.badRequest(`Webhook signature verification failed: ${error.message}`);
  }
};

/**
 * Issue a full or partial refund for a PaymentIntent
 *
 * @param {Object} params
 * @param {string} params.paymentIntentId - ID of the PaymentIntent (pi_...)
 * @param {number} [params.amountInCents] - Optional partial amount in cents
 * @param {string} [params.reason] - 'duplicate' | 'fraudulent' | 'requested_by_customer'
 * @param {string} [params.idempotencyKey] - Unique key for safe retries
 * @returns {Promise<Object>} Stripe Refund object
 */
const refundPayment = async ({ paymentIntentId, amountInCents, reason = 'requested_by_customer', idempotencyKey }) => {
  const stripe = getStripeClient();

  if (!paymentIntentId) {
    throw ApiError.badRequest('PaymentIntent ID is required for refund');
  }

  const payload = {
    payment_intent: paymentIntentId,
    reason,
  };

  if (amountInCents) {
    payload.amount = Math.round(amountInCents);
  }

  const options = {};
  if (idempotencyKey) {
    options.idempotencyKey = idempotencyKey;
  }

  try {
    logger.info(`Initiating Stripe refund for PaymentIntent ${paymentIntentId}`);
    const refund = await stripe.refunds.create(payload, options);
    logger.info(`✅ Stripe refund successful: ${refund.id}, Status: ${refund.status}`);
    return refund;
  } catch (error) {
    logger.error('❌ Stripe refund error:', error.message);
    throw ApiError.badRequest(error.message || 'Refund processing failed');
  }
};

module.exports = {
  createPaymentIntent,
  retrievePaymentIntent,
  constructWebhookEvent,
  refundPayment,
};
