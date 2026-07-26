import api from './api';

const cartService = {
  getCart: () => api.get('/cart'),
  addToCart: (productId, quantity = 1) => api.post('/cart/items', { productId, quantity }),
  updateCartItem: (productId, quantity) => api.patch('/cart/items', { productId, quantity }),
  removeFromCart: (productId) => api.delete(`/cart/items/${productId}`),
  clearCart: () => api.delete('/cart'),
};

export default cartService;
