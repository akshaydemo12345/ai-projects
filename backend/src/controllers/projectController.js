const Project = require('../models/Project');
const Page = require('../models/Page');
const crypto = require('crypto');
const { normalizeDomain } = require('../utils/validation');

// CREATE PROJECT
exports.createProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    // Generate unique API Token if not provided
    const apiToken = req.body.apiToken || 'PC-' + crypto.randomBytes(8).toString('hex').toUpperCase();
    // Build initial project payload
    const projectPayload = {
      name,
      description,
      userId: req.user._id,
      apiToken,
      logoUrl: req.body.logoUrl,
      services: req.body.services || [],
      keywords: req.body.keywords || [],
      industry: req.body.category || req.body.industry,
      primaryColor: req.body.primaryColor || req.body.themeColor,
      secondaryColor: req.body.secondaryColor,
      colors: req.body.colors || [],
      themeSystem: req.body.themeSystem || {},
      websiteUrl: req.body.websiteUrl || req.body.url,
      preSlug: req.body.preSlug,
      scrapedData: req.body.scrapedData || {},
    };

    // If a website URL is provided and no explicit branding supplied, attempt to auto-extract branding
    try {
      const websiteToInspect = projectPayload.websiteUrl;
      const userProvidedBranding = req.body.branding;
      if (websiteToInspect && !userProvidedBranding) {
        const { fetchAndExtractBranding } = require('../services/brandingService');
        const result = await fetchAndExtractBranding(websiteToInspect);
        if (result && result.success) {
          projectPayload.branding = result.data;
          projectPayload.branding = projectPayload.branding || {};
          projectPayload.branding.brandingSourceUrl = websiteToInspect;
          projectPayload.branding.lastScrapedAt = new Date();
          projectPayload.scrapedData = projectPayload.scrapedData || {};
          projectPayload.scrapedData.branding = result.data.extractedColors || result.data.extractedColors || [];
        }
      }
    } catch (err) {
      // Non-fatal: log and continue creating project with defaults
      console.error('Branding extraction during project create failed:', err.message);
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
    const page = parseInt(req.query.page, 1000) || 1;
    const limit = parseInt(req.query.limit, 1000) || 1000;
    const skip = (page - 1) * limit;

    const projects = await Project.find({ userId: req.user._id })
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await Project.countDocuments({ userId: req.user._id });

    res.status(200).json({
      status: 'success',
      results: projects.length,
      total,
      page,
      data: { projects },
    });
  } catch (err) {
    next(err);
  }
};

// GET PROJECT
exports.getProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!require('mongoose').Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: 'fail', message: 'Invalid Project ID' });
    }

    const project = await Project.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!project) {
      return res.status(404).json({ status: 'fail', message: 'Project not found' });
    }

    // Also fetch pages for this project to ensure frontend has them
    const pages = await Page.find({ projectId: id, isDeleted: { $ne: true } });

    let needsSave = false;

    // Ensure pageCount is accurate (sync it just in case)
    const pageCount = pages.length;
    const publishedPageCount = pages.filter(p => p.status === 'published').length;

    if (project.pageCount !== pageCount) {
      project.pageCount = pageCount;
      needsSave = true;
    }

    if (project.publishedPageCount !== publishedPageCount) {
      project.publishedPageCount = publishedPageCount;
      needsSave = true;
    }

    // Ensure leadCount is accurate (auto-heal desyncs from past deletions)
    const Lead = require('../models/Lead');
    const trueLeadCount = await Lead.countDocuments({ projectId: id, isDeleted: { $ne: true } });
    if (project.leadCount !== trueLeadCount) {
      project.leadCount = trueLeadCount;
      needsSave = true;
    }

    if (needsSave) {
      await project.save({ validateBeforeSave: false });
    }

    const FormSchema = require('../models/FormSchema');
    const cleanPages = await Promise.all(pages.map(async (p) => {
      const pObj = p.toObject();
      pObj.name = pObj.title;
      const count = await Lead.countDocuments({ pageId: p._id, isDeleted: { $ne: true } });
      pObj.leads = new Array(count).fill({}); // Fallback for frontend UI relying on leads.length
      pObj.leadCount = count;
      
      // Attach page-specific schema
      pObj.formSchema = await FormSchema.findOne({ page_id: p._id });
      
      return pObj;
    }));

    // Fetch the FormSchema associated with this project (using existing FormSchema model)
    const formSchema = await FormSchema.findOne({ project_id: id });

    res.status(200).json({
      status: 'success',
      data: {
        project: {
          ...project.toObject(),
          leadCount: trueLeadCount, // explicitly guarantee Top Level Metric
          pages: cleanPages,
          formSchema: formSchema // Attach the schema here
        }
      },
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

      const { name, description, logoUrl, industry, category, primaryColor, secondaryColor, websiteUrl, preSlug, fromName, fromEmail, adminNotification, userNotification, emailProvider, brevoKey } = req.body;
    const updateData = {
      name,
      description,
      logoUrl,
      industry: industry || category,
      primaryColor,
      secondaryColor,
      preSlug,
      fromName,
      fromEmail,
      adminNotification,
      userNotification,
      emailProvider,
      brevoKey,
      updatedAt: Date.now()
    };
    if (websiteUrl !== undefined) {
      updateData.websiteUrl = websiteUrl ? normalizeDomain(websiteUrl) : "";
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
    if (!require('mongoose').Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: 'fail', message: 'Invalid Project ID' });
    }

    const project = await Project.findOne({
      _id: id,
      userId: req.user._id,
    }).select('branding');

    if (!project) {
      return res.status(404).json({ status: 'fail', message: 'Project not found' });
    }

    res.status(200).json({
      status: 'success',
      data: { branding: project.branding },
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
