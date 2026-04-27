const Lead = require('../models/Lead');
const Page = require('../models/Page');
const Project = require('../models/Project');
const FormSchema = require('../models/FormSchema');
const { validateForm, normalizeData } = require('../utils/dynamicValidator');
const logger = require('../utils/logger');
const { syncFormSchema } = require('../utils/schemaSync');

/**
 * @desc    Create a new dynamic lead from a landing page form
 * @route   POST /api/leads
 * @access  Public
 */
exports.createLead = async (req, res) => {
  try {
    const rawData = { ...req.body };
    const { pageId, pageSlug, projectId } = rawData;

    logger.info(`[LEAD] New Submission: ${pageSlug} (${pageId})`);

    // 1. Fetch Dynamic Schema
    const schema = await FormSchema.findOne({
      $or: [
        { page_id: pageId },
        { project_id: projectId, page_slug: pageSlug },
        { page_slug: pageSlug }
      ].filter(obj => Object.values(obj)[0])
    }).lean();

    if (!schema || !schema.fields?.length) {
      logger.warn(`❌ [LEAD] No schema found for page: ${pageSlug || pageId}`);
      return res.status(400).json({ status: "fail", message: "Form schema not found" });
    }

    // 2. Helpers for Dynamic Matching
    const normalizeKey = (str = "") => String(str || "").toLowerCase().trim().replace(/[^a-z0-9]/g, "");
    const slugify = (str = "") => String(str || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");

    function getSmartFieldValue(field, body = {}) {
      const normalizedBody = {};
      Object.keys(body).forEach(key => { normalizedBody[normalizeKey(key)] = body[key]; });

      const label = (field.label || "").toLowerCase();
      const labelSlug = slugify(field.label);
      const labelWords = label.split(/\s+/).filter(w => w.length > 2);

      const candidates = [
        field.field_name,
        field.name,
        field.id,
        labelSlug,
        normalizeKey(field.label)
      ];
      
      // Add individual words from label as potential keys (e.g. "Full Name" -> "name")
      labelWords.forEach(w => candidates.push(w));

      // Intelligent fallback by Broad Types
      candidates.push(field.type); // Catch-all for anonymous fields named by type (e.g. "select": "Value")

      if (field.type === "email") candidates.push("email", "email_address", "mail");
      if (["tel", "phone", "mobile"].includes(field.type)) candidates.push("phone", "tel", "contact", "mobile", "whatsapp");
      if (["text", "textarea"].includes(field.type)) {
        if (label.includes("name")) candidates.push("name", "fullname", "firstname", "lname");
        if (label.includes("msg") || label.includes("message") || label.includes("comment") || label.includes("note")) {
          candidates.push("message", "msg", "comments", "notes", "description", "details");
        }
        if (label.includes("subject") || label.includes("title")) candidates.push("subject", "title", "topic");
      }
      if (field.type === "number") candidates.push("amount", "quantity", "count", "age", "price");
      if (field.type === "date" || field.type === "time") candidates.push("date", "time", "appointment", "schedule", "on_date");
      if (field.type === "select" || field.type === "radio") candidates.push("service", "category", "type", "option", "selection", "plan");
      if (field.type === "checkbox") candidates.push("agree", "accept", "consent", "newsletter", "terms");

      // Final unique candidates list
      const uniqueCandidates = [...new Set(candidates.filter(Boolean))];

      for (const key of uniqueCandidates) {
        const n = normalizeKey(key);
        if (normalizedBody[n] !== undefined && normalizedBody[n] !== null) {
          const val = normalizedBody[n];
          return (typeof val === 'string') ? val.trim() : val;
        }
      }
      return "";
    }

    // 3. Extract & Validate STRICTLY follow FormSchema
    const missingFields = [];
    const leadData = {};

    for (const field of schema.fields) {
      const value = getSmartFieldValue(field, rawData);

      if (field.required && !value) {
        missingFields.push(field.label || field.field_name);
      }

      /**
       * 🔥 STORAGE STRATEGY:
       * Use the most semantic key from schema to avoid generic 'field_N' in DB if possible.
       * 1. field.name (semantic slug like 'full_name')
       * 2. field.field_name (identifier like 'field_0')
       */
      const storageKey = field.name || field.field_name;
      if (value !== undefined) {
        leadData[storageKey] = value;
      }
    }

    if (missingFields.length > 0) {
      logger.warn(`⚠️ [LEAD] Required fields missing: ${missingFields.join(', ')}`);
      return res.status(400).json({ status: "fail", message: "Required fields missing", fields: missingFields });
    }

    // 4. UTMs & Meta
    const utm = {};
    const utmFields = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid', 'msclkid'];
    utmFields.forEach(k => { if (rawData[k]) utm[k] = rawData[k]; });

    // 5. Create Lead
    const lead = await Lead.create({
      projectId: schema.project_id,
      pageId: schema.page_id,
      pageSlug: pageSlug || schema.page_slug,
      data: leadData,
      utm,
      meta: {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        domain: rawData.domain || req.get('origin'),
        url: rawData.url || req.headers.referer
      }
    });

    Project.findByIdAndUpdate(schema.project_id, { $inc: { leadCount: 1 } }).catch(() => {});

    return res.status(201).json({
      status: "success",
      message: "Intelligence Captured",
      data: { leadId: lead._id }
    });

  } catch (error) {
    logger.error('❌ Lead Capture Failure:', error);
    return res.status(500).json({ status: "error", message: "Internal server failure" });
  }
};

/**
 * @desc    Get leads with smart dynamic data handling and filtering
 */
exports.getLeads = async (req, res) => {
  try {
    const { projectId, pageId, search, startDate, endDate, isDeleted } = req.query;
    
    // 1. Build Query
    const query = { isDeleted: isDeleted === 'true' };
    if (projectId) query.projectId = projectId;
    if (pageId) query.pageId = pageId;
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    // Search logic (name, email, phone)
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { 'data.name': searchRegex },
        { 'data.full_name': searchRegex },
        { 'data.email': searchRegex },
        { 'data.email_address': searchRegex },
        { 'data.phone': searchRegex },
        { 'data.tel': searchRegex },
        { pageSlug: searchRegex }
      ];
    }

    // Pagination (Optional but recommended)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 1000;
    const skip = (page - 1) * limit;

    const leads = await Lead.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Lead.countDocuments(query);

    // 2. Fetch Schemas for ALL pages in the results to ensure 100% accurate dynamic mapping
    const pgIds = [...new Set(leads.map(l => l.pageId))];
    const pIds = [...new Set(leads.map(l => l.projectId))];
    
    const schemas = await FormSchema.find({ 
      $or: [
        { page_id: { $in: pgIds } },
        { project_id: { $in: pIds } }
      ]
    }).lean();

    // Map schemas by pageId for fast lookup
    const schemaMap = {};
    schemas.forEach(s => {
      if (s.page_id) schemaMap[s.page_id.toString()] = s;
      else if (s.project_id) schemaMap[`p_${s.project_id.toString()}`] = s;
    });

    // 3. TRANSFORM: Follow FormSchema strictly, no duplication
    const transformedLeads = leads.map(lead => {
      const schema = schemaMap[lead.pageId.toString()] || schemaMap[`p_${lead.projectId.toString()}`];
      
      const result = {
        _id: lead._id,
        projectId: lead.projectId,
        pageId: lead.pageId,
        pageSlug: lead.pageSlug,
        createdAt: lead.createdAt,
        ip: lead.meta?.ip,
        userAgent: lead.meta?.userAgent,
        ...lead.utm
      };

      // Map dynamic fields using FormSchema
      if (schema && schema.fields) {
        schema.fields.forEach(field => {
          const value = lead.data[field.field_name] !== undefined 
            ? lead.data[field.field_name] 
            : lead.data[field.name];

          if (value !== undefined && value !== null) {
            const label = field.label || field.field_name;
            const semantic = (field.name || "").toLowerCase();
            const labelLower = label.toLowerCase();

            // 1. Map to Standard Universal Keys (for consistent Dashboard columns)
            if (semantic.includes('email') || labelLower.includes('email')) {
              result.email = value;
            } else if (semantic.includes('name') || labelLower.includes('name')) {
              result.name = value;
            } else if (semantic.includes('phone') || semantic.includes('tel') || labelLower.includes('phone') || labelLower.includes('contact')) {
              result.phone = value;
            } else if (semantic.includes('message') || semantic.includes('comment') || labelLower.includes('message') || labelLower.includes('comment')) {
              result.message = value;
            }

            // 2. Always provide the actual label for dynamic column rendering
            result[label] = value;
            
            // 3. Store the technical key for filtering/sorting
            result[field.field_name] = value;
          }
        });
      }
 else {
        // If no schema, fallback to raw data merge (rare)
        Object.assign(result, lead.data);
      }

      return result;
    });

    res.status(200).json({
      status: 'success',
      results: transformedLeads.length,
      total,
      data: {
        leads: transformedLeads,
        total,
        // Helper schema for the UI
        formSchema: schemas.find(s => s.page_id?.toString() === (pageId || pgIds[0])) || schemas[0] || null
      }
    });
  } catch (error) {
    logger.error('❌ Get Leads Failure:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * @desc    Export leads to CSV
 */
exports.exportLeads = async (req, res) => {
  try {
    const { projectId, pageId, search, startDate, endDate } = req.query;
    
    // 1. Reuse query logic
    const query = { isDeleted: false };
    if (projectId) query.projectId = projectId;
    if (pageId) query.pageId = pageId;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [{ 'data.name': searchRegex }, { 'data.email': searchRegex }, { 'data.phone': searchRegex }];
    }

    const leads = await Lead.find(query).sort({ createdAt: -1 }).lean();
    if (leads.length === 0) {
      return res.status(404).json({ error: "No leads found to export" });
    }

    // 2. Discover all possible keys
    const pgIds = [...new Set(leads.map(l => l.pageId))];
    const schemas = await FormSchema.find({ page_id: { $in: pgIds } }).lean();
    const schemaMap = {};
    schemas.forEach(s => schemaMap[s.page_id.toString()] = s);

    const dynamicKeysSet = new Set();
    const headerLabels = ['Name', 'Email', 'Phone', 'Message', 'Date', 'Page', 'Source', 'Medium', 'Campaign'];
    const standardKeys = ['name', 'email', 'phone', 'message', 'createdAt', 'pageSlug', 'utm_source', 'utm_medium', 'utm_campaign'];

    // Map field names to labels for headers
    const fieldToLabel = {};
    schemas.forEach(s => {
      s.fields.forEach(f => {
        fieldToLabel[f.field_name] = f.label;
        if (!standardKeys.includes(f.field_name) && !standardKeys.includes(f.label.toLowerCase())) {
          dynamicKeysSet.add(f.field_name);
        }
      });
    });

    // Also check actual data for keys not in schema
    leads.forEach(l => {
      Object.keys(l.data || {}).forEach(k => {
        if (!standardKeys.includes(k) && !fieldToLabel[k]) {
          dynamicKeysSet.add(k);
        }
      });
    });

    const dynamicKeys = Array.from(dynamicKeysSet);
    const headers = [...headerLabels, ...dynamicKeys.map(k => fieldToLabel[k] || k)];

    // 3. Build CSV Rows
    const rows = leads.map(l => {
      const values = [
        l.data.full_name || l.data.name || '',
        l.data.email || l.data.email_address || '',
        l.data.phone || l.data.tel || '',
        l.data.message || '',
        new Date(l.createdAt).toLocaleString(),
        l.pageSlug || '',
        l.utm?.utm_source || '',
        l.utm?.utm_medium || '',
        l.utm?.utm_campaign || ''
      ];

      dynamicKeys.forEach(k => {
        values.push(l.data[k] || '');
      });

      return values.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=leads_export_${Date.now()}.csv`);
    res.status(200).send(csvContent);

  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, { isDeleted: true });
    if (lead) Project.findByIdAndUpdate(lead.projectId, { $inc: { leadCount: -1 } }).catch(() => {});
    res.status(200).json({ status: 'success', message: 'Lead soft-deleted' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.getTrackerJs = (req, res) => {
  const fs = require('fs');
  const path = require('path');
  const trackerPath = path.join(__dirname, '../../public/tracker.js');
  if (fs.existsSync(trackerPath)) {
    res.setHeader('Content-Type', 'application/javascript');
    return res.sendFile(trackerPath);
  }
  res.status(404).send('Tracker not found');
};
