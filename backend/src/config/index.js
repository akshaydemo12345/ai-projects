/**
 * Centralized Backend Configuration
 * Single source of truth for all environment variables and configuration
 */

require('dotenv').config();

const config = {
  // Environment
  env: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',

  // Server
  port: parseInt(process.env.PORT, 10) || 5000,
  host: process.env.HOST || '0.0.0.0',

  // Database
  database: {
    uri: process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/ai-landing-page',
  },

  // Frontend URLs
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:8080',
  },

  // API Configuration
  api: {
    baseUrl: process.env.API_BASE_URL || process.env.APP_BASE_URL || `http://localhost:${process.env.PORT || 5000}`,
    version: process.env.API_VERSION || 'v1',
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-change-in-production',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },

  // AI Configuration (Claude)
  ai: {
    anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
    model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6',
  },

  // Proxy Configuration
  proxy: {
    whitelist: (process.env.PROXY_WHITELIST || '').split(',').map(d => d.trim()).filter(Boolean),
    timeout: parseInt(process.env.PROXY_TIMEOUT, 10) || 10000,
    apiKey: process.env.PROXY_API_KEY || 'default-proxy-key',
  },
};

// Validation
if (config.isProduction && config.jwt.secret === 'your-super-secret-jwt-key-change-in-production') {
  console.warn('⚠️  WARNING: Using default JWT secret in production. Set JWT_SECRET in environment variables.');
}

if (config.isProduction && config.database.uri === 'mongodb://localhost:27017/ai-landing-page') {
  console.warn('⚠️  WARNING: Using default MongoDB URI in production. Set MONGODB_URI in environment variables.');
}

module.exports = config;
