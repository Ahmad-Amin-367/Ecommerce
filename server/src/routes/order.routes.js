const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { protect, optionalAuth } = require('../middlewares/auth.middleware');
const { restrictTo } = require('../middlewares/role.middleware');

// Customer route: Require authentication to place an order
router.post('/', protect, orderController.createOrder);

// Admin routes: Get all orders (supports both GET /api/v1/orders and GET /api/v1/orders/admin)
router.get('/', protect, restrictTo('ADMIN'), orderController.getOrders);
router.get('/admin', protect, restrictTo('ADMIN'), orderController.getOrders);

// Private route for customers to get their own orders
router.get('/my-orders', protect, orderController.getMyOrders);

// Admin routes: Update order status (supports both /:id/status and /admin/:id/status)
router.patch('/:id/status', protect, restrictTo('ADMIN'), orderController.updateOrderStatus);
router.patch('/admin/:id/status', protect, restrictTo('ADMIN'), orderController.updateOrderStatus);

// Named route to get single order details by ID
router.get('/detail/:id', optionalAuth, orderController.getOrderById);

// Fallback alias for backwards compatibility (must be last)
router.get('/:id', optionalAuth, orderController.getOrderById);

module.exports = router;
