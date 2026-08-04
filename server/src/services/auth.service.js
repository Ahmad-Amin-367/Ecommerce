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
const { OAuth2Client } = require('google-auth-library');
const { sendOtpEmail, sendPasswordResetEmail } = require('./email.service');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

/**
 * Register a new customer
 */
const register = async (data) => {
  const { name, email, password } = data;

  // Check if email already exists in active users
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw ApiError.conflict('An account with this email already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);
  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Clean up any expired pending users in the database automatically (Lazy Cleanup)
  await prisma.pendingUser.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });

  // Store in pending users
  await prisma.pendingUser.upsert({
    where: { email },
    update: {
      name,
      password: hashedPassword,
      otp,
      expiresAt,
    },
    create: {
      email,
      name,
      password: hashedPassword,
      otp,
      expiresAt,
    },
  });

  // Send Email
  await sendOtpEmail(email, name, otp);

  return { message: 'OTP sent successfully', email };
};

/**
 * Verify OTP and create user
 */
const verifyOtp = async (data, res) => {
  const { email, otp } = data;

  const pendingUser = await prisma.pendingUser.findUnique({ where: { email } });
  if (!pendingUser) {
    throw ApiError.badRequest('Invalid or expired OTP');
  }

  if (pendingUser.otp !== otp || pendingUser.expiresAt < new Date()) {
    throw ApiError.badRequest('Invalid or expired OTP');
  }

  // Create real user
  const user = await prisma.user.create({
    data: {
      name: pendingUser.name,
      email: pendingUser.email,
      password: pendingUser.password,
    },
  });

  // Cleanup pending user
  await prisma.pendingUser.delete({ where: { email } });

  // Generate tokens
  const accessToken = generateAccessToken({ id: user.id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user.id });

  setRefreshTokenCookie(res, refreshToken, user.role);
  setAccessTokenCookie(res, accessToken);

  const { password: _, ...userWithoutPassword } = user;
  return {
    user: userWithoutPassword,
    accessToken,
    refreshToken,
  };
};

/**
 * Resend OTP
 */
const resendOtp = async (data) => {
  const { email } = data;

  const pendingUser = await prisma.pendingUser.findUnique({ where: { email } });
  if (!pendingUser) {
    throw ApiError.badRequest('No pending registration found for this email');
  }

  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.pendingUser.update({
    where: { email },
    data: { otp, expiresAt },
  });

  await sendOtpEmail(email, pendingUser.name, otp);
  return { message: 'New OTP sent to email' };
};

/**
 * Login a user — returns user data + tokens (in JSON response and cookies)
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

  // If user signed up with Google, they won't have a password
  if (!user.password) {
    throw ApiError.badRequest('Please use Google Login to access this account');
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
  return {
    user: userWithoutPassword,
    accessToken,
    refreshToken,
  };
};

/**
 * Refresh access token using refresh token from body, header, or cookie
 */
const refreshToken = async (req, res) => {
  const token = req.body?.refreshToken || req.headers['x-refresh-token'] || req.cookies?.refreshToken;
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

  const newAccessToken = generateAccessToken({ id: user.id, role: user.role });
  const newRefreshToken = generateRefreshToken({ id: user.id });

  setAccessTokenCookie(res, newAccessToken);
  setRefreshTokenCookie(res, newRefreshToken, user.role);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

/**
 * Logout — clears cookies
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
  if (!user.isActive) {
    throw ApiError.forbidden('Your account has been deactivated.');
  }

  // Google users might not have a password
  if (!user.password) {
    throw ApiError.badRequest('Cannot change password for an account created with Google.');
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

/**
 * Forgot Password - Send OTP
 */
const forgotPassword = async (data) => {
  const { email } = data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw ApiError.notFound('No account found with this email');
  }
  if (!user.isActive) {
    throw ApiError.forbidden('Your account has been deactivated. Please contact support.');
  }
  if (!user.password) {
    throw ApiError.badRequest('Cannot reset password for an account created with Google.');
  }

  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await prisma.user.update({
    where: { email },
    data: {
      resetPasswordOtp: otp,
      resetPasswordExpires: expiresAt,
    },
  });

  await sendPasswordResetEmail(email, user.name, otp);
  return { message: 'Password reset OTP sent to email', email };
};

/**
 * Reset Password - Verify OTP and Set New Password
 */
const resetPassword = async (data) => {
  const { email, otp, newPassword } = data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw ApiError.notFound('User not found');
  }
  if (!user.isActive) {
    throw ApiError.forbidden('Your account has been deactivated.');
  }

  if (
    !user.resetPasswordOtp ||
    user.resetPasswordOtp !== otp ||
    !user.resetPasswordExpires ||
    user.resetPasswordExpires < new Date()
  ) {
    throw ApiError.badRequest('Invalid or expired OTP');
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { email },
    data: {
      password: hashedNewPassword,
      resetPasswordOtp: null,
      resetPasswordExpires: null,
    },
  });

  return { message: 'Password has been reset successfully' };
};

/**
 * Google Login — verify Google token and find/create user
 */
const googleLogin = async (data, res) => {
  const { credential } = data;

  if (!credential) {
    throw ApiError.badRequest('Google credential is required');
  }

  let ticket;
  try {
    ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
  } catch (err) {
    throw ApiError.unauthorized('Invalid Google token');
  }

  const payload = ticket.getPayload();
  const { email, name, sub: googleId } = payload;

  if (!email) {
    throw ApiError.badRequest('Google account must have an email address');
  }

  let user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    // If user exists but deactivated
    if (!user.isActive) {
      throw ApiError.forbidden('Your account has been deactivated. Please contact support.');
    }
    // Update existing user with googleId if they didn't have it
    if (!user.googleId) {
      user = await prisma.user.update({
        where: { email },
        data: { googleId }, // Intentionally not overwriting authProvider so we know they were originally LOCAL
      });
    }
  } else {
    // Create new user
    user = await prisma.user.create({
      data: {
        email,
        name,
        googleId,
        authProvider: 'GOOGLE',
      },
    });
  }

  const accessToken = generateAccessToken({ id: user.id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user.id });

  setRefreshTokenCookie(res, refreshToken, user.role);
  setAccessTokenCookie(res, accessToken);

  const { password: _, ...userWithoutPassword } = user;
  return {
    user: userWithoutPassword,
    accessToken,
    refreshToken,
  };
};

module.exports = { register, verifyOtp, resendOtp, login, refreshToken, logout, changePassword, forgotPassword, resetPassword, googleLogin };
