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
const emailService = require('../services/emailService');
const { generateNotificationEmailHTML } = require('../utils/emailTemplates');
const logger = require('../utils/logger');
const config = require('../config');

const AppError = require('../utils/AppError');
const FormSchema = require('../models/FormSchema');
const { extractFormFields } = require('../utils/formExtractor');
const { syncFormSchema } = require('../utils/schemaSync');
const { verifyProjectIntegration } = require('../utils/verifyIntegration');

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
  fonts: z.object({
    bodyFont: z.string().optional(),
    headingFont: z.string().optional(),
  }).optional(),
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

const normalizeSlug = (value) => {
  if (!value) return '';
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// ─── Helper: Unique slug generator ────────────────────────────────────────────
const generateUniqueSlug = async (base, projectId, excludeId = null) => {
  const slug = normalizeSlug(base) || 'untitled';
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

// Race HEAD and GET concurrently (instead of sequential fallback), short
// timeout so live "as-you-type" checks stay snappy.
const fastFetch = async (url, timeoutMs) => {
  const attempt = async (method) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetch(url, { method, signal: controller.signal, redirect: 'follow' });
    } finally {
      clearTimeout(timeoutId);
    }
  };

  // Some real-world servers/WAFs silently drop or never answer HEAD requests
  // at all (industrialtubecorp.com does this consistently). Sequentially
  // waiting out HEAD's full timeout before even starting GET doubled our
  // worst-case latency for exactly the sites where GET was always going to
  // be the one that works — and left GET's own window too tight when the
  // origin is genuinely just slow (~2.5-3s response times seen in practice).
  // Racing both concurrently means whichever responds first wins, and total
  // wait time stays bounded by timeoutMs instead of 2x timeoutMs.
  try {
    return await Promise.any([attempt('HEAD'), attempt('GET')]);
  } catch (aggregateErr) {
    // Promise.any throws an AggregateError when every attempt rejected —
    // surface the first underlying error so callers' error logging stays
    // meaningful instead of just "All promises were rejected".
    throw (aggregateErr?.errors && aggregateErr.errors[0]) || aggregateErr;
  }
};

// Returns { exists: boolean, verified: boolean }.
// verified=false means the external site could not be reached - caller must NOT block on this.
const checkPageExistsOnExternalWebsite = async (project, slug, { timeoutMs = 5000 } = {}) => {
  if (!project?.websiteUrl || !slug) {
    logger.debug(`Skipping external website check: websiteUrl=${!!project?.websiteUrl}, slug=${!!slug}`);
    return { exists: false, verified: false };
  }
  let baseUrl = project.websiteUrl;
  if (!baseUrl.startsWith('http')) {
    baseUrl = 'https://' + baseUrl;
  }
  baseUrl = baseUrl.trim().replace(/\/+$/g, '');
  const checkUrl = `${baseUrl}/${slug}`;
  const randomUrl = `${baseUrl}/pagecraft-test-404-${Date.now()}`;
  logger.info(`Checking if page exists on external website: ${checkUrl}`);

  try {
    // Run the slug check and the catch-all probe in parallel - cuts latency roughly in half.
    const [checkResponse, catchAllResponse] = await Promise.all([
      fastFetch(checkUrl, timeoutMs),
      fastFetch(randomUrl, timeoutMs).catch(() => null),
    ]);

    logger.debug(`External website check response for ${checkUrl}: status=${checkResponse.status}`);

    if (checkResponse.status === 200) {
      if (!catchAllResponse || catchAllResponse.status !== 200) {
        logger.warn(`Page slug "${slug}" exists on website ${baseUrl} (returned 200, catch-all confirmed)`);
        return { exists: true, verified: true };
      }
      logger.debug(`Site has catch-all routing enabled, random URL also returned 200`);
      return { exists: false, verified: true };
    }

    return { exists: false, verified: true };
  } catch (err) {
    // Site unreachable, timed out, DNS failure, etc. - never block creation on this.
    logger.warn(`Could not verify if page exists on external website: ${checkUrl}`, { error: err?.message || err });
    return { exists: false, verified: false };
  }
};

// Helper: Ensure project ownership
const checkProjectOwnership = async (projectId, userId) => {
  return await Project.exists({ _id: projectId, userId });
};

// ─── Helper: Global published-slug uniqueness check ───────────────────────────
// Slugs must be unique across ALL published/live pages, regardless of project.
// Returns the conflicting page (lean, minimal fields) if one exists, else null.
const findPublishedSlugConflict = async (slug, { excludePageId } = {}) => {
  if (!slug) return null;
  const query = { slug, status: 'published', isDeleted: { $ne: true } };
  if (excludePageId) query._id = { $ne: excludePageId };
  return Page.findOne(query).select('_id projectId slug').lean();
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
    console.log(`Verifying page slug: projectId=${projectId}, name=${name}, slug=${slug}, prefix=${prefix}`);
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

    // Collision within the same project
    if (await Page.exists({ projectId, slug: normalizedSlug })) {
      return res.status(400).json({
        success: false,
        message: 'This URL slug already exists in this project. Please choose a different page name.',
        data: {}
      });
    }

    // Global collision with any PUBLISHED/live page (any project) — slugs must
    // be globally unique among published pages, mirroring the hard rejection
    // enforced server-side in createPage.
    const publishedConflict = await findPublishedSlugConflict(normalizedSlug);
    if (publishedConflict) {
      return res.status(400).json({
        success: false,
        message: 'This slug is already in use by a published page. Please choose a different slug.',
        data: {}
      });
    }

    // If the current project has a configured websiteUrl, check other projects
    // that use the same website URL and slug — block only in that case.
    if (project.websiteUrl) {
      const normalizeWebsiteKey = (u) => {
        if (!u) return '';
        let s = u.trim().toLowerCase();
        if (!s.startsWith('http')) s = 'https://' + s;
        try {
          const urlObj = new URL(s);
          // Use hostname + pathname (without trailing slash) as comparison key
          return (urlObj.hostname.replace(/^www\./, '') + urlObj.pathname.replace(/\/+$/, '')) || urlObj.hostname.replace(/^www\./, '');
        } catch (e) {
          return s.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/+$/, '');
        }
      };

      const thisSiteKey = normalizeWebsiteKey(project.websiteUrl);
      if (thisSiteKey) {
        const otherPages = await Page.find({ slug: normalizedSlug }).lean();
        for (const op of otherPages) {
          if (!op.projectId) continue;
          if (op.projectId.toString() === projectId.toString()) continue; // same project already checked
          const otherProject = await Project.findById(op.projectId).select('websiteUrl').lean();
          const otherSiteKey = normalizeWebsiteKey(otherProject?.websiteUrl);
          if (otherSiteKey && otherSiteKey === thisSiteKey) {
            return res.status(400).json({
              success: false,
              message: 'This URL slug is already used by another project on the same website. Please choose a different page name.',
              data: { conflictingProjectId: op.projectId }
            });
          }
        }
      }
    }

    // Check if page exists on external website if websiteUrl is configured.
    // This is the "typeahead" verify step (fired on blur / debounce while the
    // user is still editing the form), so it must respond fast — it must NOT
    // make the user sit through the external site's 5-6s timeout every time
    // they click away or keep typing. The external check is fired here in the
    // background (not awaited) and just logged; it never blocks this response.
    // The real, authoritative external check still runs synchronously in
    // createPage at actual submission time, so nothing unsafe slips through —
    // this endpoint is only ever a fast, best-effort preview.
    let checkedExternal = false;
    let externalCheckMessage = '';

    if (project.websiteUrl) {
        const { exists, verified } =
            await checkPageExistsOnExternalWebsite(
                project,
                normalizedSlug,
                { timeoutMs: 10000 }
            );

        if (verified && exists) {
            return res.status(400).json({
                success: false,
                message: "This page already exists on your website.",
                data: {
                    slug: normalizedSlug
                }
            });
        }
    }

    return res.status(200).json({
        success: true,
        message: "Slug is available",
        data: {
            slug: normalizedSlug
        }
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

// ─── GET /projects/:projectId/pages/:id/status ────────────────────────────────
// Lightweight poll target for AI generation progress. Returns just enough for
// the client to know when a page created via createPage has finished
// generating in the background, so it can then load the full page/editor.
// No content/styles blobs — same "lean" spirit as getPageSettings.
// Safety net only — normal generation (even multi-pass, higher MAX_OUTPUT_TOKENS)
// finishes well under this. This only catches a genuinely abandoned job, e.g.
// a server restart that killed the background worker mid-generation, so the
// client's poll gets a clean "failed" instead of spinning forever.
const STALE_GENERATION_THRESHOLD_MS = 8 * 60 * 1000; // 8 minutes

exports.getPageGenerationStatus = async (req, res, next) => {
  try {
    const { id, projectId } = req.params;
    let page = await Page.findOne({ _id: id, userId: req.user._id, projectId })
      .select('_id title slug status generationProgress generationError previewUrl createdAt updatedAt')
      .lean();

    if (!page) return res.status(404).json({ status: 'fail', message: 'Page not found' });

    if (page.status === 'generating') {
      const referenceTime = page.updatedAt || page.createdAt;
      const stale = referenceTime && (Date.now() - new Date(referenceTime).getTime() > STALE_GENERATION_THRESHOLD_MS);
      if (stale) {
        const failMessage = 'Generation is taking unusually long and appears to have stalled (e.g. a server restart). Please try again.';
        await Page.findByIdAndUpdate(page._id, { status: 'failed', generationError: failMessage }).catch(() => {});
        page = { ...page, status: 'failed', generationError: failMessage };
      }
    }

    res.status(200).json({
      status: 'success',
      data: {
        pageId: page._id,
        _id: page._id,
        title: page.title,
        slug: page.slug,
        status: page.status,
        generationProgress: page.generationProgress,
        generationError: page.generationError || null,
        previewUrl: page.previewUrl,
      },
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

    // 4.5 Global slug uniqueness check against PUBLISHED/live pages.
    // Slugs must be globally unique across all published pages (any project) —
    // unlike the same-project draft dedup below, this is a hard rejection, not
    // an auto-resolve, since a URL collision with a live page is a real conflict.
    const requestedSlug = normalizeSlug(finalSlug || slug || title) || 'untitled';
    const publishedConflict = await findPublishedSlugConflict(requestedSlug);
    if (publishedConflict) {
      return res.status(400).json({
        success: false,
        message: 'This slug is already in use by a published page. Please choose a different slug.',
        data: { field: 'slug', slug: requestedSlug }
      });
    }

    // 5. Slug Generation (use finalSlug if provided)
    let uniqueSlug = finalSlug ? await generateUniqueSlug(finalSlug, projectId) : await generateUniqueSlug(slug || title, projectId);

    // 5.5a Check if same slug exists in another project that shares the same websiteUrl (DB check)
    if (project.websiteUrl) {
      const normalizeWebsiteKey = (u) => {
        if (!u) return '';
        let s = u.trim().toLowerCase();
        if (!s.startsWith('http')) s = 'https://' + s;
        try {
          const urlObj = new URL(s);
          return (urlObj.hostname.replace(/^www\./, '') + urlObj.pathname.replace(/\/+$/, '')) || urlObj.hostname.replace(/^www\./, '');
        } catch (e) {
          return s.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/+$/, '');
        }
      };

      const thisSiteKey = normalizeWebsiteKey(project.websiteUrl);
      if (thisSiteKey) {
        // Find any pages (across all projects) with the same slug
        const conflictingPages = await Page.find({ slug: uniqueSlug, isDeleted: { $ne: true } }).lean();
        for (const op of conflictingPages) {
          if (!op.projectId) continue;
          if (op.projectId.toString() === projectId.toString()) continue; // same project already handled above
          const otherProject = await Project.findById(op.projectId).select('websiteUrl').lean();
          const otherSiteKey = normalizeWebsiteKey(otherProject?.websiteUrl);
          if (otherSiteKey && otherSiteKey === thisSiteKey) {
            logger.warn(`Slug "${uniqueSlug}" already used by project ${op.projectId} on same website "${thisSiteKey}". Auto-resolving.`);
            // Auto-resolve: append suffix so AI generation is not lost
            uniqueSlug = uniqueSlug + '-' + crypto.randomBytes(3).toString('hex');
            break;
          }
        }
      }
    }

    // 5.5b Check if page already exists on the external website (best-effort, non-blocking)
    if (project.websiteUrl) {
      const { exists: existsOnWebsite, verified } = await checkPageExistsOnExternalWebsite(project, uniqueSlug);
      if (verified && existsOnWebsite) {
        // Auto-resolve by appending random string instead of throwing 400 and losing AI generation
        uniqueSlug = uniqueSlug + '-' + crypto.randomBytes(3).toString('hex');
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

    // Set initial progress
    page.generationProgress = 5;
    await page.save();

    // Increment pageCount
    await Project.findByIdAndUpdate(projectId, { $inc: { pageCount: 1 } });

    const frontendUrlInitial = config.frontend?.url || process.env.FRONTEND_URL || process.env.APP_BASE_URL || 'http://localhost:5000';
    const previewUrlInitial = `${frontendUrlInitial}/preview?page=${page._id}&token=${page.previewToken}`;

    // 7. Respond to the client right away instead of blocking on AI generation.
    // AI content generation + image processing can comfortably exceed typical
    // client/proxy/gateway timeouts. The page already exists in the DB with
    // status "generating", so we hand the client its id immediately and finish
    // the actual generation in the background. The client is expected to poll
    // GET /projects/:projectId/pages/:id/status until status is "draft"
    // (success) or "failed" (error), then navigate to the editor.
    res.status(202).json({
      success: true,
      message: 'Page created. Content generation is in progress.',
      data: {
        pageId: page._id,
        _id: page._id,
        title: page.title,
        slug: page.slug,
        status: page.status,
        generationProgress: page.generationProgress,
        previewUrl: previewUrlInitial,
      },
    });

    // Everything from here on runs after the response has already been sent.
    // It must never write to `res` again — any failure is instead recorded on
    // the Page document so the client's status poll can observe it.
    runPageGeneration({
      pageId: page._id,
      projectId,
      project,
      camelAiPrompt,
      ai_prompt,
      targetAudience,
      businessDescription,
      business_description,
      ctaText,
      keywords,
      figmaImage,
      fonts: req.body.fonts,
    }).catch((bgErr) => {
      logger.error('Unhandled error in background page generation:', {
        error: bgErr.message,
        stack: bgErr.stack,
        pageId: page._id,
      });
    });
    return;

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

// ─── Background worker: runs the actual AI generation for a page ──────────────
// Invoked (not awaited) by createPage after it has already responded to the
// client. Must never touch `res`. Progress/results/errors are persisted on
// the Page document; the client observes them via GET .../pages/:id/status.
async function runPageGeneration(opts) {
  const {
    pageId, projectId, project,
    camelAiPrompt, ai_prompt, targetAudience, businessDescription, business_description,
    ctaText, keywords, figmaImage, fonts,
  } = opts;

  const page = await Page.findById(pageId);
  if (!page) return; // extremely unlikely: page vanished before generation started

  // Snapshot the content/styles the page was created with, before anything
  // below mutates `page` — used as the fallback if AI generation produces
  // no usable HTML.
  const initialContent = page.content;
  const initialStyles = page.styles;
  const initialLandingPageContent = page.landingPageContent;
  const initialLandingPageStyles = page.landingPageStyles;

  try {
    // 7. AI Content Generation (Allows templates to be filled by AI if a prompt exists)
    let aiResponse = { sections: [], seo: {} };
    const promptToUse = camelAiPrompt || ai_prompt || '';
    const isTemplateWithPrompt = page.generationMethod === 'template' && promptToUse.trim().length > 0;
    const isAIRequested = page.generationMethod === 'ai' || isTemplateWithPrompt;

    if (isAIRequested) {
      logger.info(`Starting AI generation for page ${page._id} (Template: ${isTemplateWithPrompt})`);
      // update progress: AI generation started
      try { await Page.findByIdAndUpdate(page._id, { generationProgress: 10 }).exec(); } catch (e) { /* non-fatal */ }

      // If it's a template, we pass a hint to the AI service
      // Merge scraped fonts with any fonts explicitly passed from the frontend
      const resolvedFonts = {
        bodyFont: fonts?.bodyFont || project.websiteProfile?.fonts?.bodyFont || project.websiteProfile?.fonts?.primaryFont || null,
        headingFont: fonts?.headingFont || project.websiteProfile?.fonts?.headingFont || null,
        googleFonts: project.websiteProfile?.fonts?.googleFonts || [],
      };

      const aiInput = {
        businessName: project.name,
        industry: project.websiteProfile?.industry?.industry || project.industry,
        pageType: 'lead generation',
        targetAudience: targetAudience || project.description || 'Business owners looking for ' + (project.websiteProfile?.industry?.industry || project.industry) + ' services',
        businessDescription: businessDescription || business_description || project.websiteProfile?.identity?.description || project.description,
        ctaText: ctaText || project.websiteProfile?.content?.hero?.ctaText || 'Get Started',
        tone: 'Professional',
        aiPrompt: promptToUse,
        logoUrl: page.logoUrl || project.websiteProfile?.identity?.logoUrl || project.logoUrl || '',
        primaryColor: page.primaryColor || project.websiteProfile?.logoColors?.primary || project.websiteProfile?.colors?.primary || project.primaryColor,
        secondaryColor: page.secondaryColor || project.websiteProfile?.logoColors?.secondary || project.websiteProfile?.colors?.secondary || project.secondaryColor,
        accentColor: page.accentColor || project.websiteProfile?.colors?.accent || project.secondaryColor || '#6366f1',
        services: page.services || project.services || [],
        keywords: keywords || project.websiteProfile?.seo?.keywords || [],
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
        // Fonts: merge incoming (from form) with scraped (from websiteProfile) — incoming takes priority
        scrapedFonts: (resolvedFonts.bodyFont || resolvedFonts.headingFont) ? resolvedFonts : null,
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
        try { await Page.findByIdAndUpdate(page._id, { generationProgress: 60 }).exec(); } catch (e) { }
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
  --accent: ${page.accentColor || page.secondaryColor};
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
  --accent: ${page.accentColor || page.secondaryColor};
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

        // Re-extract updated CSS to fix stock images in CSS rules
        const styleRegex = new RegExp('<style[^>]*>([\\\\s\\\\S]*?)<\\\\/style>', 'gi');
        const styleMatches = page.landingPageContent.match(styleRegex);
        if (styleMatches) {
          const tagRegex = new RegExp('<\\\\/?style[^>]*>', 'gi');
          const extractedCss = styleMatches.map(s => s.replace(tagRegex, '')).join('\n');
          const brandingStyles = `
:root {
  --primary: ${page.primaryColor};
  --secondary: ${page.secondaryColor};
  --accent: ${page.accentColor || page.secondaryColor};
  --button-gradient: linear-gradient(135deg, ${page.primaryColor}, ${page.secondaryColor});
}
`;
          page.styles = brandingStyles + extractedCss;
          page.landingPageStyles = page.styles;
        }
      }
      // update progress after images processed
      try { await Page.findByIdAndUpdate(page._id, { generationProgress: 85 }).exec(); } catch (e) { }
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
    // final touches
    try { await Page.findByIdAndUpdate(page._id, { generationProgress: 98 }).exec(); } catch (e) { }
    page.status = 'draft';
    page.generationProgress = 100;
    page.generationError = undefined;
    await page.save();

    // 8.5 Sync Form Schema Immediately
    await syncFormSchema(page);

    // 9. Generation finished. There is no request to respond to anymore —
    // the client already has the pageId and is polling .../pages/:id/status,
    // which will now report status: "draft", generationProgress: 100.
    logger.info(`Landing page generation finished for ${page._id}`);

  } catch (aiErr) {
    logger.error('AI Generation Failed during background page generation:', {
      error: aiErr.message,
      stack: aiErr.stack,
      pageId,
    });

    // Mark the page as failed instead of deleting it and writing an HTTP
    // response — the response was already sent. The client's status poll
    // picks this up and can show a clear error (with the option to retry
    // or delete the page) instead of a generic timeout.
    try {
      await Page.findByIdAndUpdate(pageId, {
        status: 'failed',
        generationError: aiErr.message || 'AI generation failed',
      }).exec();
    } catch (e) { /* non-fatal */ }
  }
}

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

    // ─── LIVE RE-VERIFICATION GATE ───────────────────────────────────────
    // A one-time "Verify" click only proves the integration script was
    // present at that moment in the past. If this request is (re)publishing
    // the page, re-check RIGHT NOW that the script is still on the site —
    // don't trust project.isVerified alone, since it can go stale at any
    // time (script removed, plugin deactivated, site migrated, etc.), and
    // this endpoint is also reachable directly via API, bypassing any
    // client-side check entirely.
    if (parsed.data.status === 'published') {
      const project = await Project.findById(currentPage.projectId);
      if (!project) {
        return res.status(404).json({ status: 'fail', message: 'Project not found' });
      }

      const { verified, method, reachable, message } = await verifyProjectIntegration(project);

      // This live scan can't tell WHICH method (Plugin vs Script) it saw —
      // it just checks whether the token appears anywhere on the page —
      // but it CAN tell whether it actually reached and scanned the live
      // page (`reachable: true`) versus failed to reach it at all
      // (`reachable: false`, e.g. network error, 403, 404).
      //
      // Those two cases need opposite handling:
      //  - reachable + not found  → a REAL "integration is not live right
      //    now" signal (script removed, plugin deactivated, etc.). Both
      //    per-method flags must be synced down to false here, the same way
      //    verifyScript() syncs them in both directions — otherwise a flag
      //    that was only ever set to `true` (e.g. isPluginVerified, which
      //    is flipped on by the WordPress plugin's out-of-band POST
      //    /plugin/verify call but never flipped off when the plugin is
      //    deactivated) would stay true forever, and this gate would never
      //    actually block a stale/removed integration from publishing.
      //  - NOT reachable → inconclusive. We didn't actually get to look at
      //    the page, so this says nothing about whether the integration is
      //    present. Don't punish the project for a transient failure —
      //    fall back to the persisted per-method flags.
      let aggregateVerified;
      if (verified && method === 'script') {
        await Project.findByIdAndUpdate(project._id, {
          isScriptVerified: true,
          scriptVerifiedAt: new Date(),
          isVerified: true,
          verificationStatus: 'active',
          verifiedAt: new Date()
        });
      } else if (verified && (method === 'meta' || method === 'raw-html')) {
        // Token found outside a <script> tag — consistent with how the
        // WordPress Plugin injects it (shortcode/widget output), not the
        // manual embed snippet.
        await Project.findByIdAndUpdate(project._id, {
          isPluginVerified: true,
          pluginVerifiedAt: new Date(),
          isVerified: true,
          verificationStatus: 'active',
          verifiedAt: new Date()
        });
        aggregateVerified = true;
      } else if (reachable) {
        // Live scan reached the website, but integration token was NOT found!
        // This is a definitive signal that the plugin has been deactivated or the script removed.
        await Project.findByIdAndUpdate(project._id, {
          isPluginVerified: false,
          isScriptVerified: false,
          isVerified: false,
          verificationStatus: 'inactive'
        });
        aggregateVerified = false;
      } else {
        // Live scan was inconclusive (network error, bot block, or unreachable site).
        // Fall back to stored DB status without clearing persisted flags.
        aggregateVerified = !!(project.isPluginVerified || project.isScriptVerified);
        await Project.findByIdAndUpdate(project._id, {
          isVerified: aggregateVerified,
          verificationStatus: aggregateVerified ? 'active' : project.verificationStatus
        });
      }

      if (!verified) {
        return res.status(403).json({
          status: 'fail',
          message: message || `Cannot publish: your project's integration (Plugin or Script) is deactivated or missing on the live website. Please activate the plugin or add the embed script, then click Verify.`
        });
      }
    }

    if (parsed.data.slug && parsed.data.slug !== currentPage.slug) {
      const uniqueSlug = await generateUniqueSlug(parsed.data.slug, currentPage.projectId, currentPage._id);

      const project = await Project.findById(currentPage.projectId);
      if (project && project.websiteUrl) {
        const { exists: existsOnWebsite, verified } = await checkPageExistsOnExternalWebsite(project, uniqueSlug);
        if (verified && existsOnWebsite) {
          return res.status(400).json({
            status: 'fail',
            message: `Page already exists on website`
          });
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
    // Check if Publish Engine is enabled
    if (process.env.PUBLISH_ENGINE_ENABLED === 'false') {
      return res.status(403).json({
        status: 'fail',
        message: 'Publishing is currently disabled. Please use the Claim feature instead.'
      });
    }

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

    const project = await Project.findById(page.projectId);
    if (project) {
      const { verified, method, reachable, message } = await verifyProjectIntegration(project);

      // See the equivalent block in updatePage for the full reasoning.
      // Short version: a scan miss only counts as real proof the
      // integration is gone when the site was actually reachable and
      // scanned (reachable === true). An unreachable/blocked check is
      // inconclusive and must not downgrade anything.
      let aggregateVerified;
      if (verified && method === 'script') {
        await Project.findByIdAndUpdate(project._id, {
          isScriptVerified: true,
          scriptVerifiedAt: new Date(),
          isVerified: true,
          verificationStatus: 'active',
          verifiedAt: new Date()
        });
      } else if (verified && (method === 'meta' || method === 'raw-html')) {
        await Project.findByIdAndUpdate(project._id, {
          isPluginVerified: true,
          pluginVerifiedAt: new Date(),
          isVerified: true,
          verificationStatus: 'active',
          verifiedAt: new Date()
        });
      } else {
        // Live scan was inconclusive OR reachable-but-token-not-found.
        // During a publish attempt we do NOT wipe persisted flags — the plugin
        // output can be cached/delayed after a reactivation, and a single scan
        // miss during publish is not authoritative enough to lock the user out.
        // Flags are only cleared by an explicit "Verify" button click
        // (verifyScript / verifyPlugin endpoints). Fall back to what the DB says.
        aggregateVerified = !!(project.isPluginVerified || project.isScriptVerified);
        // Keep isVerified in sync with the aggregate
        await Project.findByIdAndUpdate(project._id, {
          isVerified: aggregateVerified,
          verificationStatus: aggregateVerified ? 'active' : project.verificationStatus
        });
      }

      if (!verified) {
        return res.status(403).json({
          status: 'fail',
          message: `Cannot publish: your project's integration (Plugin or Script) could not be confirmed. Please go to Settings → Integration and click Verify.`
        });
      }
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
    page.updatedAt = Date.now();

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

// ─── POST /pages/claim-request ────────────────────────────────────────────────
exports.claimRequest = async (req, res, next) => {
  try {
    // Check if Publish Engine is disabled (Claim only available when Publish is disabled)
    if (process.env.PUBLISH_ENGINE_ENABLED !== 'false') {
      return res.status(403).json({
        status: 'fail',
        message: 'Claim feature is only available when publishing is disabled.'
      });
    }

    const { pageTitle, landingPageUrl, websiteUrl, clientEmail } = req.body;

    if (!pageTitle) {
      return res.status(400).json({
        status: 'fail',
        message: 'Page title is required'
      });
    }

    const adminEmail = process.env.ADMIN_MAIL || 'admin@gmail.com';

    if (!adminEmail) {
      return res.status(500).json({
        status: 'fail',
        message: 'Admin email is not configured'
      });
    }

    // Prefer authenticated user's email, fall back to clientEmail from body, then 'N/A'
    const userEmail = (req.user && req.user.email) ? req.user.email : (clientEmail || 'N/A');

    // Try to determine the project website URL from the landing/preview URL when possible
    let projectWebsiteUrl = websiteUrl || 'N/A';
    try {
      if (landingPageUrl) {
        try {
          const parsed = new URL(landingPageUrl);
          // preview URL pattern: /preview?page=<pageId>&token=...
          const pageId = parsed.searchParams.get('page');
          if (pageId) {
            const pageDoc = await Page.findById(pageId).select('projectId').lean();
            if (pageDoc && pageDoc.projectId) {
              const project = await Project.findById(pageDoc.projectId).select('websiteUrl').lean();
              if (project && project.websiteUrl) projectWebsiteUrl = project.websiteUrl;
            }
          } else {
            // Try to extract page id from editor URL paths like /editor/:id or /editor/:id/
            const pathMatch = parsed.pathname.match(/\/editor\/(?:preview\/)?([a-f0-9]{24})/i);
            if (pathMatch && pathMatch[1]) {
              const pageDoc = await Page.findById(pathMatch[1]).select('projectId').lean();
              if (pageDoc && pageDoc.projectId) {
                const project = await Project.findById(pageDoc.projectId).select('websiteUrl').lean();
                if (project && project.websiteUrl) projectWebsiteUrl = project.websiteUrl;
              }
            }
          }
        } catch (parseErr) {
          // ignore URL parse errors
        }
      }
    } catch (e) { }

    try {
      // Build the HTML email body using the shared admin notification card design
      const submittedAt = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
      const _link = (url) => url
        ? `<a href="${url}" target="_blank" rel="noopener" style="color: #2b5b84; text-decoration: none; word-break: break-all; overflow-wrap: break-word;">${url}</a>`
        : 'N/A';

      const htmlBody = generateNotificationEmailHTML({
        headerTitle: 'New Page Claim Request',
        headerSubtitle: 'CLAIM NOTIFICATION',
        headerIcon: '📄',
        sections: [
          {
            title: 'Claim Details',
            icon: '📄',
            rows: [
              { label: 'Client Email', value: `<a href="mailto:${userEmail}" style="color: #2b5b84; text-decoration: none;">${userEmail}</a>` },
              { label: 'Landing Page', value: _link(landingPageUrl) },
              { label: 'Website URL', value: _link(projectWebsiteUrl) },
              { label: 'Page Title', value: pageTitle },
              { label: 'Submitted', value: submittedAt },
              { label: 'IP Address', value: req.ip || 'N/A' }
            ]
          }
        ],
        fromName: process.env.FROM_NAME || 'AI Landing Page Builder'
      });

      // Send email to admin
      await emailService.sendEmail({
        to: adminEmail,
        subject: `New Page Claim Request - ${pageTitle}`,
        htmlContent: htmlBody,
        fromName: process.env.FROM_NAME || 'AI Landing Page Builder',
        fromEmail: process.env.FROM_EMAIL || 'websitetestingid@gmail.com'
      });

      return res.status(200).json({
        status: 'success',
        message: 'Claim request sent successfully. An administrator will review your request.'
      });
    } catch (emailError) {
      logger.error('Failed to send claim email:', emailError);
      return res.status(500).json({
        status: 'fail',
        message: 'Failed to send claim request. Please try again later.'
      });
    }
  } catch (err) {
    next(err);
  }
};