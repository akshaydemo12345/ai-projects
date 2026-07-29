const crypto = require('crypto');
const config = require('../config');

/**
 * Utility to generate secure, signed Auto-Login URLs for trusted integrations.
 *
 * @param {string} email - Target user email address
 * @param {string} [website] - Optional website URL parameter
 * @param {string} [baseUrl] - Base application URL (defaults to FRONTEND_URL or http://localhost:5173)
 * @param {string} [secret] - Secret key for HMAC signing (defaults to config.autoLogin.secret)
 * @returns {string} Fully formatted signed auto-login URL
 */
function generateAutoLoginUrl(email, website = '', baseUrl = '', secret = '') {
  const hmacSecret = secret || config.autoLogin.secret;
  const targetBaseUrl = baseUrl || process.env.FRONTEND_URL || 'http://localhost:5173';
  const ts = Math.floor(Date.now() / 1000).toString();

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedWebsite = (website || '').trim();

  const payload = `${normalizedEmail}:${ts}${normalizedWebsite ? `:${normalizedWebsite}` : ''}`;
  const sig = crypto.createHmac('sha256', hmacSecret).update(payload).digest('hex');

  const queryParams = new URLSearchParams();
  queryParams.set('email', normalizedEmail);
  queryParams.set('ts', ts);
  queryParams.set('sig', sig);
  if (normalizedWebsite) {
    queryParams.set('website', normalizedWebsite);
  }

  return `${targetBaseUrl.replace(/\/$/, '')}/auth/auto-login?${queryParams.toString()}`;
}

module.exports = {
  generateAutoLoginUrl,
};
