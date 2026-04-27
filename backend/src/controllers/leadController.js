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
    
    console.log('📥 [LEAD_CAPTURE] New Submission Arrived!');
    console.log('📦 [LEAD_CAPTURE] Body Type:', typeof req.body);
    console.log('📝 [LEAD_CAPTURE] Raw Body Content:', JSON.stringify(rawBody, null, 2));
    
    // Extract metadata & identifying info (Everything else goes into .data)
    const { 
      pageSlug: reqSlug, 
      path: reqPath, 
      token, 
      projectId: reqProjectId, 
      pageId: reqPageId 
    } = rawBody;

    // 1. Identify the Page
    let targetPage = null;

    // A. By Page ID (Most Reliable)
    if (reqPageId && reqPageId.match(/^[0-9a-fA-F]{24}$/)) {
      targetPage = await Page.findById(reqPageId);
    }

    // B. By Slug (if ID fails or missing)
    if (!targetPage) {
      // Handle slugs with prefixes (e.g., "lp/my-page")
      let slugToSearch = reqSlug || (reqPath ? reqPath.replace(/^\/+|\/+$/g, '') : null);
      
      // Fallback: referer
      if (!slugToSearch && req.get('referer')) {
        try {
          const urlObj = new URL(req.get('referer'));
          slugToSearch = urlObj.pathname.replace(/^\/+|\/+$/g, '').replace(/\/thank-you$/i, '');
        } catch (e) {}
      }

      if (slugToSearch) {
        const slugParts = slugToSearch.split('/');
        const actualSlug = slugParts[slugParts.length - 1]; // Take the last part

        const query = { slug: actualSlug, isDeleted: { $ne: true } };
        if (reqProjectId && reqProjectId.match(/^[0-9a-fA-F]{24}$/)) {
          query.projectId = reqProjectId;
        }
        
        targetPage = await Page.findOne(query);
        
        // Final fallback: just the slug if project ID check failed
        if (!targetPage) {
          targetPage = await Page.findOne({ slug: actualSlug, isDeleted: { $ne: true } });
        }
      }
    }

    if (!targetPage) {
      const failedSlug = reqSlug || "unknown";
      return res.status(404).json({ error: `Landing page with slug '${failedSlug}' not found` });
    }

    const page = targetPage;
    const pageSlug = page.slug;

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
    
    console.log('📥 [LEAD] Filtering internal fields. Internal list:', internalFields);
    
    Object.keys(rawBody).forEach(key => {
      if (utmFields.includes(key)) {
        utmDetails[key] = rawBody[key];
        rawData[key] = rawBody[key];
      } else if (!internalFields.includes(key)) {
        rawData[key] = rawBody[key];
      } else {
        console.log(`🧹 [LEAD] Skipping internal field: ${key}`);
      }
    });

    console.log('✅ [LEAD] Extracted rawData:', JSON.stringify(rawData));
    
    if (Object.keys(rawData).length === 0) {
      console.warn('⚠️ [LEAD] rawData is EMPTY! Check if form field names are in the internal fields list.');
    }

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
    console.log('🔍 [LEADS] GetLeads Query Params:', req.query);
    
    if (req.query.projectId) filter.projectId = req.query.projectId;
    if (req.query.pageId) filter.pageId = req.query.pageId; // Allow filtering by pageId too
    if (req.query.pageSlug) filter.pageSlug = req.query.pageSlug;
    
    console.log('🔍 [LEADS] DB Filter:', JSON.stringify(filter));

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
