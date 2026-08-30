const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { optionalAuth } = require('../middlewares/auth.middleware');

// Create Stripe PaymentIntent for Cart / Order (Card Only)
router.post('/create-intent', optionalAuth, paymentController.createPaymentIntent);

// Confirm Stripe Order Payment
router.post('/confirm', optionalAuth, paymentController.confirmPayment);

// Stripe Webhook Endpoint (Raw body verified in controller)
router.post('/stripe-webhook', paymentController.stripeWebhookHandler);

module.exports = router;
