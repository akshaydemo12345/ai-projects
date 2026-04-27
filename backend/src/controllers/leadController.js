const Lead = require('../models/Lead');
const Page = require('../models/Page');
const Project = require('../models/Project');
const FormSchema = require('../models/FormSchema');
const { validateForm } = require('../utils/dynamicValidator');
const logger = require('../utils/logger');

/**
 * @desc    Create a new dynamic lead from a landing page form
 * @route   POST /api/leads
 * @access  Public
 */
exports.createLead = async (req, res) => {
  try {
    const rawBody = { ...req.body };
    console.log(`📥 [LEAD] Incoming submission for page '${rawBody.pageSlug || 'unknown'}':`, JSON.stringify(rawBody));
    
    // Extract metadata & identifying info (Everything else goes into .data)
    const { 
      pageSlug: reqSlug, 
      path: reqPath, 
      token, 
      projectId: reqProjectId, 
      pageId: reqPageId 
    } = rawBody;

    // 1. Identify the Page & Project
    let pageSlug = reqSlug || (reqPath ? reqPath.replace(/^\/+|\/+$/g, '').split('/')[0] : null);
    
    // Fallback: Extract slug from referer if completely missing
    if (!pageSlug && req.get('referer')) {
      try {
        const urlObj = new URL(req.get('referer'));
        pageSlug = urlObj.pathname.replace(/^\/+|\/+$/g, '').split('/')[0];
      } catch (e) {}
    }

    if (!pageSlug) {
      return res.status(400).json({ error: "Could not identify landing page source (missing slug/path)" });
    }

    const page = await Page.findOne({ slug: pageSlug });
    if (!page) {
      return res.status(404).json({ error: `Landing page with slug '${pageSlug}' not found` });
    }

    const projectId = page.projectId;
    const pageId = page._id;

    // 2. Fetch Schema & Prepare Data
    // We remove internal meta fields and UTMs from the actual form data object
    const { normalizeData } = require('../utils/dynamicValidator');
    const utmFields = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid', 'msclkid'];
    const internalFields = ['pageSlug', 'path', 'token', 'projectId', 'pageId', 'domain', 'url', 'timestamp', ...utmFields];
    
    // DEBUG LOG
    console.log('📥 [LEAD] Incoming Request Body Keys:', Object.keys(rawBody));
    
    const rawData = {};
    const utmDetails = {};
    
    // DEBUG LOG: See EXACTLY what is arriving
    console.log('📥 [LEAD] Full Incoming Body:', JSON.stringify(rawBody, null, 2));
    
    Object.keys(rawBody).forEach(key => {
      if (utmFields.includes(key)) {
        utmDetails[key] = rawBody[key];
        rawData[key] = rawBody[key]; // ALSO keep in rawData for UI visibility
      } else if (!internalFields.includes(key)) {
        rawData[key] = rawBody[key];
      }
    });

    if (Object.keys(utmDetails).length > 0) {
      console.log('✅ [LEAD] UTM Details Found:', utmDetails);
    } else {
      console.log('⚠️ [LEAD] No UTM Details found in request body.');
    }

    let schema = await FormSchema.findOne({ page_id: pageId });
    if (!schema) {
      schema = await FormSchema.findOne({ project_id: projectId });
    }
    
    // 3. Normalize & Validate
    let leadData = rawData;
    if (schema && schema.fields) {
      leadData = normalizeData(schema.fields, rawData);
      const errors = validateForm(schema.fields, rawData);
      if (errors.length > 0) {
        console.warn(`⚠️ Validation failed for lead:`, errors);
        return res.status(400).json({ 
          status: 'error', 
          message: 'Validation failed', 
          errors 
        });
      }
    }

    // 4. DUPLICATE PROTECTION (within 5 seconds)
    // We check the raw data string for a quick identity match
    const recentLead = await Lead.findOne({
      projectId,
      pageSlug,
      createdAt: { $gt: new Date(Date.now() - 5000) }
    }).sort({ createdAt: -1 });

    if (recentLead && JSON.stringify(recentLead.data) === JSON.stringify(leadData)) {
      return res.status(200).json({
        status: 'success',
        message: 'Duplicate lead detected, ignoring.',
        duplicate: true
      });
    }

    // 5. Create Dynamic Lead
    const lead = await Lead.create({
      projectId,
      pageId,
      pageSlug,
      data: leadData,
      utm: utmDetails, // Top-level database field
      meta: {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        referer: req.get('referer'),
        domain: rawBody.domain || req.get('origin'),
        url: rawBody.url || req.get('referer')
      }
    });

    // 6. Update Project leadCount (background increment for speed)
    Project.findByIdAndUpdate(projectId, { $inc: { leadCount: 1 } }).catch(err => {
      logger.error(`Failed to increment leadCount for project ${projectId}:`, err);
    });

    res.status(201).json({
      status: 'success',
      message: 'Lead captured successfully',
      data: { 
        leadId: lead._id,
        debug_utm: utmDetails
      }
    });

  } catch (error) {
    logger.error('❌ Lead Capture Failed:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * @desc    Get all leads for a project
 * @route   GET /api/leads
 * @access  Private
 */
exports.getLeads = async (req, res) => {
  try {
    const filter = {};
    if (req.query.projectId) filter.projectId = req.query.projectId;
    if (req.query.pageSlug) filter.pageSlug = req.query.pageSlug;

    const leads = await Lead.find(filter)
      .sort({ createdAt: -1 })
      .populate('pageId', 'title slug');

    // Include FormSchema if projectId available to help frontend show labels
    let formSchema = null;
    if (req.query.projectId || req.query.pageId) {
      const targetProjectId = req.query.projectId;
      
      if (req.query.pageId) {
         formSchema = await FormSchema.findOne({ page_id: req.query.pageId });
      } else if (targetProjectId) {
         formSchema = await FormSchema.findOne({ project_id: targetProjectId });
      }
    }

    res.status(200).json({ 
      status: 'success', 
      results: leads.length, 
      data: { 
        leads,
        formSchema // Attach the schema to help with table headings/labels
      } 
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * @desc    Delete a lead
 * @route   DELETE /api/leads/:id
 * @access  Private
 */
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });

    // Update Project leadCount (decrement)
    Project.findByIdAndUpdate(lead.projectId, { $inc: { leadCount: -1 } }).catch(err => {
      logger.error(`Failed to decrement leadCount for project ${lead.projectId}:`, err);
    });

    res.status(200).json({ status: 'success', message: 'Lead deleted' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// ... keep helper functions like getTrackerJs if they exist below ...
exports.getTrackerJs = (req, res) => {
  const fs = require('fs');
  const path = require('path');
  const trackerPath = path.join(__dirname, '../../public/tracker.js');
  
  if (fs.existsSync(trackerPath)) {
    res.setHeader('Content-Type', 'application/javascript');
    return res.sendFile(trackerPath);
  }
  res.status(404).send('Tracker script not found');
};
