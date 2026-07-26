import api from './api';

const categoryService = {
  getCategories: (params) => api.get('/categories', { params }),
  getCategory: (identifier) => api.get(`/categories/${identifier}`),
  createCategory: (data) => api.post('/categories', data),
  updateCategory: (id, data) => api.patch(`/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
};

export default categoryService;
