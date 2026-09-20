const { Op } = require('sequelize');
const { Order, OrderItem, Product, Address, User, Cart, CartItem, sequelize } = require('../models');
const ApiError = require('../utils/apiError');
const { paginate } = require('../utils/pagination');
const { clearCart } = require('./cart.service');
const deliveryService = require('./delivery.service');

/**
 * Generate a unique order number
 */
const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

/**
 * Place a new order from the user's cart
 */
const placeOrder = async (userId, data) => {
  const { addressId, paymentMethod, notes } = data;

  // Validate address belongs to user
  const address = await Address.findOne({ where: { id: addressId, userId } });
  if (!address) throw ApiError.notFound('Delivery address not found');

  // Load cart
  const cart = await Cart.findOne({
    where: { userId },
    include: [
      {
        model: CartItem,
        as: 'items',
        include: [{ model: Product, as: 'product' }],
      },
    ],
  });

  if (!cart || !cart.items || cart.items.length === 0) {
    throw ApiError.badRequest('Your cart is empty');
  }

  // Validate active status for each item
  for (const item of cart.items) {
    if (!item.product || !item.product.isActive) {
      throw ApiError.badRequest(`Product "${item.product?.name || 'Item'}" is no longer available`);
    }
  }

  // Calculate totals
  const subtotal = cart.items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );

  const deliveryCalc = await deliveryService.calculateDeliveryFee({
    postalCode: address.postalCode,
    fulfillmentType: data.fulfillmentType || 'DELIVERY',
    items: cart.items,
  });

  if (deliveryCalc.requiresQuote || deliveryCalc.isEventSetup) {
    throw ApiError.badRequest(
      deliveryCalc.eventSetupMessage ||
        'This order includes event setup items. Please contact us for a delivery and setup quote.'
    );
  }

  if (!deliveryCalc.isAvailable) {
    throw ApiError.badRequest(
      deliveryCalc.unservicedAreaMessage ||
        deliveryCalc.message ||
        'Delivery is not available to this area.'
    );
  }

  const shippingFee = Number(deliveryCalc.fee) || 0;
  const totalAmount = subtotal + shippingFee;

  // Create order in a Sequelize transaction
  const order = await sequelize.transaction(async (t) => {
    const newOrder = await Order.create(
      {
        orderNumber: generateOrderNumber(),
        userId,
        addressId,
        paymentMethod,
        notes,
        subtotal,
        shippingFee,
        totalAmount,
        fulfillmentType: deliveryCalc.fulfillmentType || 'DELIVERY',
        deliveryZone: deliveryCalc.zoneName || null,
        items: cart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.product.price,
          totalPrice: Number(item.product.price) * item.quantity,
        })),
      },
      {
        include: [{ model: OrderItem, as: 'items' }],
        transaction: t,
      }
    );

    return newOrder;
  });

  // Clear the cart after successful order
  await clearCart(userId);

  return Order.findByPk(order.id, {
    include: [
      {
        model: OrderItem,
        as: 'items',
        include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'images'] }],
      },
      { model: Address, as: 'address' },
      { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
    ],
  });
};

/**
 * Get all orders for a user
 */
const getUserOrders = async (userId, query) => {
  const { page, limit, status, sortBy, sortOrder } = query;
  const where = { userId };
  if (status) where.status = status;

  const totalCount = await Order.count({ where });
  const { skip, take, meta } = paginate({ page, limit }, totalCount);

  const orderField = sortBy || 'createdAt';
  const orderDir = (sortOrder || 'desc').toUpperCase();

  const orders = await Order.findAll({
    where,
    offset: skip,
    limit: take,
    order: [[orderField, orderDir]],
    include: [
      {
        model: OrderItem,
        as: 'items',
        include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'images'] }],
      },
      { model: Address, as: 'address' },
    ],
  });

  return { orders, meta };
};

/**
 * Get a single order (user must own it, or be admin)
 */
const getOrder = async (orderId, userId, isAdmin) => {
  const where = { id: orderId };
  if (!isAdmin) where.userId = userId;

  const order = await Order.findOne({
    where,
    include: [
      {
        model: OrderItem,
        as: 'items',
        include: [
          { model: Product, as: 'product', attributes: ['id', 'name', 'images', 'slug'] },
        ],
      },
      { model: Address, as: 'address' },
      { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
    ],
  });

  if (!order) throw ApiError.notFound('Order not found');
  return order;
};

/**
 * Update order status (Admin only)
 */
const updateOrderStatus = async (orderId, status) => {
  const order = await Order.findByPk(orderId);
  if (!order) throw ApiError.notFound('Order not found');

  const updatedData = { status };
  if (status === 'DELIVERED') {
    updatedData.deliveredAt = new Date();
    updatedData.paymentStatus = 'PAID';
  }

  await order.update(updatedData);

  return Order.findByPk(orderId, {
    include: [
      { model: OrderItem, as: 'items' },
      { model: Address, as: 'address' },
    ],
  });
};

/**
 * Cancel an order (Customer — only if PENDING or CONFIRMED)
 */
const cancelOrder = async (orderId, userId) => {
  const order = await Order.findOne({ where: { id: orderId, userId } });
  if (!order) throw ApiError.notFound('Order not found');

  if (!['PENDING', 'CONFIRMED'].includes(order.status)) {
    throw ApiError.badRequest('Order can only be cancelled when Pending or Confirmed');
  }

  return order.update({ status: 'CANCELLED' });
};

/**
 * Admin: Get all orders with filters
 */
const getAllOrders = async (query) => {
  const {
    page,
    limit,
    search,
    status,
    paymentStatus,
    paymentMethod,
    startDate,
    endDate,
    minTotal,
    maxTotal,
    sortBy,
    sortOrder,
  } = query;

  const where = {};

  if (search) {
    where[Op.or] = [
      { orderNumber: { [Op.iLike]: `%${search}%` } },
      { guestName: { [Op.iLike]: `%${search}%` } },
      { guestEmail: { [Op.iLike]: `%${search}%` } },
    ];
  }

  if (status) where.status = status;
  if (paymentStatus) where.paymentStatus = paymentStatus;
  if (paymentMethod) where.paymentMethod = paymentMethod;

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt[Op.gte] = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      where.createdAt[Op.lte] = end;
    }
  }

  if (minTotal !== undefined || maxTotal !== undefined) {
    where.totalAmount = {};
    if (minTotal !== undefined && minTotal !== '') where.totalAmount[Op.gte] = Number(minTotal);
    if (maxTotal !== undefined && maxTotal !== '') where.totalAmount[Op.lte] = Number(maxTotal);
    if (Object.getOwnPropertySymbols(where.totalAmount).length === 0) delete where.totalAmount;
  }

  const totalCount = await Order.count({ where });
  const { skip, take, meta } = paginate({ page, limit }, totalCount);

  const orderField = sortBy || 'createdAt';
  const orderDir = (sortOrder || 'desc').toUpperCase();

  const orders = await Order.findAll({
    where,
    offset: skip,
    limit: take,
    order: [[orderField, orderDir]],
    include: [
      { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
      { model: Address, as: 'address' },
      { model: OrderItem, as: 'items', attributes: ['id'] },
    ],
  });

  const formattedOrders = orders.map((o) => {
    const json = o.toJSON();
    const itemCount = json.items?.length || 0;
    return {
      ...json,
      _count: { items: itemCount },
    };
  });

  return { orders: formattedOrders, meta };
};

module.exports = {
  placeOrder,
  getUserOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder,
  getAllOrders,
};
