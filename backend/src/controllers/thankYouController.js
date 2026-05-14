const Page = require('../models/Page');
const Project = require('../models/Project');
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
      return res.status(404).json({ status: 'error', message: 'Layout registry not found' });
    }
    const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
    return res.status(200).json({ status: 'success', data: { layouts: registry.layouts } });
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
    const page = await Page.findOne({ _id: req.params.pageId, userId: req.user._id });
    if (!page) {
      return res.status(404).json({ status: 'error', message: 'Page not found' });
    }
    const config = page.thankYouConfig || { layout: 'default', content: {}, tracking: {}, branding: {} };
    return res.status(200).json({ status: 'success', data: { config, pageId: page._id, industry: page.industry } });
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
    const page = await Page.findOne({ _id: req.params.pageId, userId: req.user._id });
    if (!page) {
      return res.status(404).json({ status: 'error', message: 'Page not found' });
    }
    page.thankYouConfig = {
      layout: layout || page.thankYouConfig?.layout || 'default',
      content: content || page.thankYouConfig?.content || {},
      tracking: tracking || page.thankYouConfig?.tracking || {},
      branding: branding || page.thankYouConfig?.branding || {}
    };
    await page.save();
    return res.status(200).json({ status: 'success', message: 'Thank You config updated successfully', data: { config: page.thankYouConfig } });
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
    const { pageSlug: rawPageSlug } = req.params;
    const pageSlug = (rawPageSlug || "").replace(/^api\/v1\/proxy\//i, '');
    const slugParts = (pageSlug || "").split('/');
    const actualPageSlug = slugParts[slugParts.length - 1]; 
    const urlPreSlug = slugParts.slice(0, slugParts.length - 1).join('/'); 
 
    let page = null;
    const potentialPages = await Page.find({ slug: actualPageSlug, isDeleted: { $ne: true } });
    if (potentialPages.length > 0) {
      if (urlPreSlug) {
        for (const p of potentialPages) {
          const project = await Project.findById(p.projectId);
          const projectPreSlug = (project?.preSlug || "").replace(/^\/+|\/+$/g, '');
          if (projectPreSlug === urlPreSlug) { page = p; break; }
        }
      } else {
        for (const p of potentialPages) {
          const project = await Project.findById(p.projectId);
          if (!project?.preSlug) { page = p; break; }
        }
      }
    }
    if (!page) return res.status(404).json({ status: 'error', message: 'Page not found' });

    const registryPath = path.join(__dirname, '../thank-you-layouts/layout-registry.json');
    const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
    const layoutId = page.thankYouConfig?.layout || registry.layouts.find(l => l.industry === page.industry)?.id || 'default';
    const layoutConfig = registry.layouts.find(l => l.id === layoutId) || registry.layouts.find(l => l.id === 'default');

    const templatePath = path.join(__dirname, '../thank-you-layouts', layoutId, 'template.html');
    let actualTemplatePath = templatePath;
    if (!fs.existsSync(templatePath)) actualTemplatePath = path.join(__dirname, '../thank-you-layouts/default/template.html');
    let template = fs.readFileSync(actualTemplatePath, 'utf8');

    // Dynamic CTA URL (Back to landing page)
    let landingPageUrl = '/';
    try {
      const project = await Project.findById(page.projectId);
      const preSlug = (project?.preSlug || "").replace(/^\/+|\/+$/g, '');
      landingPageUrl = preSlug ? `/${preSlug}/${page.slug}` : `/${page.slug}`;
    } catch (e) { }

    const content = {
      heading: page.thankYouConfig?.content?.heading || layoutConfig.defaultContent.heading,
      subheading: page.thankYouConfig?.content?.subheading || layoutConfig.defaultContent.subheading,
      ctaText: page.thankYouConfig?.content?.ctaText || layoutConfig.defaultContent.ctaText,
      ctaUrl: page.thankYouConfig?.content?.ctaUrl && page.thankYouConfig?.content?.ctaUrl !== '#' ? page.thankYouConfig.content.ctaUrl : landingPageUrl,
      phoneNumber: page.thankYouConfig?.content?.phoneNumber || layoutConfig.defaultContent.phoneNumber,
      offerText: page.thankYouConfig?.content?.offerText || layoutConfig.defaultContent.offerText,
      customMessage: page.thankYouConfig?.content?.customMessage || layoutConfig.defaultContent.customMessage
    };

    const branding = {
      primaryColor: page.thankYouConfig?.branding?.primaryColor || layoutConfig.theme.primaryColor,
      secondaryColor: page.thankYouConfig?.branding?.secondaryColor || layoutConfig.theme.secondaryColor,
      logoUrl: page.thankYouConfig?.branding?.logoUrl || page.logoUrl || ''
    };

    const businessName = page.title || 'Our Business';
    let html = template;

    // Inject Landing Page Styles to ensure Header/Footer look correct
    const landingStyles = page.styles || page.landingPageStyles || '';
    if (landingStyles) {
      html = html.replace('</head>', `<style id="landing-page-styles">${landingStyles}</style></head>`);
    }

    // Visual Component Injection
    let visualHeader = normalizeVisualComponent(page.thankYouHeader || page.mainHeader);
    let visualFooter = normalizeVisualComponent(page.thankYouFooter || page.mainFooter);

    // Fallback: Try to extract from landing page content HTML
    if (!visualHeader || !visualFooter) {
      const landingHtml = typeof page.content === 'string' ? page.content : (page.content?.fullHtml || '');
      if (landingHtml) {
        if (!visualHeader) {
          const headerMatch = landingHtml.match(/<header[\s\S]*?<\/header>/i);
          if (headerMatch) visualHeader = headerMatch[0];
        }
        if (!visualFooter) {
          const footerMatch = landingHtml.match(/<footer[\s\S]*?<\/footer>/i);
          if (footerMatch) visualFooter = footerMatch[0];
        }
      }
    }

    if (visualHeader) html = html.replace(/<header[\s\S]*?<\/header>/i, visualHeader);
    if (visualFooter) html = html.replace(/<footer[\s\S]*?<\/footer>/i, visualFooter);

    html = processConditionalBlocks(content, branding, businessName, html);

    const trackingScripts = generateTrackingScripts(page.thankYouConfig?.tracking || {}, page._id, page.industry);
    html = html.replace('</head>', trackingScripts + '</head>');
    if (page.thankYouConfig?.customCss) html = html.replace('</head>', `<style>${page.thankYouConfig.customCss}</style></head>`);

    let finalHeaderScript = normalizeScriptLocal(page.mainHeader);
    if (page.thankYouHeader) finalHeaderScript += '\n' + normalizeScriptLocal(page.thankYouHeader);
    let finalFooterScript = normalizeScriptLocal(page.mainFooter);
    if (page.thankYouFooter) finalFooterScript += '\n' + normalizeScriptLocal(page.thankYouFooter);
    if (page.thankYouConversionScript) finalFooterScript += '\n' + normalizeScriptLocal(page.thankYouConversionScript);

    if (finalHeaderScript.trim()) html = html.replace('</head>', '\n' + finalHeaderScript + '\n</head>');
    if (finalFooterScript.trim()) {
      if (/<\/body>/i.test(html)) html = html.replace(/<\/body>/i, '\n' + finalFooterScript + '\n</body>');
      else html += '\n' + finalFooterScript;
    }

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
    const { layout: rawLayout, content, branding, pageId } = req.body;
    const layout = rawLayout || 'default';
    let page = null;
    if (pageId) page = await Page.findById(pageId);

    const registryPath = path.join(__dirname, '../thank-you-layouts/layout-registry.json');
    const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
    const layoutConfig = registry.layouts.find(l => l.id === layout) || registry.layouts.find(l => l.id === 'default');

    const templatePath = path.join(__dirname, '../thank-you-layouts', layout, 'template.html');
    let actualTemplatePath = templatePath;
    if (!fs.existsSync(templatePath)) actualTemplatePath = path.join(__dirname, '../thank-you-layouts/default/template.html');
    let template = fs.readFileSync(actualTemplatePath, 'utf8');

    let landingPageUrl = '/';
    if (page) {
      try {
        const project = await Project.findById(page.projectId);
        const preSlug = (project?.preSlug || "").replace(/^\/+|\/+$/g, '');
        landingPageUrl = preSlug ? `/${preSlug}/${page.slug}` : `/${page.slug}`;
      } catch (e) { }
    }

    const mergedContent = {
      heading: content?.heading || layoutConfig.defaultContent.heading,
      subheading: content?.subheading || layoutConfig.defaultContent.subheading,
      ctaText: content?.ctaText || layoutConfig.defaultContent.ctaText,
      ctaUrl: content?.ctaUrl && content?.ctaUrl !== '#' ? content.ctaUrl : landingPageUrl,
      phoneNumber: content?.phoneNumber || layoutConfig.defaultContent.phoneNumber,
      offerText: content?.offerText || layoutConfig.defaultContent.offerText,
      customMessage: content?.customMessage || layoutConfig.defaultContent.customMessage
    };

    const mergedBranding = {
      primaryColor: branding?.primaryColor || layoutConfig.theme.primaryColor,
      secondaryColor: branding?.secondaryColor || layoutConfig.theme.secondaryColor,
      logoUrl: branding?.logoUrl || (page ? page.logoUrl : '') || ''
    };

    const businessName = (page ? page.title : 'Preview Business') || 'Preview Business';
    let html = template;

    if (page) {
      // Inject Landing Page Styles
      const landingStyles = page.styles || page.landingPageStyles || '';
      if (landingStyles) {
        html = html.replace('</head>', `<style id="landing-page-styles">${landingStyles}</style></head>`);
      }

      let visualHeader = normalizeVisualComponent(page.thankYouHeader || page.mainHeader);
      let visualFooter = normalizeVisualComponent(page.thankYouFooter || page.mainFooter);

      // Fallback: Try to extract from landing page content HTML
      if (!visualHeader || !visualFooter) {
        const landingHtml = typeof page.content === 'string' ? page.content : (page.content?.fullHtml || '');
        if (landingHtml) {
          if (!visualHeader) {
            const headerMatch = landingHtml.match(/<header[\s\S]*?<\/header>/i);
            if (headerMatch) visualHeader = headerMatch[0];
          }
          if (!visualFooter) {
            const footerMatch = landingHtml.match(/<footer[\s\S]*?<\/footer>/i);
            if (footerMatch) visualFooter = footerMatch[0];
          }
        }
      }

      if (visualHeader) html = html.replace(/<header[\s\S]*?<\/header>/i, visualHeader);
      if (visualFooter) html = html.replace(/<footer[\s\S]*?<\/footer>/i, visualFooter);
    }

    html = processConditionalBlocks(mergedContent, mergedBranding, businessName, html);
    return res.send(html);
  } catch (error) {
    logger.error('Error previewing Thank You page:', error);
    next(error);
  }
};

// --- HELPER FUNCTIONS ---

function escapeHtml(text) {
  if (!text) return '';
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function normalizeScriptLocal(value = '') {
  const trimmed = value.trim();
  if (!trimmed) return '';
  return /<(script|style|meta|link)[\s\S]*?>/i.test(trimmed) ? trimmed : `<script>${trimmed}</script>`;
}

function normalizeVisualComponent(value = '') {
  let content = value.trim();
  if (!content) return '';
  content = content.replace(/<script[\s\S]*?>([\s\S]*?)<\/script>/gi, '$1').trim();
  if (/<(div|header|footer|section|nav|img|a|span|p|ul|li)[\s\S]*?>/i.test(content)) return content;
  return '';
}

function processConditionalBlocks(content, branding, businessName, html) {
  let processedHtml = html;
  processedHtml = processedHtml.replace(/\{\{#phoneNumber\}\}([\s\S]*?)\{\{\/phoneNumber\}\}/g, content.phoneNumber ? '$1' : '');
  processedHtml = processedHtml.replace(/\{\{\^phoneNumber\}\}([\s\S]*?)\{\{\/phoneNumber\}\}/g, !content.phoneNumber ? '$1' : '');
  processedHtml = processedHtml.replace(/\{\{#logoUrl\}\}([\s\S]*?)\{\{\/logoUrl\}\}/g, branding.logoUrl ? '$1' : '');
  processedHtml = processedHtml.replace(/\{\{\^logoUrl\}\}([\s\S]*?)\{\{\/logoUrl\}\}/g, !branding.logoUrl ? '$1' : '');
  processedHtml = processedHtml.replace(/\{\{#offerText\}\}([\s\S]*?)\{\{\/offerText\}\}/g, content.offerText ? '$1' : '');
  processedHtml = processedHtml.replace(/\{\{\^offerText\}\}([\s\S]*?)\{\{\/offerText\}\}/g, !content.offerText ? '$1' : '');
  processedHtml = processedHtml.replace(/\{\{#offerText\}\}([\s\S]*?)\{\{\/offerText\}\}/g, content.offerText ? '$1' : '');
  processedHtml = processedHtml.replace(/\{\{\^offerText\}\}([\s\S]*?)\{\{\/offerText\}\}/g, !content.offerText ? '$1' : '');

  processedHtml = processedHtml
    .replace(/\{\{heading\}\}/g, escapeHtml(content.heading))
    .replace(/\{\{subheading\}\}/g, escapeHtml(content.subheading))
    .replace(/\{\{ctaText\}\}/g, escapeHtml(content.ctaText))
    .replace(/\{\{ctaUrl\}\}/g, content.ctaUrl) // Note: No escape for URL to allow full paths
    .replace(/\{\{phoneNumber\}\}/g, escapeHtml(content.phoneNumber || ''))
    .replace(/\{\{offerText\}\}/g, escapeHtml(content.offerText || ''))
    .replace(/\{\{customMessage\}\}/g, escapeHtml(content.customMessage || ''))
    .replace(/\{\{primaryColor\}\}/g, escapeHtml(branding.primaryColor))
    .replace(/\{\{secondaryColor\}\}/g, escapeHtml(branding.secondaryColor))
    .replace(/PRIMARY_COLOR_PLACEHOLDER/g, branding.primaryColor)
    .replace(/SECONDARY_COLOR_PLACEHOLDER/g, branding.secondaryColor)
    .replace(/\{\{logoUrl\}\}/g, escapeHtml(branding.logoUrl))
    .replace(/\{\{businessName\}\}/g, escapeHtml(businessName));
  return processedHtml;
}
