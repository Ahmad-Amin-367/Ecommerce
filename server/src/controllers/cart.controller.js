const cartService = require('../services/cart.service');
const { sendSuccess } = require('../utils/apiResponse');

const getCart = async (req, res) => {
  const cart = await cartService.getCart(req.user.id);
  sendSuccess(res, 200, 'Cart fetched', cart);
};

const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await cartService.addToCart(req.user.id, productId, quantity);
  sendSuccess(res, 200, 'Item added to cart', cart);
};

const updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await cartService.updateCartItem(req.user.id, productId, quantity);
  sendSuccess(res, 200, 'Cart item updated', cart);
};

const removeFromCart = async (req, res) => {
  const cart = await cartService.removeFromCart(req.user.id, req.params.productId);
  sendSuccess(res, 200, 'Item removed from cart', cart);
};

const clearCart = async (req, res) => {
  await cartService.clearCart(req.user.id);
  sendSuccess(res, 200, 'Cart cleared');
};

const syncCart = async (req, res) => {
  const { items } = req.body;
  const cart = await cartService.syncCart(req.user.id, items);
  sendSuccess(res, 200, 'Cart synced successfully', cart);
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart, syncCart };

