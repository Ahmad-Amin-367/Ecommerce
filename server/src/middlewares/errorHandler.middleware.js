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

  // ─── Handle Prisma known errors ──────────────────────────────────────────────
  if (err.code === 'P2002') {
    // Unique constraint violation
    const fields = err.meta?.target?.join(', ') || 'field';
    statusCode = 409;
    message = `A record with this ${fields} already exists`;
  } else if (err.code === 'P2025') {
    // Record not found
    statusCode = 404;
    message = 'Record not found';
  } else if (err.code === 'P2003') {
    // Foreign key constraint failed
    statusCode = 400;
    message = 'Related record does not exist';
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
