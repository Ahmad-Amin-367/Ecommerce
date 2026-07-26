const prisma = require('../config/db');
const ApiError = require('../utils/apiError');

/**
 * Get the current user's cart with all items
 */
const getCart = async (userId) => {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              price: true,
              comparePrice: true,
              stock: true,
              images: true,
              isActive: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  // Auto-create cart if not exists
  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: { items: true },
    });
  }

  // Compute totals
  const subtotal = cart.items.reduce((sum, item) => {
    return sum + Number(item.product.price) * item.quantity;
  }, 0);

  return { ...cart, subtotal: parseFloat(subtotal.toFixed(2)) };
};

/**
 * Add a product to the cart, or increment quantity if already in cart
 */
const addToCart = async (userId, productId, quantity = 1) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw ApiError.notFound('Product not found');
  if (!product.isActive) throw ApiError.badRequest('This product is no longer available');
  if (product.stock < quantity) {
    throw ApiError.badRequest(`Only ${product.stock} units available in stock`);
  }

  // Ensure cart exists
  let cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) cart = await prisma.cart.create({ data: { userId } });

  // Upsert cart item
  const existingItem = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId } },
  });

  const newQuantity = existingItem ? existingItem.quantity + quantity : quantity;

  if (product.stock < newQuantity) {
    throw ApiError.badRequest(`Only ${product.stock} units available in stock`);
  }

  await prisma.cartItem.upsert({
    where: { cartId_productId: { cartId: cart.id, productId } },
    create: { cartId: cart.id, productId, quantity },
    update: { quantity: newQuantity },
  });

  return getCart(userId);
};

/**
 * Update quantity of a specific cart item
 */
const updateCartItem = async (userId, productId, quantity) => {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) throw ApiError.notFound('Cart not found');

  const cartItem = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId } },
    include: { product: true },
  });
  if (!cartItem) throw ApiError.notFound('Item not found in cart');

  if (cartItem.product.stock < quantity) {
    throw ApiError.badRequest(`Only ${cartItem.product.stock} units available`);
  }

  await prisma.cartItem.update({
    where: { cartId_productId: { cartId: cart.id, productId } },
    data: { quantity },
  });

  return getCart(userId);
};

/**
 * Remove a single item from the cart
 */
const removeFromCart = async (userId, productId) => {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) throw ApiError.notFound('Cart not found');

  const cartItem = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId } },
  });
  if (!cartItem) throw ApiError.notFound('Item not found in cart');

  await prisma.cartItem.delete({
    where: { cartId_productId: { cartId: cart.id, productId } },
  });

  return getCart(userId);
};

/**
 * Clear all items from the cart
 */
const clearCart = async (userId) => {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) return;

  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
