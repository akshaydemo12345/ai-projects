const mongoose = require('mongoose');

const autoLoginLogSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  status: {
    type: String,
    enum: ['SUCCESS', 'FAILED'],
    required: true,
    index: true,
  },
  reason: {
    type: String,
    required: true,
  },
  ip: {
    type: String,
    required: true,
    index: true,
  },
  userAgent: {
    type: String,
    default: 'Unknown',
  },
  country: {
    type: String,
    default: 'Unknown',
  },
  trustedSource: {
    type: String,
    enum: ['HMAC_SIGNATURE', 'API_KEY', 'IP_WHITELIST', 'OTP_VERIFIED', 'DIRECT_BYPASS', 'UNTRUSTED'],
    default: 'UNTRUSTED',
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
}, {
  timestamps: true,
});

// TTL index to automatically clean up old logs after 90 days
autoLoginLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });
// Index for fast query of recent suspicious activity per IP or email
autoLoginLogSchema.index({ ip: 1, status: 1, timestamp: -1 });
autoLoginLogSchema.index({ email: 1, status: 1, timestamp: -1 });

const AutoLoginLog = mongoose.model('AutoLoginLog', autoLoginLogSchema);

module.exports = AutoLoginLog;
