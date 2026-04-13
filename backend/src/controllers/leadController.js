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
    const { name, email, phone, message, pageSlug, pageId, projectId } = req.body;

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
      pageId,
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
exports.getLeads = async (req, res, next) => {
  try {
    const { projectId, pageSlug, pageId } = req.query;
    
    // Security check: Find all projects belonging to this user
    const userProjects = await Project.find({ userId: req.user._id }).select('_id');
    const userProjectIds = userProjects.map(p => p._id);
    console.log(`🔒 User ${req.user.email} owns projects: ${userProjectIds.join(', ')}`);

    // Build the query starting with user's project restriction and soft delete check
    const query = { 
      projectId: { $in: userProjectIds },
      isDeleted: { $ne: true }
    };
    
    // Apply optional sub-filters
    if (projectId) {
      // Ensure the requested projectId is actually owned by the user
      if (!userProjectIds.map(id => id.toString()).includes(projectId)) {
        return res.status(200).json({ status: 'success', results: 0, data: { leads: [] } });
      }
      query.projectId = projectId;
    }
    
    if (pageId && require('mongoose').Types.ObjectId.isValid(pageId)) {
      const page = await Page.findById(pageId);
      if (page) {
        console.log(`🔍 Filtering by page slug: ${page.slug} or ID: ${pageId}`);
        query.$or = [
          { pageId: pageId },
          { pageSlug: page.slug }
        ];
      } else {
        query.pageId = pageId;
      }
    } else if (pageSlug) {
      query.pageSlug = pageSlug;
    }

    console.log('📋 Lead Query:', JSON.stringify(query));
    const leads = await Lead.find(query).sort('-createdAt');
    console.log(`✅ Leads found: ${leads.length}`);

    return res.status(200).json({
      status: 'success',
      results: leads.length,
      data: { leads }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a lead (Soft Delete)
 * @route   DELETE /api/leads/:id
 * @access  Private
 */
exports.deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ status: 'error', message: 'Lead not found' });

    // Security check: Verify project ownership
    const project = await Project.findOne({ _id: lead.projectId, userId: req.user._id });
    if (!project) {
      return res.status(403).json({ status: 'error', message: 'Not authorized to delete this lead' });
    }

    // Soft delete
    lead.isDeleted = true;
    await lead.save();

    return res.status(200).json({
      status: 'success',
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
