const express = require('express');
const router = express.Router({ mergeParams: true }); // access :productId from parent
const reviewController = require('../controllers/review.controller');
const { protect } = require('../middlewares/auth.middleware');
const Joi = require('joi');
const { validate } = require('../middlewares/validate.middleware');

const reviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required().messages({
    'any.required': 'Rating is required',
    'number.min': 'Rating must be between 1 and 5',
    'number.max': 'Rating must be between 1 and 5',
  }),
  title: Joi.string().max(100).optional(),
  comment: Joi.string().max(2000).optional(),
});

const updateReviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).optional(),
  title: Joi.string().max(100).optional(),
  comment: Joi.string().max(2000).optional(),
});

const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
});

// GET /api/v1/products/:productId/reviews
router.get('/', validate(paginationSchema, 'query'), reviewController.getProductReviews);

// POST /api/v1/products/:productId/reviews
router.post('/', protect, validate(reviewSchema), reviewController.createReview);

// PATCH /api/v1/reviews/:id
// DELETE /api/v1/reviews/:id
// These are mounted directly on the main router at /reviews/:id

module.exports = router;
