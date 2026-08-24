const ApiError = require('../utils/apiError');
const { sendSuccess } = require('../utils/apiResponse');
const paymentService = require('../services/payment.service');

/**
 * @desc    Process Clover Card Charge for an Order
 * @route   POST /api/v1/payments/clover-charge
 * @access  Public (Supports Guests & Authenticated Users)
 */
const chargeCloverPayment = async (req, res) => {
  const { orderId, cloverToken } = req.body;

  if (!orderId) {
    throw ApiError.badRequest('Order ID is required');
  }

  if (!cloverToken) {
    throw ApiError.badRequest('Clover payment token (clv_...) is required');
  }

  const userId = req.user ? req.user.id : null;
  const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket?.remoteAddress;

  const result = await paymentService.processCloverPayment({
    orderId,
    cloverToken,
    userId,
    clientIp,
  });

  sendSuccess(res, 200, 'Payment processed successfully', result);
};

/**
 * @desc    Handle Clover Webhook Notifications
 * @route   POST /api/v1/payments/webhook
 * @access  Public
 */
const webhookHandler = async (req, res) => {
  const result = await paymentService.handleWebhook(req.body);
  res.status(200).json(result);
};

module.exports = {
  chargeCloverPayment,
  webhookHandler,
};
