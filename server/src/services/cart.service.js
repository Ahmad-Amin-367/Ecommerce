const { Cart, CartItem, Product } = require('../models');
const ApiError = require('../utils/apiError');

/**
 * Get the current user's cart with all items
 */
const getCart = async (userId) => {
  let cart = await Cart.findOne({
    where: { userId },
    include: [
      {
        model: CartItem,
        as: 'items',
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'slug', 'price', 'comparePrice', 'images', 'isActive'],
          },
        ],
      },
    ],
    order: [[{ model: CartItem, as: 'items' }, 'createdAt', 'ASC']],
  });

  // Auto-create cart if not exists
  if (!cart) {
    cart = await Cart.create({ userId });
    cart = await Cart.findByPk(cart.id, {
      include: [{ model: CartItem, as: 'items', include: [{ model: Product, as: 'product' }] }],
    });
  }

  const jsonCart = cart.toJSON();
  const items = jsonCart.items || [];

  // Compute totals
  const subtotal = items.reduce((sum, item) => {
    const price = item.product ? Number(item.product.price) : 0;
    return sum + price * item.quantity;
  }, 0);

  return { ...jsonCart, subtotal: parseFloat(subtotal.toFixed(2)) };
};

/**
 * Add a product to the cart, or increment quantity if already in cart
 */
const addToCart = async (userId, productId, quantity = 1) => {
  const product = await Product.findByPk(productId);
  if (!product) throw ApiError.notFound('Product not found');
  if (!product.isActive) throw ApiError.badRequest('This product is no longer available');

  let cart = await Cart.findOne({ where: { userId } });
  if (!cart) cart = await Cart.create({ userId });

  const existingItem = await CartItem.findOne({
    where: { cartId: cart.id, productId },
  });

  if (existingItem) {
    await existingItem.update({ quantity: existingItem.quantity + quantity });
  } else {
    await CartItem.create({ cartId: cart.id, productId, quantity });
  }

  return getCart(userId);
};

/**
 * Update quantity of a specific cart item
 */
const updateCartItem = async (userId, productId, quantity) => {
  const cart = await Cart.findOne({ where: { userId } });
  if (!cart) throw ApiError.notFound('Cart not found');

  const cartItem = await CartItem.findOne({
    where: { cartId: cart.id, productId },
  });
  if (!cartItem) throw ApiError.notFound('Item not found in cart');

  await cartItem.update({ quantity });
  return getCart(userId);
};

/**
 * Remove a single item from the cart
 */
const removeFromCart = async (userId, productId) => {
  const cart = await Cart.findOne({ where: { userId } });
  if (!cart) throw ApiError.notFound('Cart not found');

  const cartItem = await CartItem.findOne({
    where: { cartId: cart.id, productId },
  });
  if (!cartItem) throw ApiError.notFound('Item not found in cart');

  await cartItem.destroy();
  return getCart(userId);
};

/**
 * Clear all items from the cart
 */
const clearCart = async (userId) => {
  const cart = await Cart.findOne({ where: { userId } });
  if (!cart) return;

  await CartItem.destroy({ where: { cartId: cart.id } });
};

/**
 * Merge guest cart items into user DB cart
 */
const syncCart = async (userId, guestItems = []) => {
  if (!Array.isArray(guestItems) || guestItems.length === 0) {
    return getCart(userId);
  }

  let cart = await Cart.findOne({ where: { userId } });
  if (!cart) {
    cart = await Cart.create({ userId });
  }

  for (const item of guestItems) {
    if (!item.productId || !item.quantity || item.quantity <= 0) continue;

    const product = await Product.findByPk(item.productId);
    if (!product || !product.isActive) continue;

    const existingItem = await CartItem.findOne({
      where: { cartId: cart.id, productId: item.productId },
    });

    const targetQuantity = existingItem ? Math.max(existingItem.quantity, item.quantity) : item.quantity;

    if (targetQuantity > 0) {
      if (existingItem) {
        await existingItem.update({ quantity: targetQuantity });
      } else {
        await CartItem.create({ cartId: cart.id, productId: item.productId, quantity: targetQuantity });
      }
    }
  }

  return getCart(userId);
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart, syncCart };
