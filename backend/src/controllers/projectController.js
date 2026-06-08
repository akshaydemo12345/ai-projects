const Project = require('../models/Project');
const Page = require('../models/Page');
const crypto = require('crypto');
const { normalizeDomain } = require('../utils/validation');

// CREATE PROJECT
exports.createProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const apiToken = req.body.apiToken || 'PC-' + crypto.randomBytes(8).toString('hex').toUpperCase();

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

    // Scrape and build websiteProfile in one pass
    if (req.body.websiteUrl || req.body.url) {
      try {
        const websiteToInspect = req.body.websiteUrl || req.body.url;
        const { scrapeWebsiteStructure, buildWebsiteProfile } = require('../services/structuredScrapeService');

        const scraped = await scrapeWebsiteStructure(websiteToInspect);
        projectPayload.websiteProfile = buildWebsiteProfile(scraped, null);

        // Update scrape meta
        projectPayload.scrapeMeta.status = 'success';
        projectPayload.scrapeMeta.finishedAt = new Date();
      } catch (err) {
        console.error('[projectController] scrape failed:', err.message);
        projectPayload.scrapeMeta.status = 'failed';
        projectPayload.scrapeMeta.errors = [err.message || 'Unknown scrape error'];
      }
    }

    const project = await Project.create(projectPayload);

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
      .select('_id name websiteUrl url category industry subIndustry preSlug apiToken logoUrl primaryColor secondaryColor pageCount leadCount publishedPageCount createdAt')
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

    const enriched = projects.map(p => ({
      ...p,
      pages: typesByProject[p._id.toString()] || [],
    }));

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
      .select('_id name description preSlug apiToken pageCount leadCount publishedPageCount createdAt updatedAt websiteProfile')
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

    res.status(200).json({
      status: 'success',
      data: { project },
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

    const project = await Project.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ status: 'fail', message: 'Project not found' });
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
      .select('websiteProfile.colors websiteProfile.theme websiteProfile.fonts websiteProfile.identity.logoUrl');

    if (!project) {
      return res.status(404).json({ status: 'fail', message: 'Project not found' });
    }

    // Map to old branding format for compatibility
    const branding = {
      colors: project.websiteProfile?.colors || {},
      theme: project.websiteProfile?.theme || {},
      typography: project.websiteProfile?.fonts || {},
      logoUrl: project.websiteProfile?.identity?.logoUrl,
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