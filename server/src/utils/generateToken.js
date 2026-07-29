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
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '1d',
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
  
  // Helper cookies for Next.js Middleware routing (UI-level protection)
  res.cookie('auth-status', 'authenticated', { maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'lax' });
  res.cookie('user-role', userRole, { maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'lax' });
};

/**
 * Set access token in an httpOnly cookie
 * @param {object} res - Express response object
 * @param {string} token - Access token string
 */
const setAccessTokenCookie = (res, token) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60 * 1000, // 15 minutes in ms
  };
  
  res.cookie('accessToken', token, cookieOptions);
};

/**
 * Clear the refresh token cookie
 * @param {object} res - Express response object
 */
const clearRefreshTokenCookie = (res) => {
  res.clearCookie('refreshToken');
  res.clearCookie('accessToken');
  res.clearCookie('auth-status');
  res.clearCookie('user-role');
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
};
