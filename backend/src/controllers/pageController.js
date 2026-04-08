'use strict';

const { z } = require('zod');
const crypto = require('crypto');
const Page = require('../models/Page');
const PublishService = require('../services/publishService');
const SyncService = require('../services/syncService');

// ─── Validation Schemas ────────────────────────────────────────────────────────
const createPageSchema = z.object({
  title: z.string().min(1, 'title is required'),
  slug: z.string().optional(),
  template: z.string().optional(),
  content: z.any().optional(),
  designUrl: z.string().url('Invalid Figma or Stitch URL').optional(),
});

const updatePageSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.any().optional(),
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
const generateUniqueSlug = async (base) => {
  const slug = base.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  let uniqueSlug = slug;
  let counter = 1;
  while (await Page.exists({ slug: uniqueSlug })) {
    uniqueSlug = `${slug}-${counter++}`;
  }
  return uniqueSlug;
};

// ─── GET /pages ───────────────────────────────────────────────────────────────
exports.getMyPages = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = { userId: req.user._id };
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

// ─── GET /pages/:id ───────────────────────────────────────────────────────────
exports.getPage = async (req, res, next) => {
  try {
    const page = await Page.findOne({ _id: req.params.id, userId: req.user._id });

    if (!page) {
      return res.status(404).json({ status: 'fail', message: 'Page not found' });
    }

    const baseAppUrl = process.env.APP_BASE_URL || 'http://localhost:3000';
    const previewUrl = `${baseAppUrl}/preview/${page.previewToken || page._id}`;

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

// ─── POST /pages ──────────────────────────────────────────────────────────────
exports.createPage = async (req, res, next) => {
  try {
    const parsed = createPageSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        status: 'fail',
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const { title, slug, template, content, designUrl } = parsed.data;
    const uniqueSlug = await generateUniqueSlug(slug || title);

    const newPage = await Page.create({
      userId: req.user._id,
      title,
      slug: uniqueSlug,
      template: template || 'blank',
      content: content || {},
      designUrl: designUrl || undefined,
      status: 'draft',
      previewToken: crypto.randomBytes(16).toString('hex'),
    });

    const baseAppUrl = process.env.APP_BASE_URL || 'http://localhost:3000';
    const previewUrl = `${baseAppUrl}/preview/${newPage.previewToken}`;

    return res.status(201).json({
      status: 'success',
      data: {
        page: {
          ...newPage.toObject(),
          previewUrl
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

// ─── PUT /pages/:id ───────────────────────────────────────────────────────────
exports.updatePage = async (req, res, next) => {
  try {
    const parsed = updatePageSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        status: 'fail',
        message: 'Validation failed',
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const page = await Page.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { ...parsed.data, updatedAt: Date.now() },
      { new: true, runValidators: false }
    );

    if (!page) {
      return res.status(404).json({ status: 'fail', message: 'Page not found' });
    }

    // Trigger remote flush if domain is attached
    if (page.domain && page.apiToken) {
      SyncService.flushWordPressCache(page.domain, page.apiToken);
    }

    return res.status(200).json({ status: 'success', data: { page } });
  } catch (err) {
    next(err);
  }
};

// ─── DELETE /pages/:id ────────────────────────────────────────────────────────
exports.deletePage = async (req, res, next) => {
  try {
    const page = await Page.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!page) {
      return res.status(404).json({ status: 'fail', message: 'Page not found' });
    }

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

    // Determine the publish URL
    const baseAppUrl = process.env.APP_BASE_URL || 'https://app.yourdomain.com';
    let liveUrl;

    if (parsed.data.domain) {
      // Custom domain — just store it; Nginx/DNS wiring is done externally
      const existingDomain = await Page.findOne({
        domain: parsed.data.domain,
        _id: { $ne: page._id },
      });
      // if (existingDomain) {
      //   return res
      //     .status(409)
      //     .json({ status: 'fail', message: 'This domain is already in use by another page' });
      // }
      page.domain = parsed.data.domain;
      liveUrl = `https://${parsed.data.domain}`;
    } else if (parsed.data.subdomain) {
      page.domain = `${parsed.data.subdomain}.${process.env.APP_DOMAIN || 'pages.yourdomain.com'}`;
      liveUrl = `https://${page.domain}`;
    } else {
      // Default: slug-based path on the platform
      liveUrl = `${baseAppUrl}/p/${page.slug}`;
    }

    page.status = 'published';
    page.publishedAt = Date.now();
    page.updatedAt = Date.now();

    // Generate a unique API token for plugin verification if it doesn't have one
    if (!page.apiToken) {
      page.apiToken = crypto.randomBytes(32).toString('hex');
    }

    await page.save({ validateBeforeSave: false });

    // Trigger background routing & SSL job if a domain is attached
    if (page.domain) {
      PublishService.triggerPublishJob(page.domain, page.slug);
      
      // Also flush remote WP cache if apiToken exists
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

    // Trigger remote flush if domain is attached
    if (page.domain && page.apiToken) {
      SyncService.flushWordPressCache(page.domain, page.apiToken);
    }

    return res.status(200).json({ status: 'success', message: 'Page unpublished', data: { page } });
  } catch (err) {
    next(err);
  }
};

// ─── POST /pages/:id/leads ────────────────────────────────────────────────────
// Public endpoint — no auth required (visitors submit from live pages)
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

    // Fire webhook natively asynchronously if configured
    if (page.settings?.webhookUrl) {
      setImmediate(async () => {
        try {
          await fetch(page.settings.webhookUrl, {
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
        } catch (err) {
          // Swallow error silently for webhook delivery
        }
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
      { _id: req.params.id, userId: req.user._id },
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
      { _id: req.params.id, userId: req.user._id },
      { leads: 1, title: 1, slug: 1 }
    );

    if (!page) {
      return res.status(404).json({ status: 'fail', message: 'Page not found' });
    }

    // Generate CSV string
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
