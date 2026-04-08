'use strict';

/**
 * Simple in-memory rate limiter — no external package required.
 * Enforces a sliding-window per IP address.
 *
 * @param {Object} options
 * @param {number} options.windowMs   - Time window in milliseconds
 * @param {number} options.max        - Max requests per window per IP
 * @param {string} [options.message]  - Custom error message
 */
const rateLimiter = ({ windowMs = 60_000, max = 10, message = 'Too many requests, please try again later.' } = {}) => {
  // Map<ip, { count, resetAt }>
  const store = new Map();

  // Cleanup expired entries every windowMs to avoid memory accumulation
  setInterval(() => {
    const now = Date.now();
    for (const [key, val] of store.entries()) {
      if (val.resetAt <= now) store.delete(key);
    }
  }, windowMs).unref();

  return (req, res, next) => {
    const ip =
      req.headers['x-forwarded-for']?.split(',')[0].trim() ||
      req.socket?.remoteAddress ||
      'unknown';

    const now = Date.now();
    const entry = store.get(ip);

    if (!entry || entry.resetAt <= now) {
      store.set(ip, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (entry.count >= max) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
      res.set('Retry-After', retryAfter);
      return res.status(429).json({ status: 'fail', message });
    }

    entry.count += 1;
    next();
  };
};

module.exports = { rateLimiter };
