const fs = require('fs');
const path = require('path');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize, errors } = format;

// Ensure logs directory exists
const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
  try {
    fs.mkdirSync(logDir, { recursive: true });
  } catch (err) {
    console.warn('Could not create logs directory:', err.message);
  }
}

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    // Console transport (always)
    new transports.Console({
      format: combine(
        colorize({ all: true }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        logFormat
      ),
    }),
    // Error log file
    new transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
    }),
    // Combined log file
    new transports.File({
      filename: path.join(logDir, 'combined.log'),
    }),
  ],
  exceptionHandlers: [new transports.File({ filename: path.join(logDir, 'exceptions.log') })],
  rejectionHandlers: [new transports.File({ filename: path.join(logDir, 'rejections.log') })],
});

module.exports = logger;
