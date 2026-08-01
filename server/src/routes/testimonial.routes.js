const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonial.controller');
const { protect } = require('../middlewares/auth.middleware');
const { restrictTo } = require('../middlewares/role.middleware');

// Public route (also accepts ?admin=true if accessed by admin)
router.get('/', testimonialController.getTestimonials);
router.get('/:id', testimonialController.getTestimonialById);

// Admin protected routes
router.post('/', protect, restrictTo('ADMIN'), testimonialController.createTestimonial);
router.patch('/:id', protect, restrictTo('ADMIN'), testimonialController.updateTestimonial);
router.delete('/:id', protect, restrictTo('ADMIN'), testimonialController.deleteTestimonial);

module.exports = router;
