'use strict';

const RateLimitHit = require('../models/RateLimitHit');
const logger = require('../utils/logger');

/**
 * MongoDB-backed rate limiter.
 *
 * Unlike middleware/rateLimiter.js (in-memory `Map`), this is consistent
 * across every PM2 cluster worker and across restarts/deploys — important
 * for security-sensitive endpoints like OTP send/verify, where "5 per 15 min"
 * should actually mean 5 total, not 5-per-process.
 *
 * @param {Object} options
 * @param {number} options.windowMs   - Time window in milliseconds
 * @param {number} options.max        - Max hits per window per key
 * @param {string} [options.message]  - Custom error message
 * @param {(req) => string} [options.keyFn] - How to derive the limit key.
 *        Defaults to client IP. Pass a function to limit by something else,
 *        e.g. the target email, so an attacker rotating IPs can't bypass it:
 *        keyFn: (req) => (req.body?.email || '').toLowerCase()
 */
const dbRateLimiter = ({
  windowMs = 60_000,
  max = 10,
  message = 'Too many requests, please try again later.',
  keyFn,
} = {}) => {
  return async (req, res, next) => {
    try {
      const ip =
        req.headers['x-forwarded-for']?.split(',')[0].trim() ||
        req.socket?.remoteAddress ||
        'unknown';

      const identity = keyFn ? keyFn(req) : ip;
      if (!identity) return next(); // e.g. keyFn on a missing email — let validation handle it

      const key = `${req.baseUrl}${req.route?.path || req.path}:${identity}`;

      const activeCount = await RateLimitHit.countDocuments({
        key,
        expiresAt: { $gt: new Date() },
      });

      if (activeCount >= max) {
        const oldest = await RateLimitHit.findOne({ key }).sort({ expiresAt: 1 });
        const retryAfter = oldest ? Math.max(1, Math.ceil((oldest.expiresAt - Date.now()) / 1000)) : Math.ceil(windowMs / 1000);
        res.set('Retry-After', retryAfter);
        return res.status(429).json({ status: 'fail', message });
      }

      await RateLimitHit.create({ key, expiresAt: new Date(Date.now() + windowMs) });
      next();
    } catch (err) {
      // Fail-open on DB errors so a Mongo blip doesn't lock out all auth
      // traffic — but log loudly so it's visible and can be investigated.
      logger.error('❌ [dbRateLimiter] error, allowing request through', { error: err.message });
      next();
    }
  };
};

module.exports = { dbRateLimiter };
