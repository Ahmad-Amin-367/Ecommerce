import api from './api';

const reviewService = {
  getProductReviews: (productId, params) =>
    api.get(`/products/${productId}/reviews`, { params }),
  createReview: (productId, data) => api.post(`/products/${productId}/reviews`, data),
  updateReview: (reviewId, data) => api.patch(`/reviews/${reviewId}`, data),
  deleteReview: (reviewId) => api.delete(`/reviews/${reviewId}`),
};

export default reviewService;
