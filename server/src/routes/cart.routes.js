const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const { protect } = require('../middlewares/auth.middleware');

// All cart routes require authentication
router.use(protect);

router.get('/', cartController.getCart);
router.post('/sync', cartController.syncCart);
router.post('/items', cartController.addToCart);
router.patch('/items', cartController.updateCartItem);
router.delete('/items/:productId', cartController.removeFromCart);
router.delete('/', cartController.clearCart);

module.exports = router;

