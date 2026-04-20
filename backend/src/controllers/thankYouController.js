const Page = require('../models/Page');
const logger = require('../utils/logger');
const fs = require('fs');
const path = require('path');
const { generateTrackingScripts } = require('../utils/tracking');

/**
 * @desc    Get all available Thank You layouts
 * @route   GET /api/thank-you/layouts
 * @access  Private
 */
exports.getLayouts = async (req, res, next) => {
  try {
    const registryPath = path.join(__dirname, '../thank-you-layouts/layout-registry.json');
    
    if (!fs.existsSync(registryPath)) {
      return res.status(404).json({
        status: 'error',
        message: 'Layout registry not found'
      });
    }

    const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
    
    return res.status(200).json({
      status: 'success',
      data: {
        layouts: registry.layouts
      }
    });
  } catch (error) {
    logger.error('Error fetching layouts:', error);
    next(error);
  }
};

/**
 * @desc    Get Thank You config for a specific page
 * @route   GET /api/thank-you/config/:pageId
 * @access  Private
 */
exports.getThankYouConfig = async (req, res, next) => {
  try {
    const page = await Page.findOne({
      _id: req.params.pageId,
      userId: req.user._id
    });

    if (!page) {
      return res.status(404).json({
        status: 'error',
        message: 'Page not found'
      });
    }

    // Return thankYouConfig or defaults
    const config = page.thankYouConfig || {
      layout: 'default',
      content: {},
      tracking: {},
      branding: {}
    };

    return res.status(200).json({
      status: 'success',
      data: {
        config,
        pageId: page._id,
        industry: page.industry
      }
    });
  } catch (error) {
    logger.error('Error fetching Thank You config:', error);
    next(error);
  }
};

/**
 * @desc    Update Thank You config for a specific page
 * @route   PUT /api/thank-you/config/:pageId
 * @access  Private
 */
exports.updateThankYouConfig = async (req, res, next) => {
  try {
    const { layout, content, tracking, branding } = req.body;

    const page = await Page.findOne({
      _id: req.params.pageId,
      userId: req.user._id
    });

    if (!page) {
      return res.status(404).json({
        status: 'error',
        message: 'Page not found'
      });
    }

    // Update thankYouConfig
    page.thankYouConfig = {
      layout: layout || page.thankYouConfig?.layout || 'default',
      content: content || page.thankYouConfig?.content || {},
      tracking: tracking || page.thankYouConfig?.tracking || {},
      branding: branding || page.thankYouConfig?.branding || {}
    };

    await page.save();

    logger.info(`Thank You config updated for page ${page._id}`, {
      userId: req.user._id,
      layout: page.thankYouConfig.layout
    });

    return res.status(200).json({
      status: 'success',
      message: 'Thank You config updated successfully',
      data: {
        config: page.thankYouConfig
      }
    });
  } catch (error) {
    logger.error('Error updating Thank You config:', error);
    next(error);
  }
};

/**
 * @desc    Render Thank You page dynamically
 * @route   GET /api/thank-you/render/:pageSlug
 * @access  Public
 */
exports.renderThankYouPage = async (req, res, next) => {
  try {
    const { pageSlug } = req.params;
    
    // Read context from cookie (optional - for validation only)
    const lpContext = req.cookies.lp_context;
    let context = null;
    
    if (lpContext) {
      try {
        context = JSON.parse(lpContext);
        
        // Verify context matches current page slug
        if (context.pageSlug !== pageSlug) {
          logger.warn(`Context mismatch: expected ${pageSlug}, got ${context.pageSlug}`);
        }
        
        // Check if context is expired (5 minutes)
        if (Date.now() - context.timestamp > 300000) {
          logger.warn('Context expired for Thank You page');
        }
      } catch (e) {
        logger.warn('Invalid context format in cookie');
      }
    }

    // Fetch page config (works even without cookie)
    const page = await Page.findOne({ slug: pageSlug });

    if (!page) {
      return res.status(404).json({
        status: 'error',
        message: 'Page not found'
      });
    }

    // Get layout config
    const registryPath = path.join(__dirname, '../thank-you-layouts/layout-registry.json');
    const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
    
    // Determine layout (from config or industry-based default)
    const layoutId = page.thankYouConfig?.layout || 
                     registry.layouts.find(l => l.industry === page.industry)?.id || 
                     'default';
    
    const layoutConfig = registry.layouts.find(l => l.id === layoutId) || registry.layouts.find(l => l.id === 'default');

    // Load template
    const templatePath = path.join(__dirname, '../thank-you-layouts', layoutId, 'template.html');
    let actualTemplatePath = templatePath;
    
    if (!fs.existsSync(templatePath)) {
      // Fallback to default template
      actualTemplatePath = path.join(__dirname, '../thank-you-layouts/default/template.html');
      if (!fs.existsSync(actualTemplatePath)) {
        return res.status(500).json({
          status: 'error',
          message: 'Template not found'
        });
      }
    }

    let template = fs.readFileSync(actualTemplatePath, 'utf8');

    // Use custom template if provided
    if (page.thankYouConfig?.customTemplate) {
      template = page.thankYouConfig.customTemplate;
    }

    // Merge content: page config > layout defaults
    const content = {
      heading: page.thankYouConfig?.content?.heading || layoutConfig.defaultContent.heading,
      subheading: page.thankYouConfig?.content?.subheading || layoutConfig.defaultContent.subheading,
      ctaText: page.thankYouConfig?.content?.ctaText || layoutConfig.defaultContent.ctaText,
      ctaUrl: page.thankYouConfig?.content?.ctaUrl || layoutConfig.defaultContent.ctaUrl,
      phoneNumber: page.thankYouConfig?.content?.phoneNumber || layoutConfig.defaultContent.phoneNumber,
      offerText: page.thankYouConfig?.content?.offerText || layoutConfig.defaultContent.offerText,
      customMessage: page.thankYouConfig?.content?.customMessage || layoutConfig.defaultContent.customMessage
    };

    // Merge branding: page config > layout defaults > page colors
    const branding = {
      primaryColor: page.thankYouConfig?.branding?.primaryColor || layoutConfig.theme.primaryColor || page.primaryColor,
      secondaryColor: page.thankYouConfig?.branding?.secondaryColor || layoutConfig.theme.secondaryColor || page.secondaryColor,
      logoUrl: page.thankYouConfig?.branding?.logoUrl || page.logoUrl || ''
    };

    const businessName = page.title || 'Our Business';

    // Replace template variables
    let html = template
      .replace(/\{\{heading\}\}/g, escapeHtml(content.heading))
      .replace(/\{\{subheading\}\}/g, escapeHtml(content.subheading))
      .replace(/\{\{ctaText\}\}/g, escapeHtml(content.ctaText))
      .replace(/\{\{ctaUrl\}\}/g, escapeHtml(content.ctaUrl))
      .replace(/\{\{phoneNumber\}\}/g, escapeHtml(content.phoneNumber || ''))
      .replace(/\{\{offerText\}\}/g, escapeHtml(content.offerText || ''))
      .replace(/\{\{customMessage\}\}/g, escapeHtml(content.customMessage || ''))
      .replace(/\{\{primaryColor\}\}/g, escapeHtml(branding.primaryColor))
      .replace(/\{\{secondaryColor\}\}/g, escapeHtml(branding.secondaryColor))
      .replace(/\{\{businessName\}\}/g, escapeHtml(businessName));

    // Handle conditional blocks ({{#phoneNumber}}...{{/phoneNumber}})
    html = html.replace(/\{\{#phoneNumber\}\}([\s\S]*?)\{\{\/phoneNumber\}\}/g, content.phoneNumber ? '$1' : '');

    // Inject tracking scripts
    const trackingScripts = generateTrackingScripts(page.thankYouConfig?.tracking || {}, page._id, page.industry);
    html = html.replace('</head>', trackingScripts + '</head>');

    // Inject custom CSS if provided
    if (page.thankYouConfig?.customCss) {
      const customStyleTag = `<style>${page.thankYouConfig.customCss}</style>`;
      html = html.replace('</head>', customStyleTag + '</head>');
    }

    // Clear the context cookie after successful render
    res.clearCookie('lp_context');

    return res.send(html);
  } catch (error) {
    logger.error('Error rendering Thank You page:', error);
    next(error);
  }
};

/**
 * @desc    Preview Thank You page with custom content
 * @route   POST /api/thank-you/preview
 * @access  Private
 */
exports.previewThankYouPage = async (req, res, next) => {
  try {
    const { layout, content, branding } = req.body;

    const registryPath = path.join(__dirname, '../thank-you-layouts/layout-registry.json');
    const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
    
    const layoutConfig = registry.layouts.find(l => l.id === layout) || registry.layouts.find(l => l.id === 'default');
    const templatePath = path.join(__dirname, '../thank-you-layouts', layout, 'template.html');
    let actualTemplatePath = templatePath;

    if (!fs.existsSync(templatePath)) {
      // Fallback to default template
      actualTemplatePath = path.join(__dirname, '../thank-you-layouts/default/template.html');
      if (!fs.existsSync(actualTemplatePath)) {
        return res.status(500).json({
          status: 'error',
          message: 'Template not found'
        });
      }
    }

    let template = fs.readFileSync(actualTemplatePath, 'utf8');

    const mergedContent = {
      heading: content?.heading || layoutConfig.defaultContent.heading,
      subheading: content?.subheading || layoutConfig.defaultContent.subheading,
      ctaText: content?.ctaText || layoutConfig.defaultContent.ctaText,
      ctaUrl: content?.ctaUrl || layoutConfig.defaultContent.ctaUrl,
      phoneNumber: content?.phoneNumber || layoutConfig.defaultContent.phoneNumber,
      offerText: content?.offerText || layoutConfig.defaultContent.offerText,
      customMessage: content?.customMessage || layoutConfig.defaultContent.customMessage
    };

    const mergedBranding = {
      primaryColor: branding?.primaryColor || layoutConfig.theme.primaryColor,
      secondaryColor: branding?.secondaryColor || layoutConfig.theme.secondaryColor,
      logoUrl: branding?.logoUrl || ''
    };

    let html = template
      .replace(/\{\{heading\}\}/g, escapeHtml(mergedContent.heading))
      .replace(/\{\{subheading\}\}/g, escapeHtml(mergedContent.subheading))
      .replace(/\{\{ctaText\}\}/g, escapeHtml(mergedContent.ctaText))
      .replace(/\{\{ctaUrl\}\}/g, escapeHtml(mergedContent.ctaUrl))
      .replace(/\{\{phoneNumber\}\}/g, escapeHtml(mergedContent.phoneNumber || ''))
      .replace(/\{\{offerText\}\}/g, escapeHtml(mergedContent.offerText || ''))
      .replace(/\{\{customMessage\}\}/g, escapeHtml(mergedContent.customMessage || ''))
      .replace(/\{\{primaryColor\}\}/g, escapeHtml(mergedBranding.primaryColor))
      .replace(/\{\{secondaryColor\}\}/g, escapeHtml(mergedBranding.secondaryColor))
      .replace(/\{\{businessName\}\}/g, escapeHtml('Preview Business'));

    html = html.replace(/\{\{#phoneNumber\}\}([\s\S]*?)\{\{\/phoneNumber\}\}/g, mergedContent.phoneNumber ? '$1' : '');

    return res.send(html);
  } catch (error) {
    logger.error('Error previewing Thank You page:', error);
    next(error);
  }
};

// Helper function to escape HTML
function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

