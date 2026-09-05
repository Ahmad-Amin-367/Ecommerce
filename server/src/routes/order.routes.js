const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { protect, optionalAuth } = require('../middlewares/auth.middleware');
const { restrictTo } = require('../middlewares/role.middleware');

// Customer route: Require authentication to place an order
router.post('/', protect, orderController.createOrder);

// Private route for customers to get their own orders
router.get('/my-orders', protect, orderController.getMyOrders);

// Named route to get single order details by ID
router.get('/detail/:id', optionalAuth, orderController.getOrderById);

// Fallback alias for backwards compatibility
router.get('/:id', optionalAuth, orderController.getOrderById);

// Admin routes
router.get('/admin', protect, restrictTo('ADMIN'), orderController.getOrders);
router.patch('/admin/:id/status', protect, restrictTo('ADMIN'), orderController.updateOrderStatus);

module.exports = router;

