'use strict';

const { z } = require('zod');
const crypto = require('crypto');
const Page = require('../models/Page');
const Project = require('../models/Project');
const AIService = require('../services/aiService');
const PublishService = require('../services/publishService');
const SyncService = require('../services/syncService');
const logger = require('../utils/logger');

// ─── Validation Schemas ────────────────────────────────────────────────────────
const createPageSchema = z.object({
  title: z.string().min(1, 'title is required'),
  template: z.string().optional(),
  business_name: z.string().optional(),
  business_description: z.string().optional(),
  target_audience: z.string().optional(),
  cta_text: z.string().optional(),
  ai_prompt: z.string().optional(),
  industry: z.string().optional(),
});

const updatePageSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  content: z.any().optional(),
  status: z.enum(['draft', 'published']).optional(),
  seo: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      keywords: z.array(z.string()).optional(),
    })
    .optional(),
  designUrl: z.string().url('Invalid Figma or Stitch URL').optional(),
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

// Helper: Ensure project ownership
const checkProjectOwnership = async (projectId, userId) => {
  return await Project.exists({ _id: projectId, userId });
};

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
        .select('-leads -__v'),
      Page.countDocuments(filter),
    ]);

    return res.status(200).json({
      status: 'success',
      results: pages.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      data: { pages },
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

    const baseAppUrl = process.env.APP_BASE_URL || 'http://localhost:5000';
    const previewUrl = page.previewUrl || `${baseAppUrl}/preview/${page.slug}`;

    return res.status(200).json({
      status: 'success',
      data: {
        page: {
          ...page.toObject(),
          previewUrl
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

// ─── POST /projects/:projectId/pages (Enhanced with AI) ───────────────────────
exports.createPage = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const parsed = createPageSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        status: 'fail',
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    if (!(await checkProjectOwnership(projectId, req.user._id))) {
      return res.status(403).json({ status: 'fail', message: 'Unauthorized project' });
    }

    const { 
      title, 
      template, 
      business_name, 
      business_description, 
      target_audience, 
      cta_text, 
      ai_prompt,
      industry 
    } = parsed.data;

    const uniqueSlug = await generateUniqueSlug(title, projectId);

    const page = await Page.create({
      projectId,
      userId: req.user._id,
      title,
      slug: uniqueSlug,
      template: template || 'blank',
      aiPrompt: ai_prompt,
      status: 'generating',
      previewToken: crypto.randomBytes(16).toString('hex'),
    });

    let aiResponse = { sections: [], seo: {} };
    try {
      const generated = await AIService.generateLandingPageContent({
        businessName: business_name || title,
        industry: industry || 'Service',
        businessDescription: business_description || '',
        targetAudience: target_audience || 'General',
        ctaText: cta_text || 'Get Started',
        aiPrompt: ai_prompt || '',
        pageId: page._id
      });

      aiResponse = {
        sections: generated.pageContent || [],
        fullHtml: generated.fullHtml,
        fullCss: generated.fullCss,
        fullJs: generated.fullJs,
        seo: generated.seo || {}
      };

    } catch (aiErr) {
      logger.error('AI Generation Failed during page creation:', aiErr);
    }

    const baseAppUrl = process.env.APP_BASE_URL || 'http://my-ai-backend.test:5000';
    const previewUrl = `${baseAppUrl}/preview/${page.slug}`;

    page.content = aiResponse;
    page.seo = aiResponse.seo;
    page.previewUrl = previewUrl;
    page.status = 'draft';
    await page.save();

    return res.status(201).json({
      success: true,
      message: 'Landing page created successfully',
      data: {
        page_id: page._id,
        title: page.title,
        slug: page.slug,
        preview_url: page.previewUrl,
        content: page.content
      }
    });

  } catch (err) {
    next(err);
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
      updateData.slug = uniqueSlug;
      
      const baseAppUrl = process.env.APP_BASE_URL || 'http://my-ai-backend.test:5000';
      updateData.previewUrl = `${baseAppUrl}/preview/${uniqueSlug}`;
    }

    const updatedPage = await Page.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (updatedPage.domain && updatedPage.apiToken) {
      SyncService.flushWordPressCache(updatedPage.domain, updatedPage.apiToken);
    }

    return res.status(200).json({ status: 'success', data: { page: updatedPage } });
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

    return res.status(204).json({ status: 'success', message: 'Page deleted successfully' });
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

    const baseAppUrl = process.env.APP_BASE_URL || 'https://app.yourdomain.com';
    let liveUrl;

    if (parsed.data.domain) {
      page.domain = parsed.data.domain;
      liveUrl = `https://${parsed.data.domain}`;
    } else if (parsed.data.subdomain) {
      page.domain = `${parsed.data.subdomain}.${process.env.APP_DOMAIN || 'pages.yourdomain.com'}`;
      liveUrl = `https://${page.domain}`;
    } else {
      liveUrl = `${baseAppUrl}/p/${page.slug}`;
    }

    page.status = 'published';
    page.publishedAt = Date.now();
    page.updatedAt = Date.now();

    if (!page.apiToken) {
      page.apiToken = crypto.randomBytes(32).toString('hex');
    }

    await page.save({ validateBeforeSave: false });

    if (page.domain) {
      PublishService.triggerPublishJob(page.domain, page.slug);
      if (page.apiToken) {
        SyncService.flushWordPressCache(page.domain, page.apiToken);
      }
    }

    return res.status(200).json({
      status: 'success',
      message: 'Page published successfully',
      data: {
        page,
        liveUrl,
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
    const page = await Page.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { status: 'draft', updatedAt: Date.now() },
      { new: true, runValidators: false }
    );

    if (!page) {
      return res.status(404).json({ status: 'fail', message: 'Page not found' });
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
        } catch (err) {}
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
    const rows = page.leads.map((l) => {
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
