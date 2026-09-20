const { Review, Product, OrderItem, Order, User } = require('../models');
const ApiError = require('../utils/apiError');
const { paginate } = require('../utils/pagination');

/**
 * Get reviews for a product
 */
const getProductReviews = async (productId, query) => {
  const { page, limit } = query;
  const product = await Product.findByPk(productId);
  if (!product) throw ApiError.notFound('Product not found');

  const where = { productId };
  const totalCount = await Review.count({ where });
  const { skip, take, meta } = paginate({ page, limit }, totalCount);

  const reviews = await Review.findAll({
    where,
    offset: skip,
    limit: take,
    order: [['createdAt', 'DESC']],
    include: [{ model: User, as: 'user', attributes: ['id', 'name'] }],
  });

  // Calculate average rating
  const avg = await Review.aggregate('rating', 'avg', { where });
  const averageRating = avg ? parseFloat(Number(avg).toFixed(1)) : 0;

  return { reviews, meta, averageRating };
};

/**
 * Create a review (one per product per user, verified purchase only)
 */
const createReview = async (userId, productId, data) => {
  const product = await Product.findByPk(productId);
  if (!product) throw ApiError.notFound('Product not found');

  // Check if user already reviewed this product
  const existing = await Review.findOne({
    where: { userId, productId },
  });
  if (existing) throw ApiError.conflict('You have already reviewed this product');

  // Check for verified purchase
  const purchase = await OrderItem.findOne({
    where: { productId },
    include: [
      {
        model: Order,
        as: 'order',
        where: { userId, status: 'DELIVERED' },
      },
    ],
  });

  const review = await Review.create({
    ...data,
    userId,
    productId,
    isVerified: !!purchase,
  });

  return Review.findByPk(review.id, {
    include: [{ model: User, as: 'user', attributes: ['id', 'name'] }],
  });
};

/**
 * Update own review
 */
const updateReview = async (userId, reviewId, data) => {
  const review = await Review.findOne({ where: { id: reviewId, userId } });
  if (!review) throw ApiError.notFound('Review not found');

  await review.update(data);
  return Review.findByPk(reviewId, {
    include: [{ model: User, as: 'user', attributes: ['id', 'name'] }],
  });
};

/**
 * Delete own review (or admin can delete any)
 */
const deleteReview = async (userId, reviewId, isAdmin) => {
  const where = { id: reviewId };
  if (!isAdmin) where.userId = userId;

  const review = await Review.findOne({ where });
  if (!review) throw ApiError.notFound('Review not found');

  await review.destroy();
};

module.exports = { getProductReviews, createReview, updateReview, deleteReview };
