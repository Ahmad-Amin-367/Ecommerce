const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const productRoutes = require('./product.routes');
const categoryRoutes = require('./category.routes');
const cartRoutes = require('./cart.routes');
const orderRoutes = require('./order.routes');
const reviewRoutes = require('./review.routes');
const testimonialRoutes = require('./testimonial.routes');
const uploadRoutes = require('./upload.routes');
const b2bRoutes = require('./b2b.routes');
const paymentRoutes = require('./payment.routes');
const reviewController = require('../controllers/review.controller');
const { protect } = require('../middlewares/auth.middleware');

// ─── Mount all routes ─────────────────────────────────────────────────────────
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/products/:productId/reviews', reviewRoutes);  // Nested reviews
router.use('/categories', categoryRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/testimonials', testimonialRoutes);
router.use('/upload', uploadRoutes);
router.use('/b2b', b2bRoutes);
router.use('/payments', paymentRoutes);



// ─── Standalone review update/delete ─────────────────────────────────────────
router.patch('/reviews/:id', protect, reviewController.updateReview);
router.delete('/reviews/:id', protect, reviewController.deleteReview);

// ─── Health check ─────────────────────────────────────────────────────────────
router.get('/health', (req, res) => {
  res.json({ success: true, message: 'API is running', timestamp: new Date().toISOString() });
});

module.exports = router;
