const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { protect } = require('../middlewares/auth.middleware');
const { restrictTo } = require('../middlewares/role.middleware');
const { validate } = require('../middlewares/validate.middleware');
const orderValidation = require('../validations/order.validation');

// ─── Customer routes ──────────────────────────────────────────────────────────
router.use(protect);

router.post('/', validate(orderValidation.placeOrder), orderController.placeOrder);
router.get('/my-orders', validate(orderValidation.query, 'query'), orderController.getUserOrders);
router.get('/:id', orderController.getOrder);
router.patch('/:id/cancel', orderController.cancelOrder);

// ─── Admin routes ─────────────────────────────────────────────────────────────
router.get('/', restrictTo('ADMIN'), validate(orderValidation.query, 'query'), orderController.getAllOrders);
router.patch('/:id/status', restrictTo('ADMIN'), validate(orderValidation.updateStatus), orderController.updateOrderStatus);

module.exports = router;
