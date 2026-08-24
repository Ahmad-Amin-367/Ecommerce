import api from './api';

const orderService = {
  placeOrder: (data) => api.post('/orders', data),
  processCloverPayment: (orderId, cloverToken) =>
    api.post('/payments/clover-charge', { orderId, cloverToken }),
  getMyOrders: (params) => api.get('/orders/my-orders', { params }),
  getOrder: (id) => api.get(`/orders/${id}`),
  cancelOrder: (id) => api.patch(`/orders/${id}/cancel`),
  // Admin
  getAllOrders: (params) => api.get('/orders', { params }),
  updateOrderStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
};

export default orderService;
