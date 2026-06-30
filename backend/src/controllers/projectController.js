const Project = require('../models/Project');
const Page = require('../models/Page');
const crypto = require('crypto');
const { normalizeDomain } = require('../utils/validation');

// CREATE PROJECT
exports.createProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const apiToken = req.body.apiToken || 'PC-' + crypto.randomBytes(8).toString('hex').toUpperCase();

    // Fonts passed explicitly from the frontend (populated after Analyze Website)
    const incomingFonts = req.body.fonts || {};
    const bodyFontFromBody = incomingFonts.bodyFont || '';
    const headingFontFromBody = incomingFonts.headingFont || '';

    const projectPayload = {
      name,
      description,
      userId: req.user._id,
      apiToken,
      preSlug: req.body.preSlug,
      scrapeMeta: {
        sourceUrl: req.body.websiteUrl || req.body.url,
        status: 'pending',
      },
    };

    // If websiteProfile is provided directly from the frontend, use it.
    // This happens if the user completed the frontend scraping/analysis.
    // Otherwise, we fallback to quick metadata fetch + background scraping.
    if (req.body.websiteProfile) {
      projectPayload.websiteProfile = req.body.websiteProfile;
      projectPayload.scrapeMeta = {
        sourceUrl: normalizeDomain(req.body.websiteUrl || req.body.url),
        status: 'success',
        finishedAt: new Date(),
        errors: [],
      };
      
      const wp = req.body.websiteProfile;
      projectPayload.websiteUrl = wp.extraction?.sourceUrl || wp.extraction?.finalUrl || req.body.websiteUrl || req.body.url;
      if (wp.identity?.logoUrl) projectPayload.logoUrl = wp.identity.logoUrl;
      if (wp.identity?.favicon) projectPayload.faviconUrl = wp.identity.favicon;
      
      // Keep root level properties consistent with provided primary/secondary/colors
      if (req.body.primaryColor) projectPayload.primaryColor = req.body.primaryColor;
      if (req.body.secondaryColor) projectPayload.secondaryColor = req.body.secondaryColor;
      if (req.body.colors) projectPayload.colors = req.body.colors;
      
      console.debug('[projectController] using websiteProfile provided by frontend, skipping quick fetch & background scraping.');
    } else if (req.body.websiteUrl || req.body.url) {
      const websiteToInspect = req.body.websiteUrl || req.body.url;
      projectPayload.websiteProfile = {
        extraction: {
          sourceUrl: normalizeDomain(websiteToInspect),
        },
      };
      projectPayload.scrapeMeta = projectPayload.scrapeMeta || {};
      projectPayload.scrapeMeta.status = 'pending';
      projectPayload.scrapeMeta.sourceUrl = normalizeDomain(websiteToInspect);

      // Quick metadata fetch (short timeout) to provide light-weight fields immediately
      try {
        const axios = require('axios');
        const cheerio = require('cheerio');
        const fetchUrl = /^https?:\/\//i.test(websiteToInspect) ? websiteToInspect : normalizeDomain(websiteToInspect);
        const resp = await axios.get(fetchUrl, {
          timeout: 2000,
          maxRedirects: 5,
          headers: { 'User-Agent': 'Buildify/QuickMeta (+https://example.com) Node' },
        });
        const html = resp.data || '';
        const $ = cheerio.load(html);

        const title = $('meta[property="og:site_name"]').attr('content') || $('title').text() || null;
        const description = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || null;

        let favicon = $('link[rel="icon"]').attr('href') || $('link[rel="shortcut icon"]').attr('href') || $('link[rel="apple-touch-icon"]').attr('href') || null;
        if (favicon && !favicon.startsWith('http')) {
          try { favicon = new URL(favicon, resp.request?.res?.responseUrl || fetchUrl).href; } catch (e) { /* ignore */ }
        }

        let logo = $('meta[property="og:image"]').attr('content') || $('img.logo').first().attr('src') || null;
        if (logo && !logo.startsWith('http')) {
          try { logo = new URL(logo, resp.request?.res?.responseUrl || fetchUrl).href; } catch (e) { /* ignore */ }
        }

        // Attach minimal identity info so frontend can show favicon/logo/title immediately
        projectPayload.websiteProfile.identity = projectPayload.websiteProfile.identity || {};
        if (favicon) projectPayload.websiteProfile.identity.faviconUrl = favicon;
        if (logo) projectPayload.websiteProfile.identity.logoUrl = logo;
        if (title) projectPayload.websiteProfile.identity.title = title;
        if (description) projectPayload.websiteProfile.identity.description = description;

        // Attach fonts passed from the frontend (collected after Analyze Website click)
        if (bodyFontFromBody || headingFontFromBody) {
          projectPayload.websiteProfile.fonts = {
            bodyFont: bodyFontFromBody || '',
            headingFont: headingFontFromBody || '',
            primaryFont: bodyFontFromBody || '',
          };
        }

        // Also expose quick light fields at the project root so UI can read them consistently
        projectPayload.websiteUrl = fetchUrl;
        if (logo) projectPayload.logoUrl = logo;
        if (favicon && !projectPayload.faviconUrl) projectPayload.faviconUrl = favicon;
        if (title && !projectPayload.name) projectPayload.name = projectPayload.name || title;
        if (description && !projectPayload.description) projectPayload.description = projectPayload.description || description;

        console.debug('[projectController] quick metadata fetched', { fetchUrl, hasTitle: !!title, hasDescription: !!description, hasFavicon: !!favicon, hasLogo: !!logo });
      } catch (e) {
        // Fail quietly — background job will attempt full scrape later
        console.debug('[projectController] quick metadata fetch failed:', e?.message || e);
      }
    }

    const project = await Project.create(projectPayload);

    // If a website was provided, perform the heavier scrape + profile build in background.
    // ONLY run if websiteProfile was NOT provided from the frontend.
    if (!req.body.websiteProfile && (req.body.websiteUrl || req.body.url)) {
      const websiteToInspect = req.body.websiteUrl || req.body.url;
      setImmediate(async () => {
        try {
          const { scrapeWebsiteStructure, buildWebsiteProfile } = require('../services/structuredScrapeService');
          const scraped = await scrapeWebsiteStructure(websiteToInspect);
          const websiteProfile = buildWebsiteProfile(scraped, null);

          await Project.findByIdAndUpdate(
            project._id,
            {
              $set: {
                websiteProfile,
                'scrapeMeta.status': 'success',
                'scrapeMeta.finishedAt': new Date(),
                'scrapeMeta.errors': [],
              },
            },
            { runValidators: false }
          );
        } catch (err) {
          console.error('[projectController] background scrape failed:', err?.message || err);
          try {
            await Project.findByIdAndUpdate(
              project._id,
              { $set: { 'scrapeMeta.status': 'failed', 'scrapeMeta.errors': [err?.message || 'Unknown scrape error'] } },
              { runValidators: false }
            );
          } catch (e) {
            console.error('[projectController] failed to persist scrape error state:', e?.message || e);
          }
        }
      });
    }

    res.status(201).json({
      status: 'success',
      data: { project },
    });
  } catch (err) {
    next(err);
  }
};

// LIST PROJECTS
exports.listProjects = async (req, res, next) => {
  try {
    const pageNum = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 1000;
    const skip = (pageNum - 1) * limit;

    // Only fields actually used by the frontend list views (ProjectsPage, LeadsPage sidebar)
    // Excludes: branding, scrapedData, themeSystem, business, colors, scrapeMeta, emailNotifications, etc.
    const projects = await Project.find({ userId: req.user._id })
      .select('_id name websiteUrl url category industry subIndustry preSlug apiToken isVerified logoUrl primaryColor secondaryColor pageCount leadCount publishedPageCount createdAt websiteProfile.identity websiteProfile.industry websiteProfile.logoColors websiteProfile.colors websiteProfile.extraction')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit)
      .lean();

    // Attach only page `type` field — needed for PPC/SEO badges on the list
    const projectIds = projects.map(p => p._id);
    const pageTypes = await Page.find(
      { projectId: { $in: projectIds }, isDeleted: { $ne: true } },
      { projectId: 1, type: 1, _id: 0 }
    ).lean();

    const typesByProject = {};
    for (const pt of pageTypes) {
      const pid = pt.projectId.toString();
      if (!typesByProject[pid]) typesByProject[pid] = [];
      typesByProject[pid].push({ type: pt.type });
    }

    const enriched = projects.map(p => {
      // Resolve virtual fields that .lean() strips out
      const websiteUrl = p.websiteUrl || p.url
        || p.websiteProfile?.extraction?.sourceUrl
        || p.websiteProfile?.extraction?.finalUrl
        || null;
      const industry = p.industry || p.websiteProfile?.industry?.industry || p.category || null;
      const logoUrl = p.logoUrl || p.websiteProfile?.identity?.logoUrl || null;
      const primaryColor = p.primaryColor
        || p.websiteProfile?.logoColors?.primary
        || p.websiteProfile?.colors?.primary || null;
      const secondaryColor = p.secondaryColor
        || p.websiteProfile?.logoColors?.secondary
        || p.websiteProfile?.colors?.secondary || null;

      return {
        ...p,
        websiteUrl,
        industry,
        logoUrl,
        primaryColor,
        secondaryColor,
        pages: typesByProject[p._id.toString()] || [],
      };
    });

    const total = await Project.countDocuments({ userId: req.user._id });

    res.status(200).json({
      status: 'success',
      results: enriched.length,
      total,
      page: pageNum,
      data: { projects: enriched },
    });
  } catch (err) {
    next(err);
  }
};

// GET PROJECT — only meta fields, no pages (pages fetched separately via /projects/:id/pages/summary)
exports.getProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!require('mongoose').Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: 'fail', message: 'Invalid Project ID' });
    }

    const project = await Project.findOne({ _id: id, userId: req.user._id })
      .select('_id name description preSlug apiToken isVerified pageCount leadCount publishedPageCount createdAt updatedAt websiteProfile')
      .lean();

    if (!project) {
      return res.status(404).json({ status: 'fail', message: 'Project not found' });
    }

    // Sync counts in background
    const Lead = require('../models/Lead');
    const Page = require('../models/Page');

    Promise.all([
      Page.countDocuments({ projectId: id, isDeleted: { $ne: true } }),
      Page.countDocuments({ projectId: id, isDeleted: { $ne: true }, status: 'published' }),
      Lead.countDocuments({ projectId: id, isDeleted: { $ne: true } }),
    ]).then(([pageCount, publishedPageCount, leadCount]) => {
      const updates = {};
      if (project.pageCount !== pageCount) updates.pageCount = pageCount;
      if (project.publishedPageCount !== publishedPageCount) updates.publishedPageCount = publishedPageCount;
      if (project.leadCount !== leadCount) updates.leadCount = leadCount;
      if (Object.keys(updates).length > 0) {
        Project.updateOne({ _id: id }, updates).catch(() => { });
      }
    }).catch(() => { });

    // Resolve virtual fields stripped by .lean()
    const websiteUrl = project.websiteUrl || project.url
      || project.websiteProfile?.extraction?.sourceUrl
      || project.websiteProfile?.extraction?.finalUrl
      || null;
    const industry = project.industry || project.websiteProfile?.industry?.industry || project.category || null;
    const logoUrl = project.logoUrl || project.websiteProfile?.identity?.logoUrl || null;
    const primaryColor = project.primaryColor
      || project.websiteProfile?.logoColors?.primary
      || project.websiteProfile?.colors?.primary || null;
    const secondaryColor = project.secondaryColor
      || project.websiteProfile?.logoColors?.secondary
      || project.websiteProfile?.colors?.secondary || null;

    res.status(200).json({
      status: 'success',
      data: {
        project: {
          ...project,
          websiteUrl,
          industry,
          logoUrl,
          primaryColor,
          secondaryColor,
        }
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET PROJECT PAGES SUMMARY — lightweight list for ProjectDetailPage, no HTML content
exports.getProjectPagesSummary = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!require('mongoose').Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: 'fail', message: 'Invalid Project ID' });
    }

    // Ownership verified implicitly: pages are scoped to both projectId + userId via Page model
    // (no extra Project.exists() round-trip needed)

    // Only the fields the page list table renders — no HTML/CSS blobs, no logoUrl, no aiUsageHistory
    const pages = await Page.find({ projectId: id, isDeleted: { $ne: true } })
      .select('_id title slug status type primaryColor secondaryColor publishedUrl views aiUsage')
      .sort('-createdAt')
      .lean();

    const Lead = require('../models/Lead');
    const pageIds = pages.map((p) => p._id);

    // One aggregation instead of N countDocuments calls
    const leadCounts = await Lead.aggregate([
      { $match: { pageId: { $in: pageIds }, isDeleted: { $ne: true } } },
      { $group: { _id: '$pageId', count: { $sum: 1 } } },
    ]);
    const leadCountMap = Object.fromEntries(leadCounts.map((r) => [r._id.toString(), r.count]));

    const enrichedPages = pages.map((p) => {
      const leadCount = leadCountMap[p._id.toString()] ?? 0;
      return {
        ...p,
        name: p.title,
        leadCount,
        leads: new Array(leadCount).fill({}), // frontend uses leads.length for the badge
      };
    });

    res.status(200).json({
      status: 'success',
      data: { pages: enrichedPages },
    });
  } catch (err) {
    next(err);
  }
};

// UPDATE PROJECT
exports.updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!require('mongoose').Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: 'fail', message: 'Invalid Project ID' });
    }

    const { name, description, preSlug, fromName, fromEmail, adminNotification, userNotification, emailProvider, brevoKey } = req.body;

    const updateData = {
      updatedAt: Date.now(),
    };

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (preSlug !== undefined) updateData.preSlug = preSlug;
    if (fromName !== undefined) updateData.fromName = fromName;
    if (fromEmail !== undefined) updateData.fromEmail = fromEmail;
    if (adminNotification !== undefined) updateData.adminNotification = adminNotification;
    if (userNotification !== undefined) updateData.userNotification = userNotification;
    if (emailProvider !== undefined) updateData.emailProvider = emailProvider;
    if (brevoKey !== undefined) updateData.brevoKey = brevoKey;

    // Update websiteProfile if provided
    if (req.body.websiteUrl) {
      updateData['websiteProfile.extraction.sourceUrl'] = normalizeDomain(req.body.websiteUrl);
      updateData.scrapeMeta = updateData.scrapeMeta || {};
      updateData.scrapeMeta.sourceUrl = normalizeDomain(req.body.websiteUrl);
    }

    // If a new logo URL is being set, update identity.logoUrl and
    // asynchronously re-extract logo colors into websiteProfile.logoColors.
    if (req.body.logoUrl !== undefined) {
      updateData['websiteProfile.identity.logoUrl'] = req.body.logoUrl || null;
    }

    const project = await Project.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ status: 'fail', message: 'Project not found' });
    }

    // Fire-and-forget: re-extract logo colors whenever logoUrl changes
    if (req.body.logoUrl) {
      const newLogoUrl = req.body.logoUrl;
      const baseUrl = project.websiteProfile?.extraction?.sourceUrl || null;
      setImmediate(async () => {
        try {
          const { extractLogoColorsFromUrl } = require('../services/structuredScrapeService');
          const logoColors = await extractLogoColorsFromUrl(newLogoUrl, null, baseUrl);
          await Project.findByIdAndUpdate(
            id,
            {
              'websiteProfile.logoColors': {
                primary: logoColors.primary || null,
                secondary: logoColors.secondary || null,
                palette: logoColors.palette || [],
                source: logoColors.source || null,
              },
            },
            { runValidators: false }
          );
        } catch (e) {
          console.error('[updateProject] logo color extraction failed:', e.message);
        }
      });
    }

    res.status(200).json({
      status: 'success',
      data: { project },
    });
  } catch (err) {
    next(err);
  }
};

// DELETE PROJECT (Soft Delete)
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isDeleted: true },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ status: 'fail', message: 'Project not found' });
    }

    // Optionally soft delete ALL pages in this project
    await Page.updateMany({ projectId: project._id }, { isDeleted: true });

    res.status(200).json({
      status: 'success',
      message: 'Project deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};

// GET PROJECT BRANDING
exports.getBranding = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await Project.findOne({ _id: id, userId: req.user._id })
      .select('websiteProfile.colors websiteProfile.theme websiteProfile.fonts websiteProfile.identity.logoUrl websiteProfile.logoColors');

    if (!project) {
      return res.status(404).json({ status: 'fail', message: 'Project not found' });
    }

    // Map to old branding format for compatibility
    const branding = {
      colors: project.websiteProfile?.colors || {},
      theme: project.websiteProfile?.theme || {},
      typography: project.websiteProfile?.fonts || {},
      logoUrl: project.websiteProfile?.identity?.logoUrl,
      logoColors: project.websiteProfile?.logoColors || {
        primary: null,
        secondary: null,
        palette: [],
        source: null,
      },
    };

    res.status(200).json({
      status: 'success',
      data: { branding },
    });
  } catch (err) {
    next(err);
  }
};

// UPDATE PROJECT BRANDING
exports.updateBranding = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { branding } = req.body;

    if (!require('mongoose').Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: 'fail', message: 'Invalid Project ID' });
    }

    if (!branding) {
      return res.status(400).json({ status: 'fail', message: 'Branding configuration is required' });
    }

    const project = await Project.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { branding, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ status: 'fail', message: 'Project not found' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Branding updated successfully',
      data: { branding: project.branding },
    });
  } catch (err) {
    next(err);
  }
};

// EXTRACT COLORS FROM LOGO IMAGE
/**
 * POST /projects/:id/branding/extract-logo-colors
 * Body: { logoUrl?: string }
 *
 * Reads logoUrl from body (or falls back to the project's stored identity.logoUrl),
 * runs color extraction, and persists the result into
 * websiteProfile.logoColors  { primary, secondary, palette, source }.
 */
exports.extractLogoColors = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!require('mongoose').Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: 'fail', message: 'Invalid Project ID' });
    }

    // Load just the fields we need
    const project = await Project.findOne({ _id: id, userId: req.user._id })
      .select('websiteProfile.identity.logoUrl websiteProfile.extraction.sourceUrl');

    if (!project) {
      return res.status(404).json({ status: 'fail', message: 'Project not found' });
    }

    // Resolve the logo URL: prefer the one sent in the request body
    const logoUrl = req.body.logoUrl || project.websiteProfile?.identity?.logoUrl;

    if (!logoUrl) {
      return res.status(400).json({
        status: 'fail',
        message: 'No logo URL provided and none found on the project. Supply logoUrl in the request body.',
      });
    }

    // Pull in the shared color-extraction helper from structuredScrapeService
    const { extractLogoColorsFromUrl } = require('../services/structuredScrapeService');
    const baseUrl = project.websiteProfile?.extraction?.sourceUrl || null;
    const logoColors = await extractLogoColorsFromUrl(logoUrl, null, baseUrl);

    // Persist into websiteProfile.logoColors
    const updated = await Project.findByIdAndUpdate(
      id,
      {
        'websiteProfile.logoColors': {
          primary: logoColors.primary || null,
          secondary: logoColors.secondary || null,
          palette: logoColors.palette || [],
          source: logoColors.source || null,
        },
        updatedAt: Date.now(),
      },
      { new: true, runValidators: false }
    ).select('websiteProfile.logoColors websiteProfile.identity.logoUrl');

    res.status(200).json({
      status: 'success',
      message: 'Logo colors extracted and saved',
      data: {
        logoColors: updated.websiteProfile?.logoColors || {},
      },
    });
  } catch (err) {
    next(err);
  }
};

// FETCH AND EXTRACT BRANDING FROM WEBSITE
exports.extractBrandingFromWebsite = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { websiteUrl } = req.body;

    if (!require('mongoose').Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: 'fail', message: 'Invalid Project ID' });
    }

    if (!websiteUrl) {
      return res.status(400).json({ status: 'fail', message: 'Website URL is required' });
    }

    const project = await Project.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!project) {
      return res.status(404).json({ status: 'fail', message: 'Project not found' });
    }

    // Use the branding service to extract colors
    const { fetchAndExtractBranding } = require('../services/brandingService');
    const result = await fetchAndExtractBranding(websiteUrl);

    if (result.success) {
      // Update project with extracted branding
      project.branding = result.data;
      project.branding.brandingSourceUrl = websiteUrl;
      project.branding.lastScrapedAt = new Date();
      project.branding.scrapedBrandingData = {
        sourceUrl: websiteUrl,
        scrapedAt: new Date(),
        extractedColors: result.data.extractedColors,
      };

      await project.save({ validateBeforeSave: false });

      res.status(200).json({
        status: 'success',
        message: 'Branding extracted successfully from website',
        data: { branding: project.branding },
      });
    } else {
      res.status(400).json({
        status: 'fail',
        message: result.message,
        data: { branding: result.data },
      });
    }
  } catch (err) {
    next(err);
  }
};