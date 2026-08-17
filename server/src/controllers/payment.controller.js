const ApiError = require('../utils/apiError');
const { sendSuccess } = require('../utils/apiResponse');
const paymentService = require('../services/payment.service');

/**
 * @desc    Create Stripe PaymentIntent for an order
 * @route   POST /api/v1/payments/create-intent
 * @access  Public (Guest or Authenticated user owning the order)
 */
const createIntent = async (req, res) => {
  const { orderId } = req.body;

  if (!orderId) {
    throw ApiError.badRequest('Order ID is required');
  }

  const userId = req.user ? req.user.id : null;
  const result = await paymentService.createPaymentIntent(orderId, userId);

  sendSuccess(res, 200, 'Payment intent created successfully', result);
};

/**
 * @desc    Handle Stripe Webhooks
 * @route   POST /api/v1/payments/webhook
 * @access  Public (Stripe signature verified)
 */
const webhookHandler = async (req, res) => {
  const signature = req.headers['stripe-signature'];
  const result = await paymentService.handleWebhook(req.body, signature);

  res.status(200).json(result);
};

module.exports = {
  createIntent,
  webhookHandler,
};
