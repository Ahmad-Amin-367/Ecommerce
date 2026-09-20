const { Op } = require('sequelize');
const { User, Address, Order } = require('../models');
const ApiError = require('../utils/apiError');
const { paginate } = require('../utils/pagination');

/**
 * Get current user profile
 */
const getProfile = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: ['id', 'name', 'email', 'phone', 'role', 'isActive', 'createdAt'],
    include: [{ model: Address, as: 'addresses' }],
  });

  if (!user) throw ApiError.notFound('User not found');
  return user.toJSON();
};

/**
 * Update current user profile
 */
const updateProfile = async (userId, data) => {
  const user = await User.findByPk(userId);
  if (!user) throw ApiError.notFound('User not found');

  const allowedUpdates = {};
  if (data.name !== undefined) allowedUpdates.name = data.name;
  if (data.phone !== undefined) allowedUpdates.phone = data.phone;

  await user.update(allowedUpdates);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    updatedAt: user.updatedAt,
  };
};

/**
 * Add a new address for a user
 */
const addAddress = async (userId, data) => {
  if (data.isDefault) {
    await Address.update({ isDefault: false }, { where: { userId } });
  }

  const address = await Address.create({ ...data, userId });
  return address;
};

/**
 * Update an existing address
 */
const updateAddress = async (userId, addressId, data) => {
  const address = await Address.findOne({
    where: { id: addressId, userId },
  });
  if (!address) throw ApiError.notFound('Address not found');

  if (data.isDefault) {
    await Address.update({ isDefault: false }, { where: { userId } });
  }

  return address.update(data);
};

/**
 * Delete an address
 */
const deleteAddress = async (userId, addressId) => {
  const address = await Address.findOne({
    where: { id: addressId, userId },
  });
  if (!address) throw ApiError.notFound('Address not found');

  await address.destroy();
};

// ─── Admin only ───────────────────────────────────────────────────────────────

/**
 * Admin: Get all users with pagination
 */
const getAllUsers = async (query) => {
  const { page, limit, search, role, isActive } = query;

  const where = {};
  if (search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
    ];
  }
  where.role = role || 'CUSTOMER';

  if (isActive !== undefined && isActive !== '') {
    where.isActive = isActive === 'true' || isActive === true;
  }

  const totalCount = await User.count({ where });
  const { skip, take, meta } = paginate({ page, limit }, totalCount);

  const users = await User.findAll({
    where,
    offset: skip,
    limit: take,
    order: [['createdAt', 'DESC']],
    attributes: ['id', 'name', 'email', 'phone', 'role', 'isActive', 'createdAt'],
    include: [{ model: Order, as: 'orders', attributes: ['id'] }],
  });

  const formattedUsers = users.map((u) => {
    const json = u.toJSON();
    const orderCount = json.orders?.length || 0;
    delete json.orders;
    return {
      ...json,
      _count: { orders: orderCount },
    };
  });

  return { users: formattedUsers, meta };
};

/**
 * Admin: Update user role or status
 */
const adminUpdateUser = async (userId, data) => {
  const user = await User.findByPk(userId);
  if (!user) throw ApiError.notFound('User not found');

  if (user.role === 'ADMIN') {
    throw ApiError.forbidden('Admin accounts cannot be deactivated or modified');
  }

  await user.update(data);
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
  };
};

module.exports = {
  getProfile,
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  getAllUsers,
  adminUpdateUser,
};
