'use strict';

/**
 * Input Sanitization Middleware
 *
 * Protects against:
 *  - NoSQL injection via MongoDB operators ($where, $gt, etc.)
 *  - Basic XSS (strips <script> tags and HTML event handlers from strings)
 *
 * No external packages required.
 */

// ─── XSS: strip dangerous HTML from string values ─────────────────────────────
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')  // <script> blocks
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')           // inline event handlers
    .replace(/javascript\s*:/gi, '')                        // javascript: URIs
    .trim();
};

// ─── NoSQL injection: remove keys starting with $ ─────────────────────────────
const sanitizeObject = (obj, keyName = null) => {
  if (obj === null || typeof obj !== 'object') {
    // Skip script stripping for fields that are intended to contain scripts or HTML
    const skipFields = [
      'mainHeader', 'mainFooter', 
      'thankYouHeader', 'thankYouFooter', 
      'thankYouConversionScript', 'content', 'styles'
    ];
    
    if (typeof obj === 'string') {
      if (keyName && skipFields.includes(keyName)) {
        // Only strip MongoDB stuff, keep HTML/Scripts
        return obj.trim();
      }
      return sanitizeString(obj);
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item, keyName));
  }

  return Object.keys(obj).reduce((acc, key) => {
    // Drop MongoDB operator keys
    if (key.startsWith('$')) return acc;
    // Recursively sanitize nested values
    acc[key] = sanitizeObject(obj[key], key);
    return acc;
  }, {});
};

// ─── Middleware ────────────────────────────────────────────────────────────────
const sanitizeInput = (req, res, next) => {
  if (req.body)   req.body   = sanitizeObject(req.body);
  if (req.query)  req.query  = sanitizeObject(req.query);
  if (req.params) req.params = sanitizeObject(req.params);
  next();
};

module.exports = { sanitizeInput };
