const ApiError = require('../utils/apiError');
const logger = require('../config/logger');

/**
 * Global Error Handler Middleware
 * Must be the LAST middleware registered in app.js.
 * Catches all errors passed to next(err).
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || [];

  // ─── Handle Sequelize errors ──────────────────────────────────────────────
  if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409;
    message = err.errors?.[0]?.message || 'A record with this value already exists';
    errors = err.errors?.map(e => ({ field: e.path, message: e.message })) || [];
  } else if (err.name === 'SequelizeValidationError') {
    statusCode = 400;
    message = err.errors?.[0]?.message || 'Validation error';
    errors = err.errors?.map(e => ({ field: e.path, message: e.message })) || [];
  } else if (err.name === 'SequelizeForeignKeyConstraintError') {
    statusCode = 400;
    message = 'Related record does not exist or is constrained';
  }

  // ─── Handle JWT errors ────────────────────────────────────────────────────
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token has expired';
  }

  // ─── Handle Multer upload errors ──────────────────────────────────────────
  if (err.name === 'MulterError') {
    statusCode = 400;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File is too large. Maximum size is 5MB.';
    } else {
      message = `Image upload error: ${err.message}`;
    }
  }

  // ─── Log the error ────────────────────────────────────────────────────────
  if (statusCode >= 500) {
    logger.error(`[${req.method}] ${req.originalUrl} — ${message}`, {
      stack: err.stack,
      body: req.body,
    });
  } else {
    logger.warn(`[${req.method}] ${req.originalUrl} — ${statusCode}: ${message}`);
  }

  // ─── Send response ────────────────────────────────────────────────────────
  const response = { success: false, message };
  if (errors.length > 0) response.errors = errors;

  // Only include stack trace in development
  if (process.env.NODE_ENV === 'development' && statusCode >= 500) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = { errorHandler };
