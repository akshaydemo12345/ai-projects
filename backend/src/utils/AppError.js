'use strict';

/**
 * Centralized Operational Error class.
 * All thrown instances of AppError are treated as "expected" errors
 * and returned to the client as clean JSON responses.
 */
class AppError extends Error {
  /**
   * @param {string} message - Human-readable error message
   * @param {number} statusCode - HTTP status code (4xx client / 5xx server)
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // Distinguishes from programmer errors

    // Capture clean stack trace (excludes this constructor)
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
