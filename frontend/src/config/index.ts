/**
 * Centralized Frontend Configuration
 * Single source of truth for all environment variables and API configuration
 */

const config = {
  // Environment
  env: import.meta.env.MODE || 'development',
  isDevelopment: import.meta.env.MODE === 'development',
  isProduction: import.meta.env.MODE === 'production',

  // App Configuration
  app: {
    name: import.meta.env.VITE_APP_NAME || 'AI Landing Page Builder',
    url: import.meta.env.VITE_APP_URL || 'http://localhost:8080',
  },

  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:6000',
    version: 'v1',
    
    // API Endpoints (centralized route definitions)
    routes: {
      auth: '/auth',
      user: '/user',
      projects: '/projects',
      pages: '/pages',
      ai: '/ai',
      api: '/api',
      leads: '/leads',
      plugin: '/plugin',
    },
  },

  // Feature Flags
  features: {
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    enableDebugMode: import.meta.env.VITE_ENABLE_DEBUG === 'true',
  },
};

// Validation
if (config.isDevelopment) {
  console.log('🔧 Frontend Config:', {
    env: config.env,
    apiBaseUrl: config.api.baseUrl,
    appUrl: config.app.url,
  });
}

export default config;
