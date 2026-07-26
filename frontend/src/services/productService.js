import api from './api';

const productService = {
  getProducts: (params) => api.get('/products', { params }),
  getProduct: (identifier) => api.get(`/products/${identifier}`),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.patch(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
};

export default productService;
