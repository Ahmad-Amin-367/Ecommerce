const jwt = require('jsonwebtoken');

/**
 * Generate a short-lived access token
 * @param {object} payload - { id, role }
 * @returns {string} JWT access token
 */
const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  });
};

/**
 * Generate a long-lived refresh token
 * @param {object} payload - { id }
 * @returns {string} JWT refresh token
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });
};

/**
 * Set refresh token in an httpOnly cookie
 * @param {object} res - Express response object
 * @param {string} token - Refresh token string
 */
const setRefreshTokenCookie = (res, token, userRole = 'CUSTOMER') => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', // Use lax so it works smoothly between port 3000 and 5000
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  };
  
  res.cookie('refreshToken', token, cookieOptions);
  
  // Non-httpOnly or httpOnly cookies for Next.js middleware
  res.cookie('auth-status', 'authenticated', { ...cookieOptions, httpOnly: false });
  res.cookie('user-role', userRole, { ...cookieOptions, httpOnly: false });
};

/**
 * Clear the refresh token cookie
 * @param {object} res - Express response object
 */
const clearRefreshTokenCookie = (res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  };
  res.clearCookie('refreshToken', cookieOptions);
  res.clearCookie('auth-status', { ...cookieOptions, httpOnly: false });
  res.clearCookie('user-role', { ...cookieOptions, httpOnly: false });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
};
