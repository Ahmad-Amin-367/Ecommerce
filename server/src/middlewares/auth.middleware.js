const jwt = require('jsonwebtoken');
const ApiError = require('../utils/apiError');
const prisma = require('../config/db');

/**
 * Protect routes — verifies the access token from the httpOnly cookie.
 * Attaches the full user object to req.user.
 */
const protect = async (req, res, next) => {
  try {
    // Support token from cookie (primary) or Authorization header (fallback)
    let token = req.cookies?.accessToken;

    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw ApiError.unauthorized('Access token is missing or malformed');
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    if (!user) {
      throw ApiError.unauthorized('User belonging to this token no longer exists');
    }

    if (!user.isActive) {
      throw ApiError.forbidden('Your account has been deactivated');
    }

    req.user = user;
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

module.exports = { protect };
