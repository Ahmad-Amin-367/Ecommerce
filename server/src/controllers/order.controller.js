const prisma = require('../config/db');
const ApiError = require('../utils/apiError');
const { sendSuccess } = require('../utils/apiResponse');

// Generate unique order number (e.g. ORD-168123456)
const generateOrderNumber = () => {
  return `ORD-${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 100)}`;
};

/**
 * @desc    Create new order
 * @route   POST /api/v1/orders
 * @access  Public (Supports Guests)
 */
const createOrder = async (req, res) => {
  const { items, shippingAddress, paymentMethod, notes, guestInfo } = req.body;
  
  if (!items || items.length === 0) {
    throw ApiError.badRequest('No order items');
  }

  // Calculate totals and verify products exist
  let subtotal = 0;
  const orderItemsData = [];

  for (const item of items) {
    const product = await prisma.product.findUnique({ where: { id: item.productId } });
    
    if (!product) {
      throw ApiError.notFound(`Product not found: ${item.productId}`);
    }
    
    if (product.stock < item.quantity) {
      throw ApiError.badRequest(`Insufficient stock for ${product.name}`);
    }

    const itemTotal = Number(product.price) * item.quantity;
    subtotal += itemTotal;

    orderItemsData.push({
      productId: product.id,
      quantity: item.quantity,
      unitPrice: product.price,
      totalPrice: itemTotal
    });
  }

  const shippingFee = 200; // Flat rate for now
  const totalAmount = subtotal + shippingFee;

  // Create Order in transaction to ensure stock is updated safely
  const order = await prisma.$transaction(async (tx) => {
    // 1. Create the address if provided (or store as guest)
    let addressId = null;
    let userId = req.user?.id || null;

    if (shippingAddress) {
      const address = await tx.address.create({
        data: {
          userId: userId,
          street: shippingAddress.address,
          city: shippingAddress.city,
          state: shippingAddress.state || 'N/A',
          country: shippingAddress.country || 'Pakistan',
          postalCode: shippingAddress.postalCode || '00000',
        }
      });
      addressId = address.id;
    }

    // 2. Create the order
    const newOrder = await tx.order.create({
      data: {
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
        notes,
        items: {
          create: orderItemsData
        }
      },
      include: {
        items: true,
        address: true
      }
    });

    // 3. Deduct stock
    for (const item of orderItemsData) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } }
      });
    }

    return newOrder;
  });

  sendSuccess(res, 201, 'Order placed successfully', order);
};

/**
 * @desc    Get all orders
 * @route   GET /api/v1/orders
 * @access  Private/Admin
 */
const getOrders = async (req, res) => {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { id: true, name: true, email: true }
      },
      address: true,
      items: {
        include: { product: true }
      }
    }
  });

  sendSuccess(res, 200, 'Orders retrieved successfully', orders);
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

  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) {
    throw ApiError.notFound('Order not found');
  }

  const updatedOrder = await prisma.order.update({
    where: { id },
    data: { 
      status,
      deliveredAt: status === 'DELIVERED' ? new Date() : order.deliveredAt
    }
  });

  sendSuccess(res, 200, 'Order status updated', updatedOrder);
};

/**
 * @desc    Get logged in user orders
 * @route   GET /api/v1/orders/my-orders
 * @access  Private (Customer)
 */
const getMyOrders = async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      address: true,
      items: {
        include: { product: true }
      }
    }
  });

  sendSuccess(res, 200, 'My orders retrieved successfully', orders);
};

module.exports = {
  createOrder,
  getOrders,
  updateOrderStatus,
  getMyOrders
};
