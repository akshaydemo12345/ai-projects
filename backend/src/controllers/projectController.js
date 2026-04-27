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

    const project = await Project.create({
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
    });

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

    const { name, description, logoUrl, industry, primaryColor, secondaryColor, websiteUrl, preSlug } = req.body;
    const updateData = { name, description, logoUrl, industry, primaryColor, secondaryColor, preSlug, updatedAt: Date.now() };

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
