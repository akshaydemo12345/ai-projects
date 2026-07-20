'use strict';

const mongoose = require('mongoose');

/**
 * Backing store for dbRateLimiter (middleware/dbRateLimiter.js).
 * One document is inserted per request hit; MongoDB's TTL monitor deletes it
 * automatically once `expiresAt` passes, so the collection self-cleans and
 * `countDocuments` for a given `key` tells us how many hits are still "in window".
 */
const rateLimitHitSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    index: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

// TTL index: MongoDB removes documents once `expiresAt` is in the past.
rateLimitHitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('RateLimitHit', rateLimitHitSchema);
