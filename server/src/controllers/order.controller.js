const orderService = require('../services/order.service');
const { sendSuccess } = require('../utils/apiResponse');

const placeOrder = async (req, res) => {
  const order = await orderService.placeOrder(req.user.id, req.body);
  sendSuccess(res, 201, 'Order placed successfully', order);
};

const getUserOrders = async (req, res) => {
  const { orders, meta } = await orderService.getUserOrders(req.user.id, req.query);
  sendSuccess(res, 200, 'Orders fetched', orders, meta);
};

const getOrder = async (req, res) => {
  const isAdmin = req.user.role === 'ADMIN';
  const order = await orderService.getOrder(req.params.id, req.user.id, isAdmin);
  sendSuccess(res, 200, 'Order fetched', order);
};

const cancelOrder = async (req, res) => {
  const order = await orderService.cancelOrder(req.params.id, req.user.id);
  sendSuccess(res, 200, 'Order cancelled', order);
};

// ─── Admin ────────────────────────────────────────────────────────────────────

const getAllOrders = async (req, res) => {
  const { orders, meta } = await orderService.getAllOrders(req.query);
  sendSuccess(res, 200, 'All orders fetched', orders, meta);
};

const updateOrderStatus = async (req, res) => {
  const order = await orderService.updateOrderStatus(req.params.id, req.body.status);
  sendSuccess(res, 200, 'Order status updated', order);
};

module.exports = { placeOrder, getUserOrders, getOrder, cancelOrder, getAllOrders, updateOrderStatus };
