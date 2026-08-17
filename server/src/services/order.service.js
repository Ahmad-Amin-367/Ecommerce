const prisma = require('../config/db');
const ApiError = require('../utils/apiError');
const { paginate } = require('../utils/pagination');
const { clearCart } = require('./cart.service');

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
  const address = await prisma.address.findFirst({ where: { id: addressId, userId } });
  if (!address) throw ApiError.notFound('Delivery address not found');

  // Load cart
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    throw ApiError.badRequest('Your cart is empty');
  }

  // Validate stock for each item
  for (const item of cart.items) {
    if (!item.product.isActive) {
      throw ApiError.badRequest(`Product "${item.product.name}" is no longer available`);
    }
    if (item.product.stock < item.quantity) {
      throw ApiError.badRequest(
        `Insufficient stock for "${item.product.name}". Available: ${item.product.stock}`
      );
    }
  }

  // Calculate totals
  const subtotal = cart.items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );
  const shippingFee = subtotal >= 500 ? 0 : 99; // Free shipping over $500
  const totalAmount = subtotal + shippingFee;

  // Create order in a transaction
  const order = await prisma.$transaction(
    async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId,
          addressId,
          paymentMethod,
          notes,
          subtotal,
          shippingFee,
          totalAmount,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.product.price,
              totalPrice: Number(item.product.price) * item.quantity,
            })),
          },
        },
        include: {
          items: { include: { product: { select: { id: true, name: true, images: true } } } },
          address: true,
        },
      });

      // Decrement stock in parallel
      await Promise.all(
        cart.items.map((item) =>
          tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          })
        )
      );

      return newOrder;
    },
    {
      maxWait: 10000,
      timeout: 20000,
    }
  );

  // Clear the cart after successful order
  await clearCart(userId);

  return order;
};

/**
 * Get all orders for a user
 */
const getUserOrders = async (userId, query) => {
  const { page, limit, status, sortBy, sortOrder } = query;
  const where = { userId };
  if (status) where.status = status;

  const totalCount = await prisma.order.count({ where });
  const { skip, take, meta } = paginate({ page, limit }, totalCount);

  const orders = await prisma.order.findMany({
    where,
    skip,
    take,
    orderBy: { [sortBy]: sortOrder },
    include: {
      items: {
        include: { product: { select: { id: true, name: true, images: true } } },
      },
      address: true,
    },
  });

  return { orders, meta };
};

/**
 * Get a single order (user must own it, or be admin)
 */
const getOrder = async (orderId, userId, isAdmin) => {
  const where = { id: orderId };
  if (!isAdmin) where.userId = userId;

  const order = await prisma.order.findFirst({
    where,
    include: {
      items: { include: { product: { select: { id: true, name: true, images: true, slug: true } } } },
      address: true,
      user: { select: { id: true, name: true, email: true } },
    },
  });

  if (!order) throw ApiError.notFound('Order not found');
  return order;
};

/**
 * Update order status (Admin only)
 */
const updateOrderStatus = async (orderId, status) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw ApiError.notFound('Order not found');

  const updatedData = { status };
  if (status === 'DELIVERED') {
    updatedData.deliveredAt = new Date();
    updatedData.paymentStatus = 'PAID';
  }

  return prisma.order.update({
    where: { id: orderId },
    data: updatedData,
    include: { items: true, address: true },
  });
};

/**
 * Cancel an order (Customer — only if PENDING or CONFIRMED)
 */
const cancelOrder = async (orderId, userId) => {
  const order = await prisma.order.findFirst({ where: { id: orderId, userId } });
  if (!order) throw ApiError.notFound('Order not found');

  if (!['PENDING', 'CONFIRMED'].includes(order.status)) {
    throw ApiError.badRequest('Order can only be cancelled when Pending or Confirmed');
  }

  // Restore stock
  const items = await prisma.orderItem.findMany({ where: { orderId } });
  await prisma.$transaction(
    items.map((item) =>
      prisma.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } },
      })
    )
  );

  return prisma.order.update({
    where: { id: orderId },
    data: { status: 'CANCELLED' },
  });
};

/**
 * Admin: Get all orders with filters
 */
const getAllOrders = async (query) => {
  const { page, limit, search, status, paymentStatus, paymentMethod, startDate, endDate, minTotal, maxTotal, sortBy, sortOrder } = query;
  const where = {};
  
  if (search) {
    where.OR = [
      { orderNumber: { contains: search, mode: 'insensitive' } },
      { guestName: { contains: search, mode: 'insensitive' } },
      { guestEmail: { contains: search, mode: 'insensitive' } },
      { user: { name: { contains: search, mode: 'insensitive' } } },
      { user: { email: { contains: search, mode: 'insensitive' } } },
    ];
  }
  
  if (status) where.status = status;
  if (paymentStatus) where.paymentStatus = paymentStatus;
  if (paymentMethod) where.paymentMethod = paymentMethod;

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      where.createdAt.lte = end;
    }
  }

  if (minTotal !== undefined || maxTotal !== undefined) {
    where.totalAmount = {};
    if (minTotal !== undefined && minTotal !== '') where.totalAmount.gte = Number(minTotal);
    if (maxTotal !== undefined && maxTotal !== '') where.totalAmount.lte = Number(maxTotal);
    if (Object.keys(where.totalAmount).length === 0) delete where.totalAmount;
  }

  const totalCount = await prisma.order.count({ where });
  const { skip, take, meta } = paginate({ page, limit }, totalCount);

  const orders = await prisma.order.findMany({
    where,
    skip,
    take,
    orderBy: { [sortBy]: sortOrder },
    include: {
      user: { select: { id: true, name: true, email: true } },
      address: true,
      _count: { select: { items: true } },
    },
  });

  return { orders, meta };
};

module.exports = { placeOrder, getUserOrders, getOrder, updateOrderStatus, cancelOrder, getAllOrders };
