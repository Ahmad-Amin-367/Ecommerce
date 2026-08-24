const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { optionalAuth } = require('../middlewares/auth.middleware');

// Process Clover Card Payment for an order
router.post('/clover-charge', optionalAuth, paymentController.chargeCloverPayment);

// Clover Webhook Endpoint
router.post('/webhook', paymentController.webhookHandler);

module.exports = router;
