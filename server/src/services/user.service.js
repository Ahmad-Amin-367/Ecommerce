const prisma = require('../config/db');
const ApiError = require('../utils/apiError');
const { paginate } = require('../utils/pagination');

/**
 * Get current user profile
 */
const getProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      isActive: true,
      createdAt: true,
      addresses: true,
    },
  });

  if (!user) throw ApiError.notFound('User not found');
  return user;
};

/**
 * Update current user profile
 */
const updateProfile = async (userId, data) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      updatedAt: true,
    },
  });
  return user;
};

/**
 * Add a new address for a user
 */
const addAddress = async (userId, data) => {
  // If this is set as default, unset all other defaults first
  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
  }

  const address = await prisma.address.create({
    data: { ...data, userId },
  });
  return address;
};

/**
 * Update an existing address
 */
const updateAddress = async (userId, addressId, data) => {
  const address = await prisma.address.findFirst({
    where: { id: addressId, userId },
  });
  if (!address) throw ApiError.notFound('Address not found');

  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
  }

  return prisma.address.update({ where: { id: addressId }, data });
};

/**
 * Delete an address
 */
const deleteAddress = async (userId, addressId) => {
  const address = await prisma.address.findFirst({
    where: { id: addressId, userId },
  });
  if (!address) throw ApiError.notFound('Address not found');

  await prisma.address.delete({ where: { id: addressId } });
};

// ─── Admin only ───────────────────────────────────────────────────────────────

/**
 * Admin: Get all users with pagination
 */
const getAllUsers = async (query) => {
  const { page, limit, search, role, isActive } = query;

  const where = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (role) where.role = role;
  if (isActive !== undefined) where.isActive = isActive;

  const totalCount = await prisma.user.count({ where });
  const { skip, take, meta } = paginate({ page, limit }, totalCount);

  const users = await prisma.user.findMany({
    where,
    skip,
    take,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      isActive: true,
      createdAt: true,
      _count: { select: { orders: true } },
    },
  });

  return { users, meta };
};

/**
 * Admin: Update user role or status
 */
const adminUpdateUser = async (userId, data) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw ApiError.notFound('User not found');

  return prisma.user.update({
    where: { id: userId },
    data,
    select: { id: true, name: true, email: true, role: true, isActive: true },
  });
};

module.exports = { getProfile, updateProfile, addAddress, updateAddress, deleteAddress, getAllUsers, adminUpdateUser };
