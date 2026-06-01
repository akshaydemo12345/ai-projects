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
      const isPreview = req.query.preview === 'true';
      if (isPreview) {
        landingPageUrl = preSlug ? `/preview/${preSlug}/${page.slug}` : `/preview/${page.slug}`;
      } else {
        landingPageUrl = preSlug ? `/${preSlug}/${page.slug}` : `/${page.slug}`;
      }
    } catch (e) { }

    const content = {
      heading: page.thankYouConfig?.content?.heading || layoutConfig.defaultContent.heading,
      subheading: page.thankYouConfig?.content?.subheading || layoutConfig.defaultContent.subheading,
      ctaText: page.thankYouConfig?.content?.ctaText || layoutConfig.defaultContent.ctaText,
      ctaUrl: page.thankYouConfig?.content?.ctaUrl && page.thankYouConfig?.content?.ctaUrl !== '#' && page.thankYouConfig?.content?.ctaUrl !== '/' ? page.thankYouConfig.content.ctaUrl : landingPageUrl,
      phoneNumber: page.thankYouConfig?.content?.phoneNumber || layoutConfig.defaultContent.phoneNumber,
      offerText: page.thankYouConfig?.content?.offerText || layoutConfig.defaultContent.offerText,
      customMessage: page.thankYouConfig?.content?.customMessage || layoutConfig.defaultContent.customMessage
    };

    // For 'default' layout: page.primaryColor wins so button/check-circle match the landing page header.
    // All other layouts keep their own saved branding color as first priority.
    const isDefaultLayout = layoutId === 'default';
    const branding = {
      primaryColor: isDefaultLayout
        ? (page.primaryColor || page.thankYouConfig?.branding?.primaryColor || layoutConfig.theme.primaryColor)
        : (page.thankYouConfig?.branding?.primaryColor || page.primaryColor || layoutConfig.theme.primaryColor),
      secondaryColor: isDefaultLayout
        ? (page.secondaryColor || page.thankYouConfig?.branding?.secondaryColor || layoutConfig.theme.secondaryColor)
        : (page.thankYouConfig?.branding?.secondaryColor || page.secondaryColor || layoutConfig.theme.secondaryColor),
      logoUrl: page.thankYouConfig?.branding?.logoUrl || page.logoUrl || ''
    };

    const businessName = page.title || 'Our Business';
    let html = template;

    // Inject Landing Page Styles to ensure Header/Footer look correct
    const landingStyles = page.styles || page.landingPageStyles || '';
    if (landingStyles) {
      html = html.replace('</head>', `<style id="landing-page-styles">${landingStyles}</style></head>`);
    }

    const pRgb = hexToRgbStr(branding.primaryColor);
    const sRgb = hexToRgbStr(branding.secondaryColor);
    const brandingVars = `
      <style id="branding-vars">
        :root {
          --primary: ${branding.primaryColor};
          --secondary: ${branding.secondaryColor};
          --accent: ${branding.secondaryColor};
          --gold: ${branding.primaryColor};
          --forest: ${branding.primaryColor};
          --btn-bg: ${branding.primaryColor};
          --btn-text: #ffffff;
          --primary-rgb: ${pRgb};
          --secondary-rgb: ${sRgb};
        }
      </style>
    `;
    html = html.replace('</head>', brandingVars + '</head>');

    const coreIconStyles = `
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      <style>
        .material-symbols-outlined {
          font-family: 'Material Symbols Outlined' !important;
          font-weight: normal; font-style: normal; font-size: 24px; line-height: 1;
          letter-spacing: normal; text-transform: none; display: inline-block;
          white-space: nowrap; word-wrap: normal; direction: ltr; -webkit-font-smoothing: antialiased;
        }
      </style>
    `;
    html = html.replace('</head>', coreIconStyles + '</head>');

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

    if (visualHeader) {
      // Remove menu/navigation links from the header for the Thank You page
      visualHeader = visualHeader.replace(/<div[^>]*class="[^"]*(nav-links|nav-btns|nav-actions|menu-links|menu|nav-menu)[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '');
      visualHeader = visualHeader.replace(/<ul[^>]*class="[^"]*(nav-links|nav-btns|nav-actions|menu-links|menu|nav-menu)[^"]*"[^>]*>[\s\S]*?<\/ul>/gi, '');
      html = html.replace(/<header[\s\S]*?<\/header>/i, visualHeader);
    }
    if (visualFooter) html = html.replace(/<footer[\s\S]*?<\/footer>/i, visualFooter);

    // Extract dynamic contact info if missing
    let extractedEmail = '';
    let extractedPhone = '';
    const sourceHtml = visualFooter || (typeof page.content === 'string' ? page.content : (page.content?.fullHtml || ''));
    
    const emailMatch = sourceHtml.match(/mailto:([^"'>?]+)/i) || sourceHtml.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) extractedEmail = emailMatch[1] || emailMatch[0];
    
    const phoneMatch = sourceHtml.match(/tel:([^"'>?]+)/i) || sourceHtml.match(/(?:\+?\d{1,3}[\s.-]?)?\(?\d{3,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{4}/);
    if (phoneMatch) extractedPhone = phoneMatch[1] || phoneMatch[0];

    if (!content.email || content.email === 'demo@divi.express') content.email = extractedEmail;
    if (!content.phoneNumber || content.phoneNumber === '0850 458 9665') content.phoneNumber = extractedPhone;

    const hasEmail = !!content.email && content.email.trim() !== '' && content.email !== 'demo@divi.express';
    const hasPhone = !!content.phoneNumber && content.phoneNumber.trim() !== '' && content.phoneNumber !== '0850 458 9665';

    // If it's the default string, empty, or missing, replace it with the dynamic clean text
    const isDefaultText = !content.offerText || 
                          content.offerText.trim() === '' || 
                          content.offerText.includes('For more information') ||
                          content.offerText.includes('connect with us') ||
                          content.offerText.includes('contact us at');

    if (isDefaultText) {
      if (hasEmail && hasPhone) {
        content.offerText = `For more information, contact us at ${content.email} or ${content.phoneNumber}.`;
      } else if (hasEmail) {
        content.offerText = `For more information, contact us at ${content.email}.`;
      } else if (hasPhone) {
        content.offerText = `For more information, call us at ${content.phoneNumber}.`;
      } else {
        content.offerText = `Thank you for your submission.`;
      }
    }

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
    const returnUrlScript = `
<script>
  (function() {
    try {
      var currentUrl = new URL(window.location.href);
      var search = currentUrl.search.replace(/[?&]status=thank-you/, '').replace(/&&/g, '&').replace(/\\?$/, '');
      var newHref = currentUrl.pathname + search;
      if (currentUrl.hash && currentUrl.hash.includes('status=thank-you')) {
          newHref = currentUrl.pathname + currentUrl.search + currentUrl.hash.replace('?status=thank-you', '').replace('&status=thank-you', '');
      }
      var ctaUrl = "${content.ctaUrl}";
      if (ctaUrl && (ctaUrl.startsWith('/') || ctaUrl === '#')) {
        var links = document.querySelectorAll('a[href="' + ctaUrl + '"]');
        links.forEach(function(link) { link.href = newHref; });
      }
    } catch(e) {}
  })();
</script>`;
    finalFooterScript += '\n' + returnUrlScript;

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
      ctaUrl: content?.ctaUrl && content?.ctaUrl !== '#' && content?.ctaUrl !== '/' ? content.ctaUrl : landingPageUrl,
      phoneNumber: content?.phoneNumber || layoutConfig.defaultContent.phoneNumber,
      offerText: content?.offerText || layoutConfig.defaultContent.offerText,
      customMessage: content?.customMessage || layoutConfig.defaultContent.customMessage
    };

    // For 'default' layout: page.primaryColor wins so button/check-circle match the landing page header.
    // All other layouts keep their own saved branding color as first priority.
    const isDefaultLayoutPreview = layout === 'default';
    const mergedBranding = {
      primaryColor: isDefaultLayoutPreview
        ? ((page ? page.primaryColor : null) || branding?.primaryColor || layoutConfig.theme.primaryColor)
        : (branding?.primaryColor || (page ? page.primaryColor : null) || layoutConfig.theme.primaryColor),
      secondaryColor: isDefaultLayoutPreview
        ? ((page ? page.secondaryColor : null) || branding?.secondaryColor || layoutConfig.theme.secondaryColor)
        : (branding?.secondaryColor || (page ? page.secondaryColor : null) || layoutConfig.theme.secondaryColor),
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

      const pRgb = hexToRgbStr(mergedBranding.primaryColor);
      const sRgb = hexToRgbStr(mergedBranding.secondaryColor);
      const brandingVars = `
        <style id="branding-vars">
          :root {
            --primary: ${mergedBranding.primaryColor};
            --secondary: ${mergedBranding.secondaryColor};
            --accent: ${mergedBranding.secondaryColor};
            --gold: ${mergedBranding.primaryColor};
            --forest: ${mergedBranding.primaryColor};
            --btn-bg: ${mergedBranding.primaryColor};
            --btn-text: #ffffff;
            --primary-rgb: ${pRgb};
            --secondary-rgb: ${sRgb};
          }
        </style>
      `;
      html = html.replace('</head>', brandingVars + '</head>');

      const coreIconStyles = `
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
        <style>
          .material-symbols-outlined {
            font-family: 'Material Symbols Outlined' !important;
            font-weight: normal; font-style: normal; font-size: 24px; line-height: 1;
            letter-spacing: normal; text-transform: none; display: inline-block;
            white-space: nowrap; word-wrap: normal; direction: ltr; -webkit-font-smoothing: antialiased;
          }
        </style>
      `;
      html = html.replace('</head>', coreIconStyles + '</head>');

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

      if (visualHeader) {
        // Remove menu/navigation links from the header for the Thank You page
        visualHeader = visualHeader.replace(/<div[^>]*class="[^"]*(nav-links|nav-btns|nav-actions|menu-links|menu|nav-menu)[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '');
        visualHeader = visualHeader.replace(/<ul[^>]*class="[^"]*(nav-links|nav-btns|nav-actions|menu-links|menu|nav-menu)[^"]*"[^>]*>[\s\S]*?<\/ul>/gi, '');
        html = html.replace(/<header[\s\S]*?<\/header>/i, visualHeader);
      }
      if (visualFooter) html = html.replace(/<footer[\s\S]*?<\/footer>/i, visualFooter);

      // Extract dynamic contact info if missing
      let extractedEmail = '';
      let extractedPhone = '';
      const sourceHtml = visualFooter || (typeof page.content === 'string' ? page.content : (page.content?.fullHtml || ''));
      
      const emailMatch = sourceHtml.match(/mailto:([^"'>?]+)/i) || sourceHtml.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      if (emailMatch) extractedEmail = emailMatch[1] || emailMatch[0];
      
      const phoneMatch = sourceHtml.match(/tel:([^"'>?]+)/i) || sourceHtml.match(/(?:\+?\d{1,3}[\s.-]?)?\(?\d{3,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{4}/);
      if (phoneMatch) extractedPhone = phoneMatch[1] || phoneMatch[0];

      if (!mergedContent.email || mergedContent.email === 'demo@divi.express') mergedContent.email = extractedEmail;
      if (!mergedContent.phoneNumber || mergedContent.phoneNumber === '0850 458 9665') mergedContent.phoneNumber = extractedPhone;

      const hasEmail = !!mergedContent.email && mergedContent.email.trim() !== '' && mergedContent.email !== 'demo@divi.express';
      const hasPhone = !!mergedContent.phoneNumber && mergedContent.phoneNumber.trim() !== '' && mergedContent.phoneNumber !== '0850 458 9665';

      // If it's the default string, empty, or missing, replace it with the dynamic clean text
      const isDefaultText = !mergedContent.offerText || 
                            mergedContent.offerText.trim() === '' || 
                            mergedContent.offerText.includes('For more information') ||
                            mergedContent.offerText.includes('connect with us') ||
                            mergedContent.offerText.includes('contact us at');

      if (isDefaultText) {
        if (hasEmail && hasPhone) {
          mergedContent.offerText = `For more information, contact us at ${mergedContent.email} or ${mergedContent.phoneNumber}.`;
        } else if (hasEmail) {
          mergedContent.offerText = `For more information, contact us at ${mergedContent.email}.`;
        } else if (hasPhone) {
          mergedContent.offerText = `For more information, call us at ${mergedContent.phoneNumber}.`;
        } else {
          mergedContent.offerText = `Thank you for your submission.`;
        }
      }
    }

    html = processConditionalBlocks(mergedContent, mergedBranding, businessName, html);
    return res.send(html);
  } catch (error) {
    logger.error('Error previewing Thank You page:', error);
    next(error);
  }
};

// --- HELPER FUNCTIONS ---

function hexToRgbStr(hex) {
  if (!hex) return '124, 58, 237';
  const c = hex.replace('#', '');
  if (c.length === 3) return parseInt(c[0] + c[0], 16) + ', ' + parseInt(c[1] + c[1], 16) + ', ' + parseInt(c[2] + c[2], 16);
  if (c.length === 6) return parseInt(c.substring(0, 2), 16) + ', ' + parseInt(c.substring(2, 4), 16) + ', ' + parseInt(c.substring(4, 6), 16);
  return '124, 58, 237';
}

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
  processedHtml = processedHtml.replace(/\{\{#email\}\}([\s\S]*?)\{\{\/email\}\}/g, content.email ? '$1' : '');
  processedHtml = processedHtml.replace(/\{\{\^email\}\}([\s\S]*?)\{\{\/email\}\}/g, !content.email ? '$1' : '');
  processedHtml = processedHtml.replace(/\{\{#logoUrl\}\}([\s\S]*?)\{\{\/logoUrl\}\}/g, branding.logoUrl ? '$1' : '');
  processedHtml = processedHtml.replace(/\{\{\^logoUrl\}\}([\s\S]*?)\{\{\/logoUrl\}\}/g, !branding.logoUrl ? '$1' : '');
  processedHtml = processedHtml.replace(/\{\{#offerText\}\}([\s\S]*?)\{\{\/offerText\}\}/g, content.offerText ? '$1' : '');
  processedHtml = processedHtml.replace(/\{\{\^offerText\}\}([\s\S]*?)\{\{\/offerText\}\}/g, !content.offerText ? '$1' : '');

  const pRgb = hexToRgbStr(branding.primaryColor);
  const sRgb = hexToRgbStr(branding.secondaryColor);

  processedHtml = processedHtml
    .replace(/\{\{heading\}\}/g, escapeHtml(content.heading))
    .replace(/\{\{subheading\}\}/g, escapeHtml(content.subheading))
    .replace(/\{\{ctaText\}\}/g, escapeHtml(content.ctaText))
    .replace(/\{\{ctaUrl\}\}/g, content.ctaUrl) // Note: No escape for URL to allow full paths
    .replace(/\{\{offerText\}\}/g, escapeHtml(content.offerText || ''))
    .replace(/\{\{email\}\}/g, escapeHtml(content.email || ''))
    .replace(/\{\{phoneNumber\}\}/g, escapeHtml(content.phoneNumber || ''))
    .replace(/\{\{customMessage\}\}/g, escapeHtml(content.customMessage || ''))
    .replace(/\{\{primaryColor\}\}/g, escapeHtml(branding.primaryColor))
    .replace(/\{\{secondaryColor\}\}/g, escapeHtml(branding.secondaryColor))
    .replace(/PRIMARY_COLOR_PLACEHOLDER/g, branding.primaryColor)
    .replace(/SECONDARY_COLOR_PLACEHOLDER/g, branding.secondaryColor)
    .replace(/PRIMARY_RGB_PLACEHOLDER/g, pRgb)
    .replace(/SECONDARY_RGB_PLACEHOLDER/g, sRgb)
    .replace(/\{\{logoUrl\}\}/g, escapeHtml(branding.logoUrl))
    .replace(/\{\{businessName\}\}/g, escapeHtml(businessName));
  return processedHtml;
}
