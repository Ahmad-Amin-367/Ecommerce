const { Order, OrderItem, Product, Address, User, sequelize } = require('../models');
const ApiError = require('../utils/apiError');
const { sendSuccess } = require('../utils/apiResponse');
const orderService = require('../services/order.service');
const cartService = require('../services/cart.service');
const deliveryService = require('../services/delivery.service');
const { sendOrderConfirmationEmail } = require('../services/email.service');

// Generate unique order number (e.g. ORD-TIMESTAMP36-RAND4)
const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

/**
 * @desc    Create new order
 * @route   POST /api/v1/orders
 * @access  Private (Authenticated User or Guest)
 */
const createOrder = async (req, res) => {
  const { items, shippingAddress, paymentMethod, notes, guestInfo, fulfillmentType = 'DELIVERY' } = req.body;

  if (!items || items.length === 0) {
    throw ApiError.badRequest('No order items');
  }

  // Calculate totals and verify products exist
  let subtotal = 0;
  const orderItemsData = [];

  for (const item of items) {
    const product = await Product.findByPk(item.productId);

    if (!product) {
      throw ApiError.notFound(`Product not found: ${item.productId}`);
    }

    const itemTotal = Number(product.price) * item.quantity;
    subtotal += itemTotal;

    orderItemsData.push({
      productId: product.id,
      quantity: item.quantity,
      unitPrice: product.price,
      totalPrice: itemTotal,
    });
  }

  // Authoritative server-side delivery fee calculation
  const deliveryCalc = await deliveryService.calculateDeliveryFee({
    postalCode: shippingAddress?.postalCode,
    fulfillmentType: fulfillmentType,
    items,
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
      'Delivery is not available to this area. Please contact Hisna Gifts.'
    );
  }

  const shippingFee = Number(deliveryCalc.fee) || 0;
  const totalAmount = subtotal + shippingFee;

  // Create Order in Sequelize transaction
  const order = await sequelize.transaction(async (t) => {
    let addressId = null;
    const userId = req.user ? req.user.id : null;

    if (shippingAddress && fulfillmentType === 'DELIVERY') {
      const address = await Address.create(
        {
          userId: userId,
          street: shippingAddress.address,
          city: shippingAddress.city,
          state: shippingAddress.state || 'Ontario',
          country: shippingAddress.country || 'Canada',
          postalCode: shippingAddress.postalCode || '',
        },
        { transaction: t }
      );
      addressId = address.id;
    }

    const newOrder = await Order.create(
      {
        orderNumber: generateOrderNumber(),
        userId: userId,
        addressId: addressId,
        guestName: guestInfo?.name,
        guestEmail: guestInfo?.email,
        guestPhone: guestInfo?.phone,
        paymentMethod: paymentMethod || 'CASH_ON_DELIVERY',
        subtotal,
        shippingFee,
        totalAmount,
        fulfillmentType: deliveryCalc.fulfillmentType || fulfillmentType,
        deliveryZone: deliveryCalc.zoneName || (fulfillmentType === 'PICKUP' ? 'Store Pickup' : null),
        notes,
        items: orderItemsData,
      },
      {
        include: [{ model: OrderItem, as: 'items' }],
        transaction: t,
      }
    );

    return newOrder;
  });

  // Clear user DB cart after successful order creation
  const orderUserId = req.user ? req.user.id : null;
  if (orderUserId) {
    await cartService.clearCart(orderUserId).catch(() => {});
  }

  // Fetch full order with details
  const fullOrder = await Order.findByPk(order.id, {
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

  // Send Order Confirmation Email immediately for COD / non-Stripe orders
  if (order.paymentMethod !== 'STRIPE') {
    sendOrderConfirmationEmail(fullOrder).catch((err) =>
      console.error(`Failed to send order confirmation email: ${err.message}`)
    );
  }

  sendSuccess(res, 201, 'Order placed successfully', fullOrder);
};

/**
 * @desc    Get all orders
 * @route   GET /api/v1/orders
 * @access  Private/Admin
 */
const getOrders = async (req, res) => {
  const { orders, meta } = await orderService.getAllOrders(req.query);
  sendSuccess(res, 200, 'Orders retrieved successfully', orders, meta);
};

/**
 * @desc    Update order status
 * @route   PATCH /api/v1/orders/:id/status
 * @access  Private/Admin
 */
const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    throw ApiError.badRequest('Order status is required');
  }

  const order = await Order.findByPk(id);
  if (!order) {
    throw ApiError.notFound('Order not found');
  }

  const updatedOrder = await order.update({
    status,
    deliveredAt: status === 'DELIVERED' ? new Date() : order.deliveredAt,
  });

  sendSuccess(res, 200, 'Order status updated', updatedOrder);
};

/**
 * @desc    Get logged in user orders
 * @route   GET /api/v1/orders/my-orders
 * @access  Private (Customer)
 */
const getMyOrders = async (req, res) => {
  const orders = await Order.findAll({
    where: { userId: req.user.id },
    order: [['createdAt', 'DESC']],
    include: [
      { model: Address, as: 'address' },
      {
        model: OrderItem,
        as: 'items',
        include: [{ model: Product, as: 'product' }],
      },
    ],
  });

  sendSuccess(res, 200, 'My orders retrieved successfully', orders);
};

/**
 * @desc    Get order by ID
 * @route   GET /api/v1/orders/detail/:id (or /orders/:id)
 * @access  Private (User who owns it or Admin)
 */
const getOrderById = async (req, res) => {
  const { id } = req.params;

  const order = await Order.findByPk(id, {
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email'],
      },
      { model: Address, as: 'address' },
      {
        model: OrderItem,
        as: 'items',
        include: [{ model: Product, as: 'product' }],
      },
    ],
  });

  if (!order) {
    throw ApiError.notFound('Order not found');
  }

  // Authorize: if order belongs to a registered user, ensure requester owns it or is admin
  if (order.userId) {
    if (!req.user || (req.user.role !== 'ADMIN' && order.userId !== req.user.id)) {
      throw ApiError.forbidden('Access denied to this order');
    }
  }

  sendSuccess(res, 200, 'Order details retrieved', order);
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getMyOrders,
};
