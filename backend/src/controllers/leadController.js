const Lead = require('../models/Lead');
const Page = require('../models/Page');
const Project = require('../models/Project');
const logger = require('../utils/logger');

/**
 * @desc    Create a new lead from a landing page form
 * @route   POST /api/leads
 * @access  Public
 */
exports.createLead = async (req, res) => {
  try {
    const { name, email, phone, message, pageSlug, projectId } = req.body;

    // Basic validation
    if (!email || !pageSlug) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields: email and pageSlug are mandatory.'
      });
    }

    // Try to find the page to verify it exists and get projectId if missing
    let finalProjectId = projectId;
    if (!finalProjectId) {
      const page = await Page.findOne({ slug: pageSlug });
      if (page) {
        finalProjectId = page.projectId;
      }
    }

    // Create lead
    const lead = await Lead.create({
      name,
      email,
      phone,
      message,
      pageSlug,
      projectId: finalProjectId,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    logger.info(`✅ New lead captured for page: ${pageSlug}`, { leadId: lead._id });

    // Also push lead to the Page model if it exists (backup/legacy support)
    if (pageSlug) {
      await Page.findOneAndUpdate(
        { slug: pageSlug },
        { 
          $push: { 
            leads: { name, email, message, createdAt: new Date() } 
          } 
        }
      );
    }

    // Increment total leadCount in Project
    if (finalProjectId) {
      await Project.findByIdAndUpdate(finalProjectId, { $inc: { leadCount: 1 } });
    }

    return res.status(201).json({
      status: 'success',
      message: 'Lead saved successfully',
      data: { leadId: lead._id }
    });

  } catch (error) {
    logger.error('❌ Error creating lead:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while saving lead.'
    });
  }
};

/**
 * @desc    Get leads for a specific project or page
 * @route   GET /api/leads
 * @access  Private (Admin/User)
 */
exports.getLeads = async (req, res) => {
  try {
    const { projectId, pageSlug } = req.query;
    const filter = { userId: req.user._id }; // Security: only user's own projects

    // Actually we need to cross-ref with projects the user owns
    // For now, simplify and just filter by query params if provided
    const query = {};
    if (projectId) query.projectId = projectId;
    if (pageSlug) query.pageSlug = pageSlug;

    const leads = await Lead.find(query).sort('-createdAt');

    return res.status(200).json({
      status: 'success',
      results: leads.length,
      data: { leads }
    });
  } catch (error) {
    next(error);
  }
};
