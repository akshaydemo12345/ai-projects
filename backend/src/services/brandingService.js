'use strict';

/**
 * Placeholder Branding Service
 * Created to resolve the "Cannot find module '../services/brandingService'" error
 * without removing the user's new code.
 */

exports.getDefaultBranding = () => {
  return {};
};

exports.fetchAndExtractBranding = async (url) => {
  return { success: false, data: null };
};
