const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { protect } = require('../middlewares/auth.middleware');
const { restrictTo } = require('../middlewares/role.middleware');

router.post('/', protect, orderController.createOrder);

// Private route for customers to get their own orders
router.get('/my-orders', protect, orderController.getMyOrders);

// Admin routes
router.get('/', protect, restrictTo('ADMIN'), orderController.getOrders);
router.patch('/:id/status', protect, restrictTo('ADMIN'), orderController.updateOrderStatus);

module.exports = router;
