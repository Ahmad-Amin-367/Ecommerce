const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const ApiError = require('../utils/apiError');
const {
  generateAccessToken,
  generateRefreshToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} = require('../utils/generateToken');

/**
 * Register a new customer
 */
const register = async (data) => {
  const { name, email, password } = data;

  // Check if email already exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw ApiError.conflict('An account with this email already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return user;
};

/**
 * Login a user — returns access token and sets refresh token cookie
 */
const login = async (data, res) => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  if (!user.isActive) {
    throw ApiError.forbidden('Your account has been deactivated. Please contact support.');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const accessToken = generateAccessToken({ id: user.id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user.id });

  setRefreshTokenCookie(res, refreshToken, user.role);
  setAccessTokenCookie(res, accessToken);

  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword };
};

/**
 * Refresh access token using the refresh token from cookie
 */
const refreshToken = async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    throw ApiError.unauthorized('Refresh token is missing');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch {
    throw ApiError.unauthorized('Invalid or expired refresh token');
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: { id: true, role: true, isActive: true },
  });

  if (!user || !user.isActive) {
    throw ApiError.unauthorized('User not found or deactivated');
  }

  const accessToken = generateAccessToken({ id: user.id, role: user.role });
  setAccessTokenCookie(res, accessToken);
  
  return {};
};

/**
 * Logout — clears refresh token cookie
 */
const logout = (res) => {
  clearRefreshTokenCookie(res);
};

/**
 * Change user password
 */
const changePassword = async (userId, data) => {
  const { currentPassword, newPassword } = data;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) {
    throw ApiError.badRequest('Current password is incorrect');
  }

  const hashedNew = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedNew },
  });
};

module.exports = { register, login, refreshToken, logout, changePassword };
