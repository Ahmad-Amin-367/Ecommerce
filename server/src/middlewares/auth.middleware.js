const jwt = require('jsonwebtoken');
const ApiError = require('../utils/apiError');
const { User } = require('../models');

/**
 * Protect routes — verifies the access token from the httpOnly cookie.
 * Attaches the full user object to req.user.
 */
const protect = async (req, res, next) => {
  try {
    let token = req.cookies?.accessToken;

    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw ApiError.unauthorized('Access token is missing or malformed');
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'name', 'email', 'role', 'isActive'],
    });

    if (!user) {
      throw ApiError.unauthorized('User belonging to this token no longer exists');
    }

    if (!user.isActive) {
      throw ApiError.forbidden('Your account has been deactivated');
    }

    req.user = user.toJSON ? user.toJSON() : user;
    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return next(ApiError.unauthorized('Invalid access token'));
    }
    if (err instanceof jwt.TokenExpiredError) {
      return next(ApiError.unauthorized('Access token has expired'));
    }
    next(err);
  }
};

/**
 * Optional auth middleware — attaches req.user if valid token is provided,
 * but allows requests to proceed as guest if unauthenticated.
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token = req.cookies?.accessToken;

    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      const user = await User.findByPk(decoded.id, {
        attributes: ['id', 'name', 'email', 'role', 'isActive'],
      });

      if (user && user.isActive) {
        req.user = user.toJSON ? user.toJSON() : user;
      }
    }
  } catch (_) {
    // Ignore error for optional auth (allow guest)
  }
  next();
};

/**
 * Restrict to specific roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(ApiError.forbidden('You do not have permission to perform this action'));
    }
    next();
  };
};

module.exports = { protect, optionalAuth, authorize };
