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

const isProduction = process.env.NODE_ENV === 'production';

const getCookieOptions = (maxAge) => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  maxAge,
});

/**
 * Set refresh token in an httpOnly cookie
 * @param {object} res - Express response object
 * @param {string} token - Refresh token string
 */
const setRefreshTokenCookie = (res, token) => {
  res.cookie('refreshToken', token, getCookieOptions(7 * 24 * 60 * 60 * 1000));
};

/**
 * Set access token in an httpOnly cookie
 * @param {object} res - Express response object
 * @param {string} token - Access token string
 */
const setAccessTokenCookie = (res, token) => {
  res.cookie('accessToken', token, getCookieOptions(15 * 60 * 1000));
};

/**
 * Clear the refresh token cookie
 * @param {object} res - Express response object
 */
const clearRefreshTokenCookie = (res) => {
  const options = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
  };
  res.clearCookie('refreshToken', options);
  res.clearCookie('accessToken', options);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
};
