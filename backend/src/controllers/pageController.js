'use strict';

const path = require('path');
const fs = require('fs');

const { z } = require('zod');
const crypto = require('crypto');
const Page = require('../models/Page');
const Project = require('../models/Project');
const AIService = require('../services/aiService');
const PublishService = require('../services/publishService');
const SyncService = require('../services/syncService');
const logger = require('../utils/logger');
const config = require('../config');

const AppError = require('../utils/AppError');
const FormSchema = require('../models/FormSchema');
const { extractFormFields } = require('../utils/formExtractor');
const { syncFormSchema } = require('../utils/schemaSync');

// ─── Validation Schemas ────────────────────────────────────────────────────────
const createPageSchema = z.object({
  title: z.string().optional(),
  name: z.string().optional(),
  slug: z.string().optional(),
  prefix: z.string().optional(),
  template: z.string().optional(),
  content: z.any().optional(),
  landingPageContent: z.any().optional(),
  landingPageStyles: z.string().optional(),
  business_name: z.string().optional(),
  businessDescription: z.string().optional(),
  business_description: z.string().optional(),
  targetAudience: z.string().optional(),
  ctaText: z.string().optional(),
  ai_prompt: z.string().optional(),
  aiPrompt: z.string().optional(),
  industry: z.string().optional(),
  styles: z.string().optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  accentColor: z.string().optional(),
  logoUrl: z.string().optional(),
  noIndex: z.boolean().optional(),
  noFollow: z.boolean().optional(),
  services: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(),
  pageType: z.string().optional(),
  figmaImage: z.string().optional(),
  mainHeader: z.string().optional(),
  mainFooter: z.string().optional(),
  thankYouHeader: z.string().optional(),
  thankYouFooter: z.string().optional(),
  thankYouConversionScript: z.string().optional(),
  thankYouUrl: z.string().optional(),
}).transform(data => ({
  ...data,
  title: data.title || data.name || 'Untitled Page',
  slug: data.slug || data.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'untitled',
  finalSlug: data.prefix ? `${data.prefix}-${(data.slug || data.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'untitled')}` : (data.slug || data.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'untitled')
})).refine(data => data.title.length > 0, {
  message: "Title or name is required",
  path: ["title"]
});

const updatePageSchema = z.object({
  title: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  content: z.any().optional(),
  styles: z.string().optional(),
  status: z.enum(['draft', 'published']).optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  logoUrl: z.string().optional(),
  noIndex: z.boolean().optional(),
  noFollow: z.boolean().optional(),
  mainHeader: z.string().optional(),
  mainFooter: z.string().optional(),
  thankYouHeader: z.string().optional(),
  thankYouFooter: z.string().optional(),
  thankYouConversionScript: z.string().optional(),
  thankYouUrl: z.string().optional(),
  landingPageContent: z.any().optional(),
  landingPageStyles: z.string().optional(),
  thankYouPageContent: z.any().optional(),
  thankYouPageStyles: z.string().optional(),
  seo: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      keywords: z.array(z.string()).optional(),
    })
    .optional(),
  designUrl: z.string().url('Invalid Figma or Stitch URL').optional(),
}).transform(data => {
  const result = { ...data };
  if (data.name) result.title = data.name;
  return result;
});

const publishPageSchema = z.object({
  domain: z
    .string()
    .regex(
      /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/,
      'Invalid domain format'
    )
    .optional(),
  subdomain: z
    .string()
    .regex(/^[a-z0-9-]+$/, 'Subdomain can only contain lowercase letters, numbers, and hyphens')
    .optional(),
});

const leadSchema = z.object({
  name: z.string().min(1, 'name is required'),
  email: z.string().email('Invalid email'),
  message: z.string().optional(),
});

// ─── Helper: Unique slug generator ────────────────────────────────────────────
const generateUniqueSlug = async (base, projectId, excludeId = null) => {
  const slug = base.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  let uniqueSlug = slug;
  let counter = 1;
  const query = { projectId, slug: uniqueSlug };
  if (excludeId) query._id = { $ne: excludeId };

  while (await Page.exists(query)) {
    uniqueSlug = `${slug}-${counter++}`;
    query.slug = uniqueSlug;
  }
  return uniqueSlug;
};

const normalizeSlug = (value) => {
  if (!value) return '';
  return value.toString().trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
};

const checkPageExistsOnExternalWebsite = async (project, slug) => {
  if (!project?.websiteUrl || !slug) {
    logger.debug(`Skipping external website check: websiteUrl=${!!project?.websiteUrl}, slug=${!!slug}`);
    return false;
  }
  let baseUrl = project.websiteUrl;
  if (!baseUrl.startsWith('http')) {
    baseUrl = 'https://' + baseUrl;
  }
  baseUrl = baseUrl.replace(/\/+$|\s+/g, '');
  const checkUrl = `${baseUrl}/${slug}`;
  logger.info(`Checking if page exists on external website: ${checkUrl}`);
  try {
    // HEAD request (no body = faster) with 10s timeout to handle slow/redirecting sites
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    let checkResponse;
    try {
      checkResponse = await fetch(checkUrl, {
        method: 'HEAD',
        signal: controller.signal,
        redirect: 'follow',
      });
    } catch (headErr) {
      // Some servers reject HEAD - fall back to GET
      logger.debug(`HEAD failed for ${checkUrl}, trying GET: ${headErr?.message}`);
      checkResponse = await fetch(checkUrl, {
        method: 'GET',
        signal: controller.signal,
        redirect: 'follow',
      });
    }
    clearTimeout(timeoutId);

    logger.debug(`External website check response for ${checkUrl}: status=${checkResponse.status}`);

    if (checkResponse.status === 200) {
      // Catch-all check: detect sites that return 200 for ANY URL (e.g. WordPress catch-all)
      const randomUrl = `${baseUrl}/pagecraft-test-404-${Date.now()}`;
      const catchAllController = new AbortController();
      const catchAllTimeout = setTimeout(() => catchAllController.abort(), 10000);
      let catchAllResponse = null;
      try {
        catchAllResponse = await fetch(randomUrl, {
          method: 'HEAD',
          signal: catchAllController.signal,
          redirect: 'follow',
        });
      } catch (_headErr2) {
        try {
          catchAllResponse = await fetch(randomUrl, {
            method: 'GET',
            signal: catchAllController.signal,
            redirect: 'follow',
          });
        } catch (_getErr2) {
          catchAllResponse = null;
        }
      }
      clearTimeout(catchAllTimeout);

      logger.debug(`Catch-all check for ${randomUrl}: status=${catchAllResponse?.status}`);

      if (!catchAllResponse || catchAllResponse.status !== 200) {
        logger.warn(`Page slug "${slug}" exists on website ${baseUrl} (returned 200, catch-all confirmed)`);
        return true;
      }
      logger.debug(`Site has catch-all routing enabled, random URL also returned 200`);
    }
  } catch (err) {
    logger.warn(`Could not verify if page exists on external website: ${checkUrl}`, { error: err?.message || err });
  }
  return false;
};

// Helper: Ensure project ownership
const checkProjectOwnership = async (projectId, userId) => {
  return await Project.exists({ _id: projectId, userId });
};

/**
 * Helper: Extract form fields from content and update FormSchema
 */
// syncFormSchema removed (now imported from utils/schemaSync)

// ─── GET /projects/:projectId/pages ───────────────────────────────────────────
exports.getPagesInProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    if (!(await checkProjectOwnership(projectId, req.user._id))) {
      return res.status(403).json({ status: 'fail', message: 'Unauthorized project' });
    }

    const filter = { projectId, userId: req.user._id };
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [pages, total] = await Promise.all([
      Page.find(filter)
        .sort('-createdAt')
        .skip(skip)
        .limit(parseInt(limit))
        .select('-__v'),
      Page.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      message: 'Pages retrieved successfully',
      data: {
        pages: pages.map(p => ({ ...p.toObject(), name: p.title })),
        results: pages.length,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit))
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.verifyPageSlug = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { name, slug, prefix } = req.body || {};

    if (!projectId) {
      return res.status(400).json({ success: false, message: 'Project ID is required in URL', data: {} });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found', data: {} });
    }

    if (project.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You do not have permission to verify pages for this project', data: {} });
    }

    const baseSlug = slug || name || '';
    const normalizedSlug = normalizeSlug(prefix ? `${prefix}-${baseSlug}` : baseSlug);

    if (!normalizedSlug) {
      return res.status(400).json({ success: false, message: 'Please enter a valid page name or slug', data: {} });
    }

    if (await Page.exists({ projectId, slug: normalizedSlug })) {
      return res.status(400).json({
        success: false,
        message: 'This URL slug already exists in this project. Please choose a different page name.',
        data: {}
      });
    }

    // Check if page exists on external website if websiteUrl is configured
    let checkedExternal = false;
    let externalCheckMessage = '';

    if (project.websiteUrl) {
      checkedExternal = true;
      const pageExistsOnWebsite = await checkPageExistsOnExternalWebsite(project, normalizedSlug);
      if (pageExistsOnWebsite) {
        logger.info(`Page slug "${normalizedSlug}" already exists on website "${project.websiteUrl}"`);
        return res.status(400).json({
          success: false,
          message: 'Page already exists on website',
          data: {}
        });
      }
      externalCheckMessage = 'checked on your website';
    } else {
      logger.debug(`Skipping external website check: project.websiteUrl not configured for project ${projectId}`);
      externalCheckMessage = 'internal database only';
    }

    return res.status(200).json({
      success: true,
      message: 'Slug is available',
      data: { slug: normalizedSlug, checkedExternal, externalCheckMessage }
    });
  } catch (err) {
    next(err);
  }
};

// ─── GET /pages/:id or /projects/:projectId/pages/:id ─────────────────────────
exports.getPage = async (req, res, next) => {
  try {
    const { id, projectId } = req.params;
    const query = { _id: id, userId: req.user._id };
    if (projectId) query.projectId = projectId;

    const page = await Page.findOne(query);

    if (!page) {
      return res.status(404).json({ status: 'fail', message: 'Page not found' });
    }

    const frontendUrl = config.frontend?.url || process.env.FRONTEND_URL || process.env.APP_BASE_URL || 'http://localhost:5000';
    const previewUrl = page.previewUrl || (page.previewToken ? `${frontendUrl}/preview?page=${page._id}&token=${page.previewToken}` : `${frontendUrl}/preview?page=${page._id}`);
    const liveUrl = page.liveUrl || (page.domain ? `https://${page.domain}/?page=${page._id}` : `${frontendUrl}/?page=${page._id}`);

    return res.status(200).json({
      success: true,
      message: 'Page retrieved successfully',
      data: {
        page: {
          ...page.toObject(),
          name: page.title,
          previewUrl,
          liveUrl
        }
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── GET /projects/:projectId/pages/:id/settings ─────────────────────────────
// Returns only the ~14 fields PageSettingsPage renders. No content/styles blobs.
// Typical response: ~800 bytes vs ~500 KB+ for the full page object.
exports.getPageSettings = async (req, res, next) => {
  try {
    const { id, projectId } = req.params;
    const page = await Page.findOne({ _id: id, userId: req.user._id, projectId })
      .select('_id title slug metaTitle metaDescription primaryColor secondaryColor logoUrl mainHeader mainFooter thankYouHeader thankYouFooter thankYouUrl noIndex noFollow')
      .lean();

    if (!page) return res.status(404).json({ status: 'fail', message: 'Page not found' });

    res.status(200).json({
      status: 'success',
      data: { page: { ...page, name: page.title } },
    });
  } catch (err) {
    next(err);
  }
};

// ─── PATCH /projects/:projectId/pages/:id/settings ───────────────────────────
// Writes only the settings fields. Content/styles blobs are never touched.
const SETTINGS_FIELDS = [
  'title', 'slug', 'metaTitle', 'metaDescription',
  'primaryColor', 'secondaryColor', 'logoUrl',
  'mainHeader', 'mainFooter',
  'thankYouHeader', 'thankYouFooter', 'thankYouUrl',
  'noIndex', 'noFollow',
];

exports.updatePageSettings = async (req, res, next) => {
  try {
    const { id, projectId } = req.params;

    // Build update object from only the allowed fields — ignore everything else in body
    const updates = {};
    for (const field of SETTINGS_FIELDS) {
      if (field in req.body) updates[field] = req.body[field];
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ status: 'fail', message: 'No valid settings fields provided' });
    }

    // Slug uniqueness check (only if slug is being changed)
    if (updates.slug) {
      const conflict = await Page.exists({
        projectId,
        slug: updates.slug,
        _id: { $ne: id },
        isDeleted: { $ne: true },
      });
      if (conflict) {
        return res.status(409).json({ status: 'fail', message: 'Slug is already used by another page in this project' });
      }
    }

    const page = await Page.findOneAndUpdate(
      { _id: id, userId: req.user._id, projectId },
      { $set: updates },
      { new: true, runValidators: true }
    ).select('_id title slug metaTitle metaDescription primaryColor secondaryColor logoUrl mainHeader mainFooter thankYouHeader thankYouFooter thankYouUrl noIndex noFollow').lean();

    if (!page) return res.status(404).json({ status: 'fail', message: 'Page not found' });

    res.status(200).json({
      status: 'success',
      data: { page: { ...page, name: page.title } },
    });
  } catch (err) {
    next(err);
  }
};

// ─── POST /projects/:projectId/pages (Enhanced with AI) ───────────────────────
exports.createPage = async (req, res, next) => {
  logger.info(`Creating page for project ${req.params.projectId}`, { userId: req.user?._id });

  try {
    const { projectId } = req.params;

    // 1. Basic Parameter Validation
    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required in URL",
        data: {}
      });
    }

    // 2. Body Validation
    const parsed = createPageSchema.safeParse(req.body);
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        data: { errors }
      });
    }

    const {
      title,
      slug,
      prefix,
      finalSlug,
      template,
      content: initialContent,
      landingPageContent: initialLandingPageContent,
      landingPageStyles: initialLandingPageStyles,
      business_name,
      businessDescription,
      business_description,
      targetAudience,
      ctaText,
      ai_prompt,
      aiPrompt: camelAiPrompt,
      industry,
      styles: initialStyles,
      primaryColor,
      secondaryColor,
      accentColor,
      logoUrl,
      noIndex,
      noFollow,
      services,
      keywords,
      pageType,
      figmaImage
    } = parsed.data;

    // 3. Project Existence Check
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
        data: {}
      });
    }

    // 4. Ownership Check
    if (project.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to add pages to this project",
        data: {}
      });
    }

    // 5. Slug Generation (use finalSlug if provided)
    const uniqueSlug = finalSlug ? await generateUniqueSlug(finalSlug, projectId) : await generateUniqueSlug(slug || title, projectId);

    // 5.5 Check if page already exists on the external website
    if (project.websiteUrl) {
      let baseUrl = project.websiteUrl;
      if (!baseUrl.startsWith('http')) {
        baseUrl = 'https://' + baseUrl;
      }
      baseUrl = baseUrl.replace(/\/+$/, '');
      const checkUrl = `${baseUrl}/${uniqueSlug}`;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        const checkResponse = await fetch(checkUrl, {
          method: 'GET',
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (checkResponse.status === 200) {
          // Verify if the site uses catch-all routing by fetching a random URL
          const randomUrl = `${baseUrl}/pagecraft-test-404-${Date.now()}`;
          const catchAllController = new AbortController();
          const catchAllTimeout = setTimeout(() => catchAllController.abort(), 5000);
          const catchAllResponse = await fetch(randomUrl, {
            method: 'GET',
            signal: catchAllController.signal
          }).catch(() => null);
          clearTimeout(catchAllTimeout);

          // If the random URL does NOT return 200, it means the site handles 404s properly.
          // Therefore, the 200 on our checkUrl means the page ACTUALLY exists.
          if (!catchAllResponse || catchAllResponse.status !== 200) {
            return res.status(400).json({
              success: false,
              message: `Page already exists on website`,
              data: {}
            });
          }
        }
      } catch (err) {
        logger.warn(`Could not verify if page exists on external website: ${checkUrl}`, { error: err.message });
      }
    }

    // 6. Initial Page Creation
    const page = await Page.create({
      projectId,
      userId: req.user._id,
      title,
      slug: uniqueSlug,
      prefix: prefix || '',
      template: template || 'blank',
      aiPrompt: ai_prompt || camelAiPrompt,
      content: initialContent || {},
      styles: initialStyles || '',
      landingPageContent: initialLandingPageContent || '',
      landingPageStyles: initialLandingPageStyles || '',
      primaryColor: primaryColor || project.primaryColor || '#7c3aed',
      secondaryColor: secondaryColor || project.secondaryColor || '#6366f1',
      accentColor: accentColor || project.secondaryColor || '#6366f1',
      logoUrl: logoUrl || project.logoUrl || '',
      industry: industry || project.industry || 'Service',
      services: services || project.services || [],
      noIndex: noIndex || false,
      noFollow: noFollow || false,
      metaTitle: req.body.metaTitle || '',
      metaDescription: req.body.metaDescription || '',
      mainHeader: req.body.mainHeader || '',
      mainFooter: req.body.mainFooter || '',
      thankYouHeader: req.body.thankYouHeader || '',
      thankYouFooter: req.body.thankYouFooter || '',
      thankYouConversionScript: req.body.thankYouConversionScript || '',
      thankYouUrl: req.body.thankYouUrl || '',
      generationMethod: req.body.generationMethod || 'ai',
      status: 'generating',
      previewToken: crypto.randomBytes(16).toString('hex'),
    });

    // Increment pageCount
    await Project.findByIdAndUpdate(projectId, { $inc: { pageCount: 1 } });


    // 7. AI Content Generation (Allows templates to be filled by AI if a prompt exists)
    let aiResponse = { sections: [], seo: {} };
    const promptToUse = camelAiPrompt || ai_prompt || '';
    const isTemplateWithPrompt = page.generationMethod === 'template' && promptToUse.trim().length > 0;
    const isAIRequested = page.generationMethod === 'ai' || isTemplateWithPrompt;

    if (isAIRequested) {
      try {
        logger.info(`Starting AI generation for page ${page._id} (Template: ${isTemplateWithPrompt})`);

        // If it's a template, we pass a hint to the AI service
        const aiInput = {
          businessName: project.name,
          industry: project.industry,
          pageType: 'lead generation',
          targetAudience: project.description || 'Business owners looking for ' + project.industry + ' services',
          businessDescription: project.description,
          ctaText: 'Get Started',
          tone: 'Professional',
          aiPrompt: promptToUse,
          logoUrl: project.logoUrl || '',
          primaryColor: page.primaryColor || project.primaryColor,
          secondaryColor: page.secondaryColor || project.secondaryColor,
          services: page.services || project.services || [],
          keywords: keywords || [],
          noIndex: page.noIndex || project.noIndex || false,
          noFollow: page.noFollow || project.noFollow || false,
          pageId: page._id,
          // Pass the template HTML to the AI if it's a template enrichment task
          templateHtml: isTemplateWithPrompt ? page.content : null,
          isTemplate: page.generationMethod === 'template',
          // Pass figma image if available
          figmaImage: figmaImage || null,
          // Pass scraped data from project (contains images/videos from website)
          scrapedData: project.scrapedData || {},
          scrapedFonts: project.websiteProfile?.fonts || project.scrapedData?.fonts || null,
          scrapedTheme: project.websiteProfile?.theme || project.scrapedData?.theme || null
        };

        const generatedResult = await AIService.generateLandingPageContent(aiInput);

        if (generatedResult) {
          aiResponse = {
            sections: generatedResult.pageContent || [],
            fullHtml: generatedResult.fullHtml,
            fullCss: generatedResult.fullCss,
            fullJs: generatedResult.fullJs,
            seo: generatedResult.seo || {},
            aiUsage: generatedResult.aiUsage
          };
        }
      } catch (aiErr) {
        logger.error('AI Generation Failed during page creation:', {
          error: aiErr.message,
          pageId: page._id
        });
        // Fallback: If AI fails on a purely AI-generated page, we should halt rather than giving a blank page.
        if (!initialContent && (!template || template === 'blank')) {
          await Page.findByIdAndDelete(page._id);
          return res.status(502).json({
            success: false,
            message: `AI Generation Error: ${aiErr.message}`,
            data: {}
          });
        }
      }
    }

    const frontendUrl = config.frontend?.url || process.env.FRONTEND_URL || process.env.APP_BASE_URL || 'http://localhost:5000';
    const previewUrl = `${frontendUrl}/preview?page=${page._id}&token=${page.previewToken}`;

    // 8. Update Page with AI Results
    if (aiResponse.fullHtml && aiResponse.fullHtml.trim().length > 100) {
      let processedHtml = aiResponse.fullHtml;

      // Add SEO meta tags if needed
      if (page.noIndex || page.noFollow) {
        const robots = [page.noIndex ? 'noindex' : '', page.noFollow ? 'nofollow' : ''].filter(Boolean).join(',');
        const seoMeta = `<meta name="robots" content="${robots}">`;

        if (processedHtml.includes('<head>')) {
          processedHtml = processedHtml.replace('<head>', `<head>${seoMeta}`);
        } else if (processedHtml.includes('</head>')) {
          processedHtml = processedHtml.replace('</head>', `${seoMeta}</head>`);
        }
      }

      page.content = processedHtml;
      const brandingStyles = `
:root {
  --primary: ${page.primaryColor};
  --secondary: ${page.secondaryColor};
  --accent: ${page.secondaryColor};
  --button-gradient: linear-gradient(135deg, ${page.primaryColor}, ${page.secondaryColor});
}
`;
      // If it's a template, preserve initial styles and append AI styles if any
      if (page.generationMethod === 'template') {
        page.styles = (initialStyles || '') + '\n' + brandingStyles + (aiResponse.fullCss || '');
      } else {
        page.styles = brandingStyles + (aiResponse.fullCss || '');
      }

      // Set landingPageContent and landingPageStyles
      page.landingPageContent = processedHtml;
      page.landingPageStyles = page.styles;

    } else {
      // AI generation essentially failed or skipped, keep initial content/styles
      console.log('⚠️ AI response too short or empty, or generation skipped. Preserving initial content');
      page.content = initialContent || page.content;
      page.styles = (initialStyles || page.styles || '') + `
:root {
  --primary: ${page.primaryColor};
  --secondary: ${page.secondaryColor};
  --accent: ${page.secondaryColor};
  --button-gradient: linear-gradient(135deg, ${page.primaryColor}, ${page.secondaryColor});
}
`;
      // Set landingPageContent and landingPageStyles
      page.landingPageContent = initialLandingPageContent || (typeof page.content === 'string' ? page.content : (page.content?.fullHtml || ''));
      page.landingPageStyles = initialLandingPageStyles || page.styles;
    }

    // 8.1 Replace Unsplash/Picsum/Freepik/Placeholder images with getimg.ai API generated images
    let generatedImageCount = 0;
    try {
      const ImageGenerationService = require('../services/imageGenerationService');

      const subIndustryToUse = project.scrapedData?.subIndustry || page.industry || 'General';
      const industryToUse = page.industry || project.industry || 'General';

      logger.info(`[ImageGenerationService] Processing page images for project industry: "${industryToUse}", sub-industry: "${subIndustryToUse}"`);

      // 1. Process page.content if it is a string (AI generation HTML)
      if (typeof page.content === 'string') {
        const result = await ImageGenerationService.replacePlaceholdersInHtml(
          page.content,
          industryToUse,
          subIndustryToUse
        );
        page.content = result.html;
        generatedImageCount += result.imageCount || 0;
      }
      // 2. Process page.content if it is an object (template generation data)
      else if (page.content && typeof page.content === 'object') {
        if (page.content.fullHtml) {
          const result = await ImageGenerationService.replacePlaceholdersInHtml(
            page.content.fullHtml,
            industryToUse,
            subIndustryToUse
          );
          page.content.fullHtml = result.html;
          generatedImageCount += result.imageCount || 0;
        }
        if (page.content.html) {
          const result = await ImageGenerationService.replacePlaceholdersInHtml(
            page.content.html,
            industryToUse,
            subIndustryToUse
          );
          page.content.html = result.html;
          generatedImageCount += result.imageCount || 0;
        }
      }

      // 3. Process page.landingPageContent (full HTML page stored for preview/publish)
      if (page.landingPageContent && typeof page.landingPageContent === 'string') {
        const result = await ImageGenerationService.replacePlaceholdersInHtml(
          page.landingPageContent,
          industryToUse,
          subIndustryToUse
        );
        page.landingPageContent = result.html;
        generatedImageCount += result.imageCount || 0;
      }
    } catch (imgErr) {
      logger.error('[ImageGenerationService] Error during image replacement:', imgErr);
    }

    page.seo = aiResponse.seo || {};

    // 8.2 Update Page with Cumulative AI Usage and History
    if (aiResponse.aiUsage || generatedImageCount > 0) {
      const currentUsage = page.aiUsage || { promptTokens: 0, completionTokens: 0, totalTokens: 0, cost: 0, imageCount: 0, imageCost: 0 };

      // cost of images: $0.002 per image
      const newImageCost = generatedImageCount * 0.002;
      const newTextCost = aiResponse.aiUsage?.cost || 0;

      page.aiUsage = {
        promptTokens: (currentUsage.promptTokens || 0) + (aiResponse.aiUsage?.promptTokens || 0),
        completionTokens: (currentUsage.completionTokens || 0) + (aiResponse.aiUsage?.completionTokens || 0),
        totalTokens: (currentUsage.totalTokens || 0) + (aiResponse.aiUsage?.totalTokens || 0),
        cost: (currentUsage.cost || 0) + newTextCost + newImageCost,
        imageCount: (currentUsage.imageCount || 0) + generatedImageCount,
        imageCost: (currentUsage.imageCost || 0) + newImageCost,
        model: aiResponse.aiUsage?.model || 'flux-schnell',
        currency: 'USD',
        lastUsageAt: Date.now()
      };

      page.aiUsageHistory.push({
        action: 'Initial Creation',
        ...aiResponse.aiUsage,
        imageCount: generatedImageCount,
        imageCost: newImageCost,
        cost: newTextCost + newImageCost,
        createdAt: Date.now()
      });
    }

    // If we have a generic title, try to use the AI-generated one
    if ((page.title === 'Untitled Page' || page.title === 'AI Generated Page') && page.seo.title) {
      page.title = page.seo.title.split('|')[0].trim();
    }

    // Sync metaTitle and metaDescription if they are empty but AI generated SEO data
    if (!page.metaTitle && page.seo.title) {
      page.metaTitle = page.seo.title;
    }
    if (!page.metaDescription && page.seo.description) {
      page.metaDescription = page.seo.description;
    }

    page.previewUrl = previewUrl;
    page.status = 'draft';
    await page.save();

    // 8.5 Sync Form Schema Immediately
    await syncFormSchema(page);

    // 9. Success Response
    return res.status(201).json({
      success: true,
      message: 'Landing page created successfully',
      data: {
        pageId: page._id,
        _id: page._id,
        title: page.title,
        slug: page.slug,
        prefix: page.prefix,
        finalSlug: page.prefix ? `${page.prefix}-${page.slug}` : page.slug,
        noIndex: page.noIndex,
        noFollow: page.noFollow,
        services: page.services,
        previewUrl: page.previewUrl,
        content: page.content,
        styles: page.styles,
        seo: page.seo
      }
    });

  } catch (error) {
    logger.error("Create Page Final Error:", {
      message: error.message,
      stack: error.stack,
      projectId: req.params.projectId
    });

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
      data: {}
    });
  }
};

// ─── PUT /pages/:id or /projects/:projectId/pages/:id ─────────────────────────
exports.updatePage = async (req, res, next) => {
  try {
    const { id, projectId } = req.params;
    const parsed = updatePageSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        status: 'fail',
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const query = { _id: id, userId: req.user._id };
    if (projectId) query.projectId = projectId;

    const currentPage = await Page.findOne(query);
    if (!currentPage) {
      return res.status(404).json({ status: 'fail', message: 'Page not found' });
    }

    const updateData = { ...parsed.data, updatedAt: Date.now() };

    if (parsed.data.slug && parsed.data.slug !== currentPage.slug) {
      const uniqueSlug = await generateUniqueSlug(parsed.data.slug, currentPage.projectId, currentPage._id);

      const project = await Project.findById(currentPage.projectId);
      if (project && project.websiteUrl) {
        let baseUrl = project.websiteUrl;
        if (!baseUrl.startsWith('http')) {
          baseUrl = 'https://' + baseUrl;
        }
        baseUrl = baseUrl.replace(/\/+$/, '');
        const checkUrl = `${baseUrl}/${uniqueSlug}`;
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          const checkResponse = await fetch(checkUrl, { method: 'GET', signal: controller.signal });
          clearTimeout(timeoutId);
          if (checkResponse.status === 200) {
            // Verify if the site uses catch-all routing by fetching a random URL
            const randomUrl = `${baseUrl}/pagecraft-test-404-${Date.now()}`;
            const catchAllController = new AbortController();
            const catchAllTimeout = setTimeout(() => catchAllController.abort(), 5000);
            const catchAllResponse = await fetch(randomUrl, { method: 'GET', signal: catchAllController.signal }).catch(() => null);
            clearTimeout(catchAllTimeout);

            if (!catchAllResponse || catchAllResponse.status !== 200) {
              return res.status(400).json({
                status: 'fail',
                message: `Page already exists on website`
              });
            }
          }
        } catch (err) {
          logger.warn(`Could not verify if page exists on external website: ${checkUrl}`, { error: err.message });
        }
      }

      updateData.slug = uniqueSlug;

      const frontendUrl = config.frontend?.url || process.env.FRONTEND_URL || process.env.APP_BASE_URL || 'http://localhost:5000';
      const previewToken = currentPage.previewToken || crypto.randomBytes(16).toString('hex');
      updateData.previewToken = previewToken;
      updateData.previewUrl = `${frontendUrl}/preview?page=${currentPage._id}&token=${previewToken}`;
    }

    const updatedPage = await Page.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    // Sync Form Schema if content/template changed
    if (req.body.content || req.body.landingPageContent || req.body.template) {
      await syncFormSchema(updatedPage);
    }

    if (updatedPage.domain && updatedPage.apiToken) {
      SyncService.flushWordPressCache(updatedPage.domain, updatedPage.apiToken);
    }

    return res.status(200).json({
      status: 'success',
      data: {
        page: {
          ...updatedPage.toObject(),
          name: updatedPage.title
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

// ─── DELETE /pages/:id or /projects/:projectId/pages/:id ──────────────────────
exports.deletePage = async (req, res, next) => {
  try {
    const { id, projectId } = req.params;
    const query = { _id: id, userId: req.user._id };
    if (projectId) query.projectId = projectId;

    const page = await Page.findOneAndUpdate(
      query,
      { isDeleted: true },
      { new: true }
    );

    if (!page) {
      return res.status(404).json({ status: 'fail', message: 'Page not found' });
    }

    // Decrement counts
    const decr = { pageCount: -1 };
    if (page.status === 'published') {
      decr.publishedPageCount = -1;
    }
    await Project.findByIdAndUpdate(page.projectId, { $inc: decr });


    return res.status(200).json({ status: 'success', message: 'Page deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// ─── POST /pages/:id/publish ──────────────────────────────────────────────────
exports.publishPage = async (req, res, next) => {
  try {
    const parsed = publishPageSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        status: 'fail',
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const page = await Page.findOne({ _id: req.params.id, userId: req.user._id });

    if (!page) {
      return res.status(404).json({ status: 'fail', message: 'Page not found' });
    }

    const frontendUrl = config.frontend?.url || process.env.FRONTEND_URL || process.env.APP_BASE_URL || 'http://localhost:5000';
    let liveUrl;

    if (!page.previewToken) {
      page.previewToken = crypto.randomBytes(16).toString('hex');
    }
    page.previewUrl = `${frontendUrl}/preview?page=${page._id}&token=${page.previewToken}`;

    if (parsed.data.domain) {
      page.domain = parsed.data.domain;
      liveUrl = `https://${parsed.data.domain}/?page=${page._id}`;
    } else if (parsed.data.subdomain) {
      page.domain = `${parsed.data.subdomain}.${process.env.APP_DOMAIN || 'pages.yourdomain.com'}`;
      liveUrl = `https://${page.domain}/?page=${page._id}`;
    } else {
      liveUrl = `${frontendUrl}/?page=${page._id}`;
    }
    page.liveUrl = liveUrl;

    const oldStatus = page.status;
    page.status = 'published';
    page.publishedAt = Date.now();
    page.updatedAt = Date.now(); parsed.data.domain

    if (!page.apiToken) {
      page.apiToken = crypto.randomBytes(32).toString('hex');
    }

    await page.save({ validateBeforeSave: false });

    // Sync project count
    if (oldStatus !== 'published') {
      await Project.findByIdAndUpdate(page.projectId, { $inc: { publishedPageCount: 1 } });
    }

    if (page.domain) {
      PublishService.triggerPublishJob(page.domain, page.slug);
      if (page.apiToken) {
        SyncService.flushWordPressCache(page.domain, page.apiToken);
      }
    }

    // ─── DYNAMIC FORM SCHEMA EXTRACTION AT PUBLISH TIME ───
    await syncFormSchema(page);

    return res.status(200).json({
      status: 'success',
      message: 'Page published successfully',
      data: {
        page,
        liveUrl,
        previewUrl: page.previewUrl,
        apiToken: page.apiToken
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── POST /pages/:id/unpublish ────────────────────────────────────────────────
exports.unpublishPage = async (req, res, next) => {
  try {
    const page = await Page.findOne({ _id: req.params.id, userId: req.user._id });

    if (!page) {
      return res.status(404).json({ status: 'fail', message: 'Page not found' });
    }

    const oldStatus = page.status;
    page.status = 'draft';
    page.updatedAt = Date.now();
    await page.save({ validateBeforeSave: false });

    // Sync project count
    if (oldStatus === 'published') {
      await Project.findByIdAndUpdate(page.projectId, { $inc: { publishedPageCount: -1 } });
    }

    if (page.domain && page.apiToken) {
      SyncService.flushWordPressCache(page.domain, page.apiToken);
    }

    return res.status(200).json({ status: 'success', message: 'Page unpublished', data: { page } });
  } catch (err) {
    next(err);
  }
};

// ─── POST /pages/:id/leads ────────────────────────────────────────────────────
exports.captureLead = async (req, res, next) => {
  try {
    const parsed = leadSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        status: 'fail',
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const { name, email, message } = parsed.data;

    const page = await Page.findOneAndUpdate(
      { _id: req.params.id, status: 'published' },
      {
        $push: {
          leads: { name, email, message: message || '', createdAt: Date.now() },
        },
      },
      { new: true, select: '_id title leads settings' }
    );

    if (!page) {
      return res.status(404).json({ status: 'fail', message: 'Published page not found' });
    }

    if (page.settings?.webhookUrl) {
      setImmediate(async () => {
        try {
          const response = await fetch(page.settings.webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              event: 'lead_captured',
              pageId: page._id,
              pageTitle: page.title,
              lead: { name, email, message },
              timestamp: new Date().toISOString()
            })
          });
        } catch (err) { }
      });
    }

    return res.status(201).json({
      status: 'success',
      message: 'Thank you! We will be in touch soon.',
    });
  } catch (err) {
    next(err);
  }
};

// ─── GET /pages/:id/leads ─────────────────────────────────────────────────────
exports.getLeads = async (req, res, next) => {
  try {
    const page = await Page.findOne(
      { _id: req.params.id, userId: req.user._id, isDeleted: { $ne: true } },
      { leads: 1, title: 1 }
    );

    if (!page) {
      return res.status(404).json({ status: 'fail', message: 'Page not found' });
    }

    return res.status(200).json({
      status: 'success',
      results: page.leads.length,
      data: { leads: page.leads },
    });
  } catch (err) {
    next(err);
  }
};

// ─── GET /pages/:id/export-leads ──────────────────────────────────────────────
exports.exportLeadsCsv = async (req, res, next) => {
  try {
    const page = await Page.findOne(
      { _id: req.params.id, userId: req.user._id, isDeleted: { $ne: true } },
      { leads: 1, title: 1, slug: 1 }
    );

    if (!page) {
      return res.status(404).json({ status: 'fail', message: 'Page not found' });
    }

    const headers = 'Name,Email,Message,Date\n';
    const rows = (page.leads || []).map((l) => {
      const safeName = `"${(l.name || '').replace(/"/g, '""')}"`;
      const safeEmail = `"${(l.email || '').replace(/"/g, '""')}"`;
      const safeMessage = `"${(l.message || '').replace(/"/g, '""')}"`;
      return `${safeName},${safeEmail},${safeMessage},${new Date(l.createdAt).toISOString()}`;
    });

    const csvData = headers + rows.join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=leads-${page.slug}.csv`);
    return res.status(200).send(csvData);
  } catch (err) {
    next(err);
  }
};