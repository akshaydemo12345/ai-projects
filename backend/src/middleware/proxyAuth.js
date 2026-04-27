'use strict';

const config = require('../config');
const Project = require('../models/Project');

/**
 * Middleware to validate API Key for Proxy requests
 */
const proxyAuth = async (req, res, next) => {
  const apiKey = req.headers['x-api-token'] || req.query.api_key;
  
  if (!apiKey) {
    return res.status(401).json({ error: 'Unauthorized: Proxy API Key is missing' });
  }

  // 1. Check Global Proxy Key (from .env)
  if (apiKey === config.proxy.apiKey) {
    return next();
  }

  // 2. Check Project-specific API Token (from DB)
  try {
    const project = await Project.findOne({ apiToken: apiKey });
    if (project) {
      req.project = project;
      return next();
    }
  } catch (error) {
    console.error('Proxy Auth DB Error:', error);
    return res.status(500).json({ error: 'Internal Server Error during authentication' });
  }
  
  return res.status(401).json({ error: 'Unauthorized: Invalid Proxy API Key' });
};

module.exports = { proxyAuth };
