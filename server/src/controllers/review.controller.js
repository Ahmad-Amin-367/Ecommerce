const reviewService = require('../services/review.service');
const { sendSuccess } = require('../utils/apiResponse');

const getProductReviews = async (req, res) => {
  const result = await reviewService.getProductReviews(req.params.productId, req.query);
  sendSuccess(res, 200, 'Reviews fetched', result.reviews, result.meta);
};

const createReview = async (req, res) => {
  const review = await reviewService.createReview(req.user.id, req.params.productId, req.body);
  sendSuccess(res, 201, 'Review submitted', review);
};

const updateReview = async (req, res) => {
  const review = await reviewService.updateReview(req.user.id, req.params.id, req.body);
  sendSuccess(res, 200, 'Review updated', review);
};

const deleteReview = async (req, res) => {
  const isAdmin = req.user.role === 'ADMIN';
  await reviewService.deleteReview(req.user.id, req.params.id, isAdmin);
  sendSuccess(res, 200, 'Review deleted');
};

module.exports = { getProductReviews, createReview, updateReview, deleteReview };
