'use strict';

const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

// ─── Error Type Handlers ───────────────────────────────────────────────────────

/** Mongoose: duplicate key (e.g. unique email/slug/domain) */
const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue || {})[0] || 'field';
  const value = err.keyValue?.[field];
  return new AppError(`Duplicate value "${value}" for field "${field}". Please use a different value.`, 409);
};

/** Mongoose: invalid ObjectId or enum value */
const handleValidationError = (err) => {
  const messages = Object.values(err.errors).map((e) => e.message);
  return new AppError(`Validation failed: ${messages.join('. ')}`, 400);
};

/** Mongoose: invalid cast (e.g., bad ObjectId format) */
const handleCastError = (err) => {
  return new AppError(`Invalid value "${err.value}" for field "${err.path}".`, 400);
};

/** JWT: signature verification failed */
const handleJWTError = () =>
  new AppError('Invalid token. Please log in again.', 401);

/** JWT: token has expired */
const handleJWTExpiredError = () =>
  new AppError('Your session has expired. Please log in again.', 401);

// ─── Response Formatters ───────────────────────────────────────────────────────

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    // Safe to send to client
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Programmer error — don't leak details
  logger.error('UNHANDLED EXCEPTION', { message: err.message, stack: err.stack });
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong. Please try again later.',
  });
};

// ─── Global Error Middleware ───────────────────────────────────────────────────
const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  logger.error(`${req.method} ${req.originalUrl} → ${err.message}`, {
    statusCode: err.statusCode,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });

  const env = process.env.NODE_ENV || 'development';

  if (env === 'development') {
    return sendErrorDev(err, res);
  }

  // Production: transform known Mongoose / JWT errors into AppError
  let error = Object.assign(Object.create(Object.getPrototypeOf(err)), err);

  if (error.code === 11000)              error = handleDuplicateKeyError(error);
  if (error.name === 'ValidationError') error = handleValidationError(error);
  if (error.name === 'CastError')       error = handleCastError(error);
  if (error.name === 'JsonWebTokenError') error = handleJWTError();
  if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

  return sendErrorProd(error, res);
};

// ─── Unhandled Promise Rejections / Uncaught Exceptions ───────────────────────
process.on('unhandledRejection', (reason) => {
  logger.error('UNHANDLED REJECTION', { reason: String(reason) });
  // Give server time to finish outstanding requests before shutting down
  setTimeout(() => process.exit(1), 1000);
});

process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION', { message: err.message, stack: err.stack });
  process.exit(1);
});

module.exports = { errorMiddleware };
