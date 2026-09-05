import api from './api';

const orderService = {
  placeOrder: (data) => api.post('/orders', data),
  createPaymentIntent: (data) => api.post('/payments/create-intent', data),
  confirmPayment: (data) => api.post('/payments/confirm', data),
  getMyOrders: (params) => api.get('/orders/my-orders', { params }),
  getOrder: (id) => api.get(`/orders/detail/${id}`),
  // Admin
  getAllOrders: (params) => api.get('/orders/admin', { params }),
  updateOrderStatus: (id, status) => api.patch(`/orders/admin/${id}/status`, { status }),
};

export default orderService;
