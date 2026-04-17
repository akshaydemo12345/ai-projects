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

const AppError = require('../utils/AppError');

// ─── Validation Schemas ────────────────────────────────────────────────────────
const createPageSchema = z.object({
  title: z.string().optional(),
  name: z.string().optional(),
  slug: z.string().optional(),
  prefix: z.string().optional(),
  template: z.string().optional(),
  content: z.any().optional(),
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
      success: true,
      message: 'Page retrieved successfully',
      data: { 
        page: { 
          ...page.toObject(), 
          name: page.title,
          previewUrl 
        } 
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
      generationMethod: req.body.generationMethod || 'ai',
      status: 'generating',
      previewToken: crypto.randomBytes(16).toString('hex'),
    });

    // Increment pageCount
    await Project.findByIdAndUpdate(projectId, { $inc: { pageCount: 1 } });


    // 7. AI Content Generation (Allows templates to be filled by AI if a prompt exists)
    let aiResponse = { sections: [], seo: {} };
    const isTemplateWithPrompt = page.generationMethod === 'template' && (camelAiPrompt || ai_prompt);
    
    if (page.generationMethod === 'ai' || isTemplateWithPrompt) {
      try {
        logger.info(`Starting AI generation for ${isTemplateWithPrompt ? 'template enrichment' : 'full page'} ${page._id}`);
      
      // If it's a template, we pass a hint to the AI service
      const aiInput = {
        businessName: business_name || title,
        industry: page.industry || 'Service',
        businessDescription: businessDescription || business_description || project.description || '',
        targetAudience: targetAudience || 'General',
        ctaText: ctaText || 'Get Started',
        aiPrompt: camelAiPrompt || ai_prompt || '',
        primaryColor: page.primaryColor,
        secondaryColor: page.secondaryColor,
        logoUrl: page.logoUrl || '',
        services: page.services || [],
        keywords: keywords || [],
        noIndex: page.noIndex || false,
        noFollow: page.noFollow || false,
        pageId: page._id,
        // Pass the template HTML to the AI if it's a template enrichment task
        templateHtml: isTemplateWithPrompt ? page.content : null,
        // Pass figma image if available
        figmaImage: figmaImage || null,
        // Pass scraped data from project (contains images/videos from website)
        scrapedData: project.scrapedData || {}
      };

      const generated = await AIService.generateLandingPageContent(aiInput);

      if (generated) {
        aiResponse = {
          sections: generated.pageContent || [],
          fullHtml: generated.fullHtml,
          fullCss: generated.fullCss,
          fullJs: generated.fullJs,
          seo: generated.seo || {}
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

    const baseAppUrl = process.env.APP_BASE_URL || 'http://localhost:5000';
    const previewUrl = `${baseAppUrl}/preview/${page.slug}`;

    // 8. Update Page with AI Results
    if (aiResponse.fullHtml) {
      let processedHtml = aiResponse.fullHtml;
      
      // Add SEO meta tags if needed
      if (page.noIndex || page.noFollow) {
        const robots = [page.noIndex ? 'noindex' : '', page.noFollow ? 'nofollow' : ''].filter(Boolean).join(',');
        const seoMeta = `<meta name="robots" content="${robots}">`;
        
        // Insert after <head> or before </head>
        if (processedHtml.includes('<head>')) {
          processedHtml = processedHtml.replace('<head>', `<head>${seoMeta}`);
        } else if (processedHtml.includes('</head>')) {
          processedHtml = processedHtml.replace('</head>', `${seoMeta}</head>`);
        } else {
          // Fallback: add at the beginning
          processedHtml = `<head>${seoMeta}</head>` + processedHtml;
        }
      }
      
      page.content = processedHtml;
      // Prepend branding variables to styles for editor consistency
      const brandingStyles = `
:root {
  --primary: ${page.primaryColor};
  --secondary: ${page.secondaryColor};
  --accent: ${page.secondaryColor};
  --button-gradient: linear-gradient(135deg, ${page.primaryColor}, ${page.secondaryColor});
}
`;
      page.styles = brandingStyles + (aiResponse.fullCss || '');
    } else {
      page.content = initialContent || page.content;
      page.styles = initialStyles || page.styles || '';
    }
    
    page.seo = aiResponse.seo || {};
    
    // If we have a generic title, try to use the AI-generated one
    if ((page.title === 'Untitled Page' || page.title === 'AI Generated Page') && page.seo.title) {
      page.title = page.seo.title.split('|')[0].trim();
    }
    
    page.previewUrl = previewUrl;
    page.status = 'draft';
    await page.save();

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

    // Decrement pageCount
    await Project.findByIdAndUpdate(page.projectId, { $inc: { pageCount: -1 } });


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

    const baseAppUrl = process.env.APP_BASE_URL || 'https://app.yourdomain.com';
    let liveUrl;

    if (parsed.data.domain) {
      page.domain = parsed.data.domain;
      liveUrl = `https://${parsed.data.domain}`;
    } else if (parsed.data.subdomain) {
      page.domain = `${parsed.data.subdomain}.${process.env.APP_DOMAIN || 'pages.yourdomain.com'}`;
      liveUrl = `https://${page.domain}`;
    } else {
      liveUrl = `${baseAppUrl}/${page.slug}`;
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
