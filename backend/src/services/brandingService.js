const analyzeService = require('./analyzeService');

/**
 * Default branding configuration for projects
 */
const getDefaultBranding = () => {
  return {
    colors: {
      primary: '#3b82f6',
      secondary: '#1e40af',
      accent: '#f59e0b',
      background: '#ffffff',
      text: '#1f2937'
    },
    typography: {
      fontFamily: 'Inter, sans-serif',
      headingFont: 'Inter, sans-serif'
    },
    logo: {
      url: '',
      alt: ''
    }
  };
};

/**
 * Fetch and extract branding details from a website URL
 * @param {string} url - Website URL to analyze
 * @returns {Promise<Object>} Branding extraction result
 */
const fetchAndExtractBranding = async (url) => {
  try {
    if (!url) {
      return { success: false, error: 'URL is required' };
    }

    const data = await analyzeService.extractProjectData(url);
    
    if (data && data.themeSystem) {
      const colors = data.themeSystem.colors || {};
      const brandingColors = { ...getDefaultBranding().colors };
      
      // Map extracted colors
      if (colors.primary) brandingColors.primary = colors.primary;
      if (colors.secondary) brandingColors.secondary = colors.secondary;
      if (colors.accent) brandingColors.accent = colors.accent;
      if (colors.background) brandingColors.background = colors.background;
      if (colors.text) brandingColors.text = colors.text;

      return {
        success: true,
        data: {
          colors: brandingColors,
          typography: data.themeSystem.typography || getDefaultBranding().typography,
          logo: { 
            url: data.logoUrl || '', 
            alt: data.name ? `${data.name} Logo` : 'Logo' 
          }
        }
      };
    }
    
    return {
      success: true,
      data: getDefaultBranding()
    };
  } catch (error) {
    console.error('Error fetching branding:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  getDefaultBranding,
  fetchAndExtractBranding
};
