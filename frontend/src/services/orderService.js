import api from './api';

const orderService = {
  placeOrder: (data) => api.post('/orders', data),
  createPaymentIntent: (orderId) => api.post('/payments/create-intent', { orderId }),
  getMyOrders: (params) => api.get('/orders/my-orders', { params }),
  getOrder: (id) => api.get(`/orders/${id}`),
  cancelOrder: (id) => api.patch(`/orders/${id}/cancel`),
  // Admin
  getAllOrders: (params) => api.get('/orders', { params }),
  updateOrderStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
};

export default orderService;
