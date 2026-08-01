import api from './api';

const testimonialService = {
  getTestimonials: (params) => api.get('/testimonials', { params }),
  getTestimonialById: (id) => api.get(`/testimonials/${id}`),
  createTestimonial: (data) => api.post('/testimonials', data),
  updateTestimonial: (id, data) => api.patch(`/testimonials/${id}`, data),
  deleteTestimonial: (id) => api.delete(`/testimonials/${id}`),
};

export default testimonialService;
