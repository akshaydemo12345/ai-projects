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
    url: import.meta.env.VITE_APP_URL || window.location.origin,
  },

  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || '',
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
    templateEngineEnabled: import.meta.env.VITE_TEMPLATE_ENGINE_ENABLED !== 'false',
    publishEngineEnabled: import.meta.env.VITE_PUBLISH_ENGINE_ENABLED !== 'false',
    // When true, the ?email=<email> auto-login flow skips OTP generation/
    // validation entirely and authenticates the user directly. Must be kept
    // in sync with the backend's STOP_OTP_VERIFICATION_EMAIL to avoid an
    // authentication flow mismatch between client and server.
    stopOtpVerificationEmail: import.meta.env.VITE_STOP_OTP_VERIFICATION_EMAIL === 'true',
  },
};

// Validation
if (config.isDevelopment) {
  console.log('🔧 Frontend Config:', {
    env: config.env,
    apiBaseUrl: config.api.baseUrl,
    appUrl: config.app.url,
  });
  console.log('🚀 Feature Flags:', {
    publishEngineEnabled: config.features.publishEngineEnabled,
    templateEngineEnabled: config.features.templateEngineEnabled,
    VITE_PUBLISH_ENGINE_ENABLED: import.meta.env.VITE_PUBLISH_ENGINE_ENABLED,
    VITE_TEMPLATE_ENGINE_ENABLED: import.meta.env.VITE_TEMPLATE_ENGINE_ENABLED,
  });
}

export default config;