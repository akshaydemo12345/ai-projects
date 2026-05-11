const mongoose = require('mongoose');
const Lead = require('../models/Lead');
const Page = require('../models/Page');
const Project = require('../models/Project');
const FormSchema = require('../models/FormSchema');
const { validateForm, normalizeData } = require('../utils/dynamicValidator');
const logger = require('../utils/logger');
const { syncFormSchema } = require('../utils/schemaSync');
const emailService = require('../services/emailService');

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

    // 1. Fetch Page and Dynamic Schema
    const page = await Page.findById(pageId) || await Page.findOne({ slug: pageSlug });
    const schema = await FormSchema.findOne({
      $or: [
        { page_id: pageId },
        { project_id: projectId, page_slug: pageSlug },
        { page_slug: pageSlug }
      ].filter(obj => Object.values(obj)[0])
    });

    if (!schema || !schema.fields?.length) {
      logger.warn(`❌ [LEAD] No schema found for page: ${pageSlug || pageId}`);

      // Auto-Sync Attempt if schema is missing but page exists
      if (page) {
        syncFormSchema(page).catch(e => logger.error('Background Sync Failed:', e));
      }

      return res.status(400).json({ status: "fail", message: "Form schema not found. Please refresh the page and try again." });
    }

    // 2. Validate & Normalize using Centralized Utility (with Auto-Healing)
    const missingFields = validateForm(schema.fields, rawData);

    // Check for Likely Template Mismatch inside the controller to trigger sync
    const submittedKeys = Object.keys(rawData).filter(k =>
      !['pageslug', 'pageid', 'projectid', 'domain', 'url', 'token', 'timestamp', 'path'].includes(k.toLowerCase())
    );
    let matchCount = 0;
    schema.fields.forEach(f => {
      // Use a basic check or utility
      const nKey = String(f.field_name || "").toLowerCase();
      if (rawData[nKey] || rawData[f.name] || rawData[f.label]) matchCount++;
    });
    const isMismatch = (submittedKeys.length > 2 && (matchCount / schema.fields.length) < 0.2);

    if (isMismatch && page) {
      logger.info(`🔄 [LEAD] Template mismatch detected for ${pageSlug}. Triggering background schema sync.`);
      syncFormSchema(page).catch(e => logger.error('Background Sync Failed:', e));
    }

    if (missingFields.length > 0) {
      logger.warn(`⚠️ [LEAD] Required fields missing: ${missingFields.join(', ')}`);
      return res.status(400).json({
        status: "fail",
        message: "Required fields missing",
        fields: missingFields
      });
    }

    // 3. Normalize Data for Storage
    const leadData = normalizeData(schema.fields, rawData);

    // 4. UTMs & Meta Extraction
    const utm = {};
    const utmFields = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid', 'msclkid'];

    // First, try from request body
    utmFields.forEach(k => { if (rawData[k]) utm[k] = rawData[k]; });

    const trackingDetails = rawData.trackingDetails || {};
    const referralUrl = trackingDetails.referral_url || rawData.url || rawData.pageUrl || req.headers.referer || '';
    const referralSource = trackingDetails.referral_source || rawData.referrer || rawData.referer || 'Direct';
    const formData = rawData.formData || rawData.formDetails || undefined;

    // 5. Create Lead
    const lead = await Lead.create({
      projectId: schema.project_id,
      pageId: schema.page_id,
      pageSlug: pageSlug || schema.page_slug,
      data: leadData,
      utm,
      formData,
      trackingDetails: {
        referral_url: referralUrl,
        referral_source: referralSource
      },
      meta: {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        domain: rawData.domain || req.get('origin'),
        url: referralUrl,
        referer: rawData.referrer || rawData.referer || (referralSource === 'Direct' ? '' : referralSource)
      }
    });

    Project.findByIdAndUpdate(schema.project_id, { $inc: { leadCount: 1 } }).catch(() => { });

    // ─── EMAIL NOTIFICATIONS ──────────────────────────────────────────────
    try {
      const project = await Project.findById(schema.project_id);
      if (project) {
        const now = new Date().toLocaleString();

        // 1. Admin Notification
        if (project.adminNotification?.enabled && (project.adminNotification.email || project.adminEmail)) {
          const adminEmail = project.adminNotification.email || project.adminEmail;
          const pColor = project.primaryColor || '#7c3aed';
          const customMessage = project.adminNotification.message || "Great news! A new lead has just expressed interest through your landing page. Here are the captured details:";

          const adminMsg = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #334155; margin: 0; padding: 0; background-color: #f8fafc; }
                .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
                .header { background-color: ${pColor}; padding: 40px 20px; text-align: center; color: #ffffff; }
                .header h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em; }
                .header p { margin: 10px 0 0; opacity: 0.8; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600; }
                .content { padding: 40px; }
                .intro { font-size: 14px; color: #64748b; margin-bottom: 30px; text-align: center; white-space: pre-line; }
                .data-card { background-color: #f8fafc; border: 1px solid #f1f5f9; border-radius: 12px; padding: 20px; margin-bottom: 30px; }
                .data-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e2e8f0; }
                .data-row:last-child { border-bottom: none; }
                .label { font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; }
                .value { font-size: 14px; font-weight: 600; color: #1e293b; }
                .footer { padding: 30px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #94a3b8; }
                .footer p { margin: 5px 0; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>New Lead Captured</h1>
                  <p>${project.fromName || 'System Notification'}</p>
                </div>
                <div class="content">
                  <p class="intro">${customMessage}</p>
                  
                  <div class="data-card">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                          <div class="label">Full Name</div>
                          <div class="value">${leadData.name || leadData.full_name || 'Not provided'}</div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                          <div class="label">Email Address</div>
                          <div class="value">${leadData.email || leadData.email_address || 'Not provided'}</div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                          <div class="label">Phone Number</div>
                          <div class="value">${leadData.phone || leadData.tel || 'Not provided'}</div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                          <div class="label">Message</div>
                          <div class="value">${leadData.message || leadData.comment || 'No message provided'}</div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; ${(utm && (utm.utm_source || utm.utm_medium || utm.utm_campaign || utm.utm_term || utm.utm_content)) ? 'border-bottom: 1px solid #e2e8f0;' : ''}">
                          <div class="label">Referral URL</div>
                          <div class="value" style="word-break: break-all; font-size: 13px;">
                            ${referralUrl ? `<a href="${referralUrl}" style="color: ${pColor};">${referralUrl}</a>` : 'Direct'}
                          </div>
                        </td>
                      </tr>
                      ${utm && (utm.utm_source || utm.utm_medium || utm.utm_campaign || utm.utm_term || utm.utm_content) ? `
                      <tr>
                        <td style="padding: 12px 0;">
                          <div class="label">UTM Details</div>
                          <div class="value" style="font-size: 13px;">
                            ${utm.utm_source ? `<strong>Source:</strong> ${utm.utm_source}<br>` : ''}
                            ${utm.utm_medium ? `<strong>Medium:</strong> ${utm.utm_medium}<br>` : ''}
                            ${utm.utm_campaign ? `<strong>Campaign:</strong> ${utm.utm_campaign}<br>` : ''}
                            ${utm.utm_content ? `<strong>Content:</strong> ${utm.utm_content}<br>` : ''}
                            ${utm.utm_term ? `<strong>Term:</strong> ${utm.utm_term}` : ''}
                          </div>
                        </td>
                      </tr>
                      ` : ''}
                    </table>
                  </div>

                  <div class="data-card">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                          <div class="label">UTM Source</div>
                          <div class="value">${utm.utm_source || '—'}</div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                          <div class="label">UTM Medium</div>
                          <div class="value">${utm.utm_medium || '—'}</div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                          <div class="label">UTM Campaign</div>
                          <div class="value">${utm.utm_campaign || '—'}</div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                          <div class="label">UTM Term</div>
                          <div class="value">${utm.utm_term || '—'}</div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                          <div class="label">UTM Content</div>
                          <div class="value">${utm.utm_content || '—'}</div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0;">
                          <div class="label">Referral URL</div>
                          <div class="value">${lead.meta?.referer || '—'}</div>
                        </td>
                      </tr>
                    </table>
                  </div>

                  <div style="text-align: center;">
                    <p style="font-size: 12px; color: #94a3b8;">Captured from: <strong>${pageSlug || schema.page_slug || 'Landing Page'}</strong></p>
                  </div>
                </div>
                <div class="footer">
                  <p>Powered by AI Landing Page Builder</p>
                  <p>&copy; ${new Date().getFullYear()} ${project.fromName || 'All Rights Reserved'}</p>
                </div>
              </div>
            </body>
            </html>
          `;

          emailService.sendEmail({
            to: adminEmail,
            subject: project.adminNotification.subject?.replace(/{{page_slug}}/g, pageSlug || '') || `New Lead from ${pageSlug}`,
            htmlContent: adminMsg,
            fromName: project.fromName,
            fromEmail: project.fromEmail,
            brevoKey: project.brevoKey
          }).catch(err => logger.error('Admin Email Error:', err));
        }

        // 2. User Auto-Reply
        const userEmail = leadData.email || leadData.email_address;
        if (project.userNotification?.enabled && userEmail) {
          const pColor = project.primaryColor || '#7c3aed';
          const userName = leadData.name || leadData.full_name || 'there';
          const customUserMessage = project.userNotification.message || "Thank you for reaching out to us! We have received your inquiry and our team is already looking into it. We will get back to you as soon as possible.";

          const userMsg = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #334155; margin: 0; padding: 0; background-color: #f8fafc; }
                .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
                .header { background-color: ${pColor}; padding: 40px 20px; text-align: center; color: #ffffff; }
                .header .logo { width: 48px; height: 48px; background: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: bold; }
                .header h1 { margin: 0; font-size: 22px; font-weight: 700; }
                .content { padding: 40px; text-align: center; }
                .content h2 { color: #1e293b; margin-top: 0; }
                .content p { color: #64748b; font-size: 15px; margin-bottom: 30px; white-space: pre-line; }
                .footer { padding: 30px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #94a3b8; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <div class="logo">${(project.fromName || 'L')[0]}</div>
                  <h1>Message Received</h1>
                </div>
                <div class="content">
                  <h2>Hello ${userName},</h2>
                  <p>${customUserMessage}</p>
                  <div style="margin: 30px 0;">
                    <span style="padding: 12px 24px; border-radius: 50px; background-color: ${pColor}; color: #ffffff; font-weight: 700; font-size: 14px; text-decoration: none;">We'll talk soon!</span>
                  </div>
                        </div>

                  <div class="data-card" style="margin-top: 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                          <div class="label">UTM Source</div>
                          <div class="value">${utm.utm_source || '—'}</div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                          <div class="label">UTM Medium</div>
                          <div class="value">${utm.utm_medium || '—'}</div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                          <div class="label">UTM Campaign</div>
                          <div class="value">${utm.utm_campaign || '—'}</div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0;">
                          <div class="label">Referral URL</div>
                          <div class="value">${lead.meta?.referer || '—'}</div>
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>
                <div class="footer">
                  <p>This is an automated confirmation from ${project.fromName || 'our team'}.</p>
                  <p>&copy; ${new Date().getFullYear()} ${project.fromName || 'All Rights Reserved'}</p>
                </div>
              </div>
            </body>
            </html>
          `;

          emailService.sendEmail({
            to: userEmail,
            subject: project.userNotification.subject || "Thank you for contacting us!",
            htmlContent: userMsg,
            fromName: project.fromName,
            fromEmail: project.fromEmail,
            brevoKey: project.brevoKey
          }).catch(err => logger.error('User Email Error:', err));
        }
      }
    } catch (emailErr) {
      logger.error('Email Trigger Logic Failed:', emailErr);
    }

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
    const { projectId, pageId, search, startDate, endDate, isDeleted, utmSource, utmMedium, utmCampaign } = req.query;

    // 1. Build Query
    const query = { isDeleted: isDeleted === 'true' };
    if (projectId) query.projectId = projectId;
    if (pageId) query.pageId = pageId;

    if (utmSource) query['utm.utm_source'] = utmSource;
    if (utmMedium) query['utm.utm_medium'] = utmMedium;
    if (utmCampaign) query['utm.utm_campaign'] = utmCampaign;

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
    // Pagination & Sorting logic
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 1000;
    const skip = (page - 1) * limit;

    const sortByParam = req.query.sortBy || 'newest';
    let sortQuery = { createdAt: -1 };

    if (sortByParam === 'oldest') {
      sortQuery = { createdAt: 1 };
    } else if (sortByParam === 'name') {
      sortQuery = { 'data.name': 1, 'data.full_name': 1, createdAt: -1 };
    }

    const leads = await Lead.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Lead.countDocuments(query);

    // Calculate Today's Leads count for the current filters
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayQuery = { ...query, createdAt: { $gte: todayStart } };
    const todayCount = await Lead.countDocuments(todayQuery);

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
        url: lead.meta?.url,
        trackingDetails: lead.trackingDetails || {
          referral_url: lead.meta?.url,
          referral_source: lead.meta?.referer || 'Direct'
        },
        createdAt: lead.createdAt,
        ip: lead.meta?.ip,
        userAgent: lead.meta?.userAgent,
        referer: lead.meta?.referer,
        ...lead.utm,
        data: lead.data || {},
        formData: lead.formData || [],
        utm: lead.utm || {}
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
        todayCount,
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
    const { projectId, pageId, search, startDate, endDate, utmSource, utmMedium, utmCampaign } = req.query;

    // 1. Reuse query logic
    const query = { isDeleted: false };
    if (projectId) query.projectId = projectId;
    if (pageId) query.pageId = pageId;

    if (utmSource) query['utm.utm_source'] = utmSource;
    if (utmMedium) query['utm.utm_medium'] = utmMedium;
    if (utmCampaign) query['utm.utm_campaign'] = utmCampaign;
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
    const schemas = await FormSchema.find({ page_id: { $in: [...new Set(leads.map(l => l.pageId))] } }).lean();
    const fieldToLabel = {};
    schemas.forEach(s => s.fields.forEach(f => { fieldToLabel[f.field_name] = f.label; }));

    const headerLabels = ['Name', 'Email', 'Phone', 'Message', 'Date', 'Page', 'Source', 'Medium', 'Campaign', 'Term', 'Content', 'Referral URL', 'IP Address'];
    const standardKeys = ['name', 'email', 'phone', 'message', 'createdAt', 'pageSlug', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'referer', 'ip'];

    const shownLabels = new Set(headerLabels.map(l => l.toLowerCase()));
    const dynamicColumns = [];

    leads.forEach(l => {
      const allData = { ...(l.data || {}), ...l.utm };
      Object.keys(allData).forEach(k => {
        const lowerK = k.toLowerCase().replace(/_/g, "");

        // Skip standard keys and contact info
        if (standardKeys.some(sk => sk.toLowerCase().replace(/_/g, "") === lowerK)) return;
        if (lowerK.includes("email") || lowerK.includes("phone") || lowerK.includes("mobile") || lowerK.includes("tel") || lowerK.includes("contact")) return;

        // Skip explicitly handled or internal system fields
        const skipKeys = ["name", "fullname", "message", "comment", "ip", "pageslug", "projectid", "pageid", "formdata", "trackingdetails", "utm"];
        if (skipKeys.includes(lowerK)) return;

        // Skip plain objects (internal nested data) to prevent [object Object] in CSV
        if (typeof allData[k] === 'object' && allData[k] !== null && !Array.isArray(allData[k])) return;

        const label = fieldToLabel[k] || k.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
        if (!shownLabels.has(label.toLowerCase())) {
          shownLabels.add(label.toLowerCase());
          dynamicColumns.push({ key: k, label });
        }
      });
    });

    const headers = [...headerLabels, ...dynamicColumns.map(c => c.label)];

    // 3. Build CSV Rows
    const rows = leads.map(l => {
      const emails = new Set();
      const phones = new Set();
      const allData = { ...(l.data || {}), ...l };

      Object.entries(allData).forEach(([key, value]) => {
        if (!value || typeof value !== 'string') return;
        const k = key.toLowerCase().replace(/_/g, "");
        if (k.includes("email")) emails.add(value);
        else if ((k.includes("phone") || k.includes("mobile") || k.includes("tel") || k.includes("contact")) && value.match(/[0-9]/)) {
          phones.add(value);
        }
      });

      const row = [
        l.data?.full_name || l.data?.name || l.name || '',
        Array.from(emails).join("; ") || l.email || '',
        Array.from(phones).join("; ") || l.phone || '',
        l.data?.message || l.data?.comment || l.message || '',
        new Date(l.createdAt).toLocaleString(),
        l.pageSlug || '',
        l.utm?.utm_source || '',
        l.utm?.utm_medium || '',
        l.utm?.utm_campaign || '',
        l.utm?.utm_term || '',
        l.utm?.utm_content || '',
        l.meta?.referer || '',
        l.meta?.ip || l.ip || ''
      ];

      // Add dynamic values
      dynamicColumns.forEach(col => {
        row.push(l.data?.[col.key] || l[col.key] || '');
      });

      return row.map(v => {
        let val = v;
        if (Array.isArray(v)) val = v.join(', ');
        else if (typeof v === 'object' && v !== null) val = ''; // Exclude any remaining plain objects
        return `"${String(val).replace(/"/g, '""')}"`;
      }).join(',');
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
    if (lead) Project.findByIdAndUpdate(lead.projectId, { $inc: { leadCount: -1 } }).catch(() => { });
    res.status(200).json({ status: 'success', message: 'Lead soft-deleted' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * @desc    Get unique values for filters (UTMs, etc)
 */
exports.getLeadFilters = async (req, res) => {
  try {
    const { projectId } = req.query;
    const match = { isDeleted: false };
    if (projectId && mongoose.Types.ObjectId.isValid(projectId)) {
      match.projectId = new mongoose.Types.ObjectId(projectId);
    }

    // Try both flattened and nested for backward compatibility
    const [flatSources, nestedSources] = await Promise.all([
      Lead.distinct('utm_source', match),
      Lead.distinct('utm.utm_source', match)
    ]);
    const [flatMediums, nestedMediums] = await Promise.all([
      Lead.distinct('utm_medium', match),
      Lead.distinct('utm.utm_medium', match)
    ]);
    const [flatCampaigns, nestedCampaigns] = await Promise.all([
      Lead.distinct('utm_campaign', match),
      Lead.distinct('utm.utm_campaign', match)
    ]);

    const utmSources = [...new Set([...flatSources, ...nestedSources])];
    const utmMediums = [...new Set([...flatMediums, ...nestedMediums])];
    const utmCampaigns = [...new Set([...flatCampaigns, ...nestedCampaigns])];

    res.status(200).json({
      status: 'success',
      data: {
        utmSources: utmSources.filter(Boolean),
        utmMediums: utmMediums.filter(Boolean),
        utmCampaigns: utmCampaigns.filter(Boolean)
      }
    });
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
