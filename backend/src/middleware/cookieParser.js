'use strict';

/**
 * Simple Cookie Parser Middleware
 * Parses the Cookie header and populates req.cookies with an object keyed by the cookie names.
 */
const cookieParser = (req, res, next) => {
  const cookieHeader = req.headers.cookie;
  req.cookies = {};

  if (!cookieHeader) {
    return next();
  }

  cookieHeader.split(';').forEach((cookie) => {
    const [name, ...rest] = cookie.split('=');
    const value = rest.join('=');
    
    if (name && value) {
      req.cookies[name.trim()] = decodeURIComponent(value.trim());
    }
  });

  next();
};

module.exports = { cookieParser };
