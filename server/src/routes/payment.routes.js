const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { optionalAuth } = require('../middlewares/auth.middleware');

// Create PaymentIntent for order (supports logged in or guest user)
router.post('/create-intent', optionalAuth, paymentController.createIntent);

// Stripe Webhook Endpoint
router.post('/webhook', paymentController.webhookHandler);

module.exports = router;
