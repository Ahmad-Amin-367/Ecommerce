const prisma = require('../config/db');
const ApiError = require('../utils/apiError');
const { paginate } = require('../utils/pagination');

/**
 * Get reviews for a product
 */
const getProductReviews = async (productId, query) => {
  const { page, limit } = query;
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw ApiError.notFound('Product not found');

  const where = { productId };
  const totalCount = await prisma.review.count({ where });
  const { skip, take, meta } = paginate({ page, limit }, totalCount);

  const reviews = await prisma.review.findMany({
    where,
    skip,
    take,
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { id: true, name: true } } },
  });

  // Calculate average rating
  const aggregate = await prisma.review.aggregate({
    where,
    _avg: { rating: true },
  });

  return { reviews, meta, averageRating: aggregate._avg.rating || 0 };
};

/**
 * Create a review (one per product per user, verified purchase only)
 */
const createReview = async (userId, productId, data) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw ApiError.notFound('Product not found');

  // Check if user already reviewed this product
  const existing = await prisma.review.findUnique({
    where: { userId_productId: { userId, productId } },
  });
  if (existing) throw ApiError.conflict('You have already reviewed this product');

  // Check for verified purchase
  const purchase = await prisma.orderItem.findFirst({
    where: {
      productId,
      order: { userId, status: 'DELIVERED' },
    },
  });

  const review = await prisma.review.create({
    data: {
      ...data,
      userId,
      productId,
      isVerified: !!purchase,
    },
    include: { user: { select: { id: true, name: true } } },
  });

  return review;
};

/**
 * Update own review
 */
const updateReview = async (userId, reviewId, data) => {
  const review = await prisma.review.findFirst({ where: { id: reviewId, userId } });
  if (!review) throw ApiError.notFound('Review not found');

  return prisma.review.update({
    where: { id: reviewId },
    data,
    include: { user: { select: { id: true, name: true } } },
  });
};

/**
 * Delete own review (or admin can delete any)
 */
const deleteReview = async (userId, reviewId, isAdmin) => {
  const where = { id: reviewId };
  if (!isAdmin) where.userId = userId;

  const review = await prisma.review.findFirst({ where });
  if (!review) throw ApiError.notFound('Review not found');

  await prisma.review.delete({ where: { id: reviewId } });
};

module.exports = { getProductReviews, createReview, updateReview, deleteReview };
