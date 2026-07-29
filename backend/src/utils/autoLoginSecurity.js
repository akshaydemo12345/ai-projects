'use strict';

const crypto = require('crypto');
const config = require('../config');
const logger = require('./logger');
const AutoLoginLog = require('../models/AutoLoginLog');
const { safeCompareHex } = require('./jwt');

/**
 * Extract client IP address accurately handling proxies
 */
function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress || '127.0.0.1';
}

/**
 * Extract country/region from headers (Cloudflare, AWS CloudFront, Fastly, etc.)
 */
function getClientCountry(req) {
  return (
    req.headers['cf-ipcountry'] ||
    req.headers['x-country-code'] ||
    req.headers['cloudfront-viewer-country'] ||
    req.headers['x-appengine-country'] ||
    'Unknown'
  );
}

/**
 * Verify HMAC signature and timestamp
 * Format: HMAC-SHA256("email:ts" or "email:ts:website", secret)
 */
function verifyHmacSignature(email, ts, sig, website = '') {
  if (!sig || !ts) return false;

  let requestTs = Number(ts);
  if (isNaN(requestTs)) return false;

  // Convert seconds to milliseconds if timestamp is provided in seconds (10 digits vs 13 digits)
  const requestTsMs = requestTs < 1e11 ? requestTs * 1000 : requestTs;

  // Enforce 5-minute timestamp window to prevent replay attacks
  const now = Date.now();
  if (Math.abs(now - requestTsMs) > 5 * 60 * 1000) {
    logger.warn('Auto-login HMAC signature timestamp expired', { email, ts, requestTsMs, now });
    return false;
  }

  const secret = config.autoLogin.secret;
  
  // Calculate expected signatures for both with-website and without-website to be flexible
  const dataString1 = `${email.toLowerCase()}:${ts}`;
  const dataString2 = website ? `${email.toLowerCase()}:${ts}:${website.trim()}` : dataString1;

  const expectedSig1 = crypto.createHmac('sha256', secret).update(dataString1).digest('hex');
  const expectedSig2 = crypto.createHmac('sha256', secret).update(dataString2).digest('hex');

  return safeCompareHex(sig.toLowerCase(), expectedSig1.toLowerCase()) || 
         safeCompareHex(sig.toLowerCase(), expectedSig2.toLowerCase());
}

/**
 * Verify API Key if provided
 */
function verifyApiKey(reqKey) {
  if (!config.autoLogin.apiKey || !reqKey) return false;
  return safeCompareHex(reqKey, config.autoLogin.apiKey);
}

/**
 * Verify if client IP is in configured IP whitelist
 */
function isIpWhitelisted(clientIp) {
  if (!config.autoLogin.ipWhitelist || config.autoLogin.ipWhitelist.length === 0) {
    return false;
  }
  return config.autoLogin.ipWhitelist.includes(clientIp);
}

/**
 * Check recent failed attempts and detect suspicious activity
 */
async function checkSuspiciousActivity(email, ip) {
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

  const [failedIpCount, failedEmailCount] = await Promise.all([
    AutoLoginLog.countDocuments({
      ip,
      status: 'FAILED',
      timestamp: { $gte: fifteenMinutesAgo },
    }),
    AutoLoginLog.countDocuments({
      email: (email || '').toLowerCase(),
      status: 'FAILED',
      timestamp: { $gte: fifteenMinutesAgo },
    }),
  ]);

  const maxAttempts = config.autoLogin.maxFailedAttemptsWindow || 5;
  const isSuspicious = failedIpCount >= maxAttempts || failedEmailCount >= maxAttempts;

  if (isSuspicious) {
    logger.warn('🚨 SECURITY ALERT: Suspicious auto-login activity detected', {
      email,
      ip,
      failedIpCount,
      failedEmailCount,
      threshold: maxAttempts,
      timestamp: new Date().toISOString(),
    });
  }

  return { isSuspicious, failedIpCount, failedEmailCount };
}

/**
 * Log auto-login attempt details to DB and audit logs
 */
async function logAutoLoginAttempt(req, { email, status, reason, trustedSource }) {
  const ip = getClientIp(req);
  const userAgent = req.headers['user-agent'] || 'Unknown';
  const country = getClientCountry(req);
  const timestamp = new Date();

  try {
    await AutoLoginLog.create({
      email: (email || 'unknown').toLowerCase(),
      status,
      reason,
      ip,
      userAgent,
      country,
      trustedSource: trustedSource || 'UNTRUSTED',
      timestamp,
    });

    logger.info(`Auto-login attempt [${status}]`, {
      email,
      status,
      reason,
      ip,
      country,
      trustedSource,
      userAgent,
    });
  } catch (err) {
    logger.error('Failed to record AutoLoginLog audit entry', { error: err.message });
  }
}

/**
 * Return a generic, uniform error response to prevent user enumeration
 */
function sendGenericAuthError(res, statusCode = 401) {
  return res.status(statusCode).json({
    status: 'fail',
    message: 'Authentication failed. Invalid or expired request.',
  });
}

module.exports = {
  getClientIp,
  getClientCountry,
  verifyHmacSignature,
  verifyApiKey,
  isIpWhitelisted,
  checkSuspiciousActivity,
  logAutoLoginAttempt,
  sendGenericAuthError,
};
