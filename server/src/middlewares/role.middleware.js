const ApiError = require('../utils/apiError');

/**
 * Role-based access control middleware factory.
 * Usage: restrictTo('ADMIN') or restrictTo('ADMIN', 'CUSTOMER')
 * Must be used AFTER the `protect` middleware.
 * @param {...string} roles - Allowed roles
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized('You must be logged in'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        ApiError.forbidden(`Role '${req.user.role}' is not allowed to perform this action`)
      );
    }

    next();
  };
};

module.exports = { restrictTo };
