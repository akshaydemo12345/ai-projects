'use strict';

const config = require('../config');
const Project = require('../models/Project');
const logger = require('../utils/logger');

/**
 * Middleware to authenticate proxy requests.
 * Supports:
 * 1. Global PROXY_API_KEY (for system-level integrations)
 * 2. Project-specific apiToken (for per-client plugin usage)
 */
const proxyAuth = async (req, res, next) => {
  try {
    // 1. Extract API Key (Header > Query param)
    let rawApiKey = req.headers['x-api-token'] || req.headers['x-api-key'] || req.headers['api-key'];
    if (!rawApiKey && req.query.api_key) rawApiKey = req.query.api_key;
    if (!rawApiKey && req.query.token) rawApiKey = req.query.token;

    if (!rawApiKey) {
      logger.error('🔑 [PROXY-AUTH] Access Denied: Missing API Key');
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'Proxy API Key or Project Token is missing. Please provide it via headers (x-api-token) or query parameters.' 
      });
    }

    // Handle `endpoint@@token` format implicitly if passed by older plugins
    let apiKey = rawApiKey.trim();
    if (apiKey.includes('@@')) {
      const parts = apiKey.split('@@');
      apiKey = parts[1] ? parts[1].trim() : apiKey;
    } else {
      // Handle base64 encoded token if it exists (but check if decoded has @@ too)
      try {
        const decoded = Buffer.from(apiKey, 'base64').toString('utf8');
        if (decoded.includes('@@')) {
          const parts = decoded.split('@@');
          apiKey = parts[1] ? parts[1].trim() : apiKey;
        }
      } catch (e) {
        // Not a valid base64 string, ignore
      }
    }

    // 2. Check Global Proxy Key (System-level access)
    // Trim to avoid accidental whitespace issues from .env
    const globalProxyKey = (config.proxy.apiKey || '').trim();
    if (globalProxyKey && apiKey.trim() === globalProxyKey) {
      req.authType = 'global';
      return next();
    }

    // 3. Check project-specific API Token (Client-level access)
    // This allows WordPress plugins to identify themselves via their own unique project token
    const project = await Project.findOne({ apiToken: apiKey.trim() });
    if (project) {
      req.project = project;
      req.authType = 'project';
      return next();
    }

    // 4. Unauthorized
    logger.error(`🔑 [PROXY-AUTH] Access Denied: Invalid token [${apiKey ? apiKey.substring(0, 8) : 'MISSING'}...] for ${req.method} ${req.originalUrl}`);
    
    // Add additional debug info for developers in non-production
    const debugInfo = process.env.NODE_ENV !== 'production' ? {
      receivedKey: apiKey ? `${apiKey.substring(0, 4)}...` : 'none',
      queryKeys: Object.keys(req.query),
      headerKeys: Object.keys(req.headers).filter(k => k.includes('api') || k.includes('token'))
    } : {};

    return res.status(401).json({ 
      error: 'Unauthorized', 
      message: 'Invalid Proxy API Key or Project Token.',
      ...debugInfo
    });

  } catch (err) {
    logger.error('🔥 [PROXY-AUTH-ERROR] Serious failure during authentication:', err);
    return res.status(500).json({ error: 'Internal Server Error during authentication' });
  }
};

module.exports = { proxyAuth };
