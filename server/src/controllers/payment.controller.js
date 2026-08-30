const ApiError = require('../utils/apiError');
const { sendSuccess } = require('../utils/apiResponse');
const paymentService = require('../services/payment.service');

/**
 * @desc    Create Stripe PaymentIntent for Cart / Order (Card Only)
 * @route   POST /api/v1/payments/create-intent
 * @access  Public (Guests & Authenticated Users)
 */
const createPaymentIntent = async (req, res) => {
  const { items, orderId, email } = req.body;
  const userId = req.user ? req.user.id : null;

  const result = await paymentService.createPaymentIntent({
    items,
    orderId,
    email: email || req.user?.email,
    userId,
  });

  sendSuccess(res, 200, 'Payment intent created successfully', result);
};

/**
 * @desc    Confirm Order Payment after Stripe Card Charge
 * @route   POST /api/v1/payments/confirm
 * @access  Public (Guests & Authenticated Users)
 */
const confirmPayment = async (req, res) => {
  const { orderId, paymentIntentId } = req.body;
  const userId = req.user ? req.user.id : null;

  if (!orderId) {
    throw ApiError.badRequest('Order ID is required');
  }

  if (!paymentIntentId) {
    throw ApiError.badRequest('PaymentIntent ID is required');
  }

  const result = await paymentService.confirmOrderPayment({
    orderId,
    paymentIntentId,
    userId,
  });

  sendSuccess(res, 200, 'Payment confirmed successfully', result);
};

/**
 * @desc    Handle Stripe Webhook Notifications
 * @route   POST /api/v1/payments/stripe-webhook
 * @access  Public (Raw Body HMAC Verification)
 */
const stripeWebhookHandler = async (req, res) => {
  const signature = req.headers['stripe-signature'];
  const rawBody = req.body;

  const result = await paymentService.handleStripeWebhook(rawBody, signature);
  res.status(200).json(result);
};

module.exports = {
  createPaymentIntent,
  confirmPayment,
  stripeWebhookHandler,
};
