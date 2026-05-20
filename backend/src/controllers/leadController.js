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
    let schema = await FormSchema.findOne({
      $or: [
        { page_id: pageId },
        { project_id: projectId, page_slug: pageSlug },
        { page_slug: pageSlug }
      ].filter(obj => Object.values(obj)[0])
    });

    if (!schema || !schema.fields?.length) {
      logger.warn(`❌ [LEAD] No schema found for page: ${pageSlug || pageId}. Triggering auto-sync.`);

      // Auto-Sync Attempt if schema is missing but page exists
      if (page) {
        try {
          await syncFormSchema(page);
          // Try fetching schema again after sync
          schema = await FormSchema.findOne({ page_id: page._id });
        } catch (e) {
          logger.error('Background Sync Failed:', e);
        }
      }
    }

    // 2. Validate & Normalize dynamic data
    let leadData;
    let finalProjectId = projectId;
    let finalPageId = pageId;

    if (page) {
      finalProjectId = finalProjectId || page.projectId;
      finalPageId = finalPageId || page._id;
    }

    if (schema && schema.fields?.length) {
      // Validate & Normalize using Centralized Utility (with Auto-Healing)
      const missingFields = validateForm(schema.fields, rawData);

      // Check for Likely Template Mismatch inside the controller to trigger sync
      const submittedKeys = Object.keys(rawData).filter(k =>
        !['pageslug', 'pageid', 'projectid', 'domain', 'url', 'token', 'timestamp', 'path'].includes(k.toLowerCase())
      );
      let matchCount = 0;
      schema.fields.forEach(f => {
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

      // Normalize Data for Storage
      leadData = normalizeData(schema.fields, rawData);
    } else {
      // Fallback: No schema found. Capture all fields directly.
      logger.info(`ℹ️ [LEAD] Schema fallback active. Capturing raw submitted fields.`);
      leadData = {};
      const skipKeys = [
        'pageid', 'pageslug', 'projectid', 'domain', 'url', 'token', 'timestamp', 'path',
        'formdata', 'formdetails', 'referer', 'referrer', 'referral_url', 'referrer_url', 'thankyouurl', 'pageurl'
      ];
      Object.keys(rawData).forEach(k => {
        if (!skipKeys.includes(k.toLowerCase()) && !k.toLowerCase().startsWith('utm')) {
          leadData[k] = rawData[k];
        }
      });
    }

    // 3. Robust Real IP Detection
    let ip_address = req.headers['x-forwarded-for'] 
      || req.ip 
      || (req.socket && req.socket.remoteAddress) 
      || '';
    if (typeof ip_address === 'string' && ip_address.includes(',')) {
      ip_address = ip_address.split(',')[0].trim();
    }

    // 4. Referral / Landing Page URLs
    const trackingDetails = rawData.trackingDetails || {};
    const referralUrl = trackingDetails.referral_url || rawData.url || rawData.pageUrl || req.headers.referer || '';
    const referralSource = trackingDetails.referral_source || rawData.referrer || rawData.referer || 'Direct';
    const referrer = rawData.referer || rawData.referrer || req.headers.referer || '';
    const formData = rawData.formData || rawData.formDetails || undefined;

    // 5. UTM strictly from URL / current payload (no localStorage)
    const utmFields = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid', 'msclkid'];
    const utm = {};
    
    // Initialize all to null
    utmFields.forEach(k => {
      utm[k] = null;
    });

    // Extract root level UTM parameters from payload
    utmFields.forEach(k => {
      if (rawData[k] !== undefined && rawData[k] !== null && rawData[k] !== '') {
        utm[k] = rawData[k];
      }
    });

    // Extract from nested UTM object if present
    const nestedUtm = rawData.utm || (rawData.trackingDetails && rawData.trackingDetails.utm) || {};
    utmFields.forEach(k => {
      if ((utm[k] === null || utm[k] === '') && nestedUtm[k] !== undefined && nestedUtm[k] !== null && nestedUtm[k] !== '') {
        utm[k] = nestedUtm[k];
      }
    });

    // Extract from referralUrl (landing page URL) if missing
    if (referralUrl) {
      try {
        const parsedUrl = new URL(referralUrl);
        utmFields.forEach(k => {
          if (utm[k] === null || utm[k] === '') {
            const val = parsedUrl.searchParams.get(k);
            if (val) utm[k] = val;
          }
        });
      } catch (e) {
        if (referralUrl.includes('?')) {
          const params = new URLSearchParams(referralUrl.split('?')[1]);
          utmFields.forEach(k => {
            if (utm[k] === null || utm[k] === '') {
              const val = params.get(k);
              if (val) utm[k] = val;
            }
          });
        }
      }
    }

    // 6. Ensure Form Data is captured beautifully
    let finalFormData = formData;
    if (!finalFormData || !finalFormData.length) {
      finalFormData = [];
      Object.entries(leadData).forEach(([k, v]) => {
        finalFormData.push({
          name: k,
          label: k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          value: v,
          type: 'text'
        });
      });
    }

    const submitted_at = new Date();

    // 7. Create Lead in MongoDB
    const lead = await Lead.create({
      projectId: finalProjectId || (schema ? schema.project_id : undefined),
      pageId: finalPageId || (schema ? schema.page_id : undefined),
      pageSlug: pageSlug || (schema ? schema.page_slug : undefined) || (page ? page.slug : 'unknown'),
      data: leadData,
      utm, // Nested UTM object
      
      // Flattened UTM fields at root
      utm_source: utm.utm_source,
      utm_medium: utm.utm_medium,
      utm_campaign: utm.utm_campaign,
      utm_term: utm.utm_term,
      utm_content: utm.utm_content,
      gclid: utm.gclid,
      fbclid: utm.fbclid,
      msclkid: utm.msclkid,
      
      formData: finalFormData,
      trackingDetails: {
        referral_url: referralUrl,
        referral_source: referralSource
      },
      meta: {
        ip: ip_address,
        userAgent: req.get('User-Agent'),
        domain: rawData.domain || req.get('origin'),
        url: referralUrl,
        referer: referrer
      },

      // Flattened explicit analytics fields
      landing_page: referralUrl,
      referrer: referrer,
      user_agent: req.get('User-Agent') || '',
      ip_address: ip_address,
      submitted_at: submitted_at
    });

    const projId = finalProjectId || (schema ? schema.project_id : undefined);
    if (projId) {
      Project.findByIdAndUpdate(projId, { $inc: { leadCount: 1 } }).catch(() => { });
    }

    // ─── EMAIL NOTIFICATIONS ──────────────────────────────────────────────
    try {
      if (projId) {
        const project = await Project.findById(projId);
        if (project) {
          // 1. Admin Notification
          if (project.adminNotification?.enabled && (project.adminNotification.email || project.adminEmail)) {
            const adminEmail = project.adminNotification.email || project.adminEmail;
            const pColor = project.primaryColor || '#7c3aed';

            // ── Build dynamic, grouped email content ──────────────────────────
            // Helper: format a raw key into a human-readable label
            const _fmtLabel = (k) => String(k)
              .replace(/^utm_/i, '')
              .replace(/[_-]+/g, ' ')
              .replace(/\b\w/g, c => c.toUpperCase())
              .trim();

            // Helper: safely stringify any value (fixes [object Object])
            const _fmtValue = (v) => {
              if (v === null || v === undefined || v === '') return '';
              if (typeof v === 'object' && !Array.isArray(v)) {
                // Flatten object into readable key: value lines
                return Object.entries(v)
                  .filter(([, val]) => val !== null && val !== undefined && val !== '')
                  .map(([k, val]) => `<strong>${_fmtLabel(k)}:</strong> ${typeof val === 'object' ? JSON.stringify(val) : String(val)}`)
                  .join('<br>') || '';
              }
              if (Array.isArray(v)) return v.filter(Boolean).join(', ');
              return String(v);
            };

            // ── Categorise lead fields into sections ─────────────────────────
            const _contactKeys = ['name', 'full_name', 'fullname', 'first_name', 'last_name', 'email', 'email_address', 'phone', 'phone_number', 'mobile', 'tel', 'contact', 'contact_number'];
            const _messageKeys = ['message', 'comment', 'comments', 'note', 'notes', 'inquiry', 'question', 'description'];
            const _skipKeys = ['pageid', 'pageslug', 'projectid', 'domain', 'url', 'token', 'timestamp', 'path', 'formdata', 'formdetails', 'trackingdetails', 'tracking_details', 'referer', 'referrer', 'referral_url', 'referrer_url', 'thankyouurl', 'pageurl', 'utm', 'meta'];

            const contactRows = [];
            const serviceRows = [];
            const seenLabels = new Set();

            // Deduplicate: prefer full_name over name
            const hasFullName = leadData.full_name || leadData.fullname;

            Object.entries(leadData).forEach(([key, value]) => {
              const lk = key.toLowerCase().replace(/[_-]+/g, '');
              if (_skipKeys.some(sk => sk.replace(/[_-]+/g, '') === lk)) return;

              const formatted = _fmtValue(value);
              if (!formatted) return;

              // Deduplicate name vs full_name
              if ((lk === 'name') && hasFullName) return;

              const label = _fmtLabel(key);
              const labelKey = label.toLowerCase();
              if (seenLabels.has(labelKey)) return;
              seenLabels.add(labelKey);

              if (_contactKeys.some(ck => ck.replace(/[_-]+/g, '') === lk) || _messageKeys.some(mk => mk.replace(/[_-]+/g, '') === lk)) {
                contactRows.push({ label, value: formatted });
              } else {
                serviceRows.push({ label, value: formatted });
              }
            });

            // ── UTM / Tracking rows ──────────────────────────────────────────
            const trackingRows = [];
            const utmEntries = utm ? Object.entries(utm).filter(([, v]) => v) : [];
            utmEntries.forEach(([k, v]) => {
              trackingRows.push({ label: _fmtLabel(k.startsWith('utm_') ? k : `utm_${k}`), value: String(v) });
            });
            // Add referrer if available
            if (referralSource && referralSource !== 'Direct') {
              trackingRows.push({ label: 'Referral Source', value: String(referralSource) });
            }

            // ── Row renderer (table-based for email clients) ────────────────
            const _renderRows = (rows) => rows.map((r, i) => `
              <tr>
                <td style="padding: 14px 20px;${i < rows.length - 1 ? ' border-bottom: 1px solid #f1f5f9;' : ''}">
                  <div style="font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px;">${r.label}</div>
                  <div style="font-size: 15px; font-weight: 600; color: #1e293b; line-height: 1.5; word-break: break-word; overflow-wrap: break-word;">${r.value}</div>
                </td>
              </tr>`).join('');

            // ── Section renderer ─────────────────────────────────────────────
            const _renderSection = (title, icon, rows) => {
              if (!rows.length) return '';
              return `
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 20px; background-color: #f8fafc; border-bottom: 2px solid #e2e8f0;">
                    <span style="font-size: 13px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.06em;">${icon} ${title}</span>
                  </td>
                </tr>
                ${_renderRows(rows)}
              </table>`;
            };

            // ── Page info rows ───────────────────────────────────────────────
            const pageInfoRows = [];
            if (referralUrl) {
              pageInfoRows.push({ label: 'Landing Page', value: `<a href="${referralUrl}" style="color: ${pColor}; text-decoration: none; word-break: break-all; overflow-wrap: break-word;">${referralUrl}</a>` });
            }
            if (referrer && referrer !== referralUrl) {
              pageInfoRows.push({ label: 'Referrer', value: `<a href="${referrer}" style="color: ${pColor}; text-decoration: none; word-break: break-all; overflow-wrap: break-word;">${referrer}</a>` });
            }
            const capturedPage = pageSlug || (schema ? schema.page_slug : '') || '';
            if (capturedPage) {
              pageInfoRows.push({ label: 'Page Slug', value: capturedPage });
            }
            pageInfoRows.push({ label: 'Submitted At', value: new Date(submitted_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) });

            const adminMsg = `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
              </head>
              <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-text-size-adjust: 100%;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9;">
                  <tr>
                    <td align="center" style="padding: 40px 16px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 580px; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">

                        <!-- Header -->
                        <tr>
                          <td style="background: linear-gradient(135deg, ${pColor}, ${pColor}dd); padding: 36px 24px; text-align: center;">
                            <div style="width: 52px; height: 52px; background: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto 14px; line-height: 52px; font-size: 22px; color: #fff;">📩</div>
                            <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.02em;">New Lead Captured</h1>
                            <p style="margin: 8px 0 0; font-size: 12px; color: rgba(255,255,255,0.75); text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600;">${project.fromName || 'Lead Notification'}</p>
                          </td>
                        </tr>

                        <!-- Body -->
                        <tr>
                          <td style="padding: 28px 16px;">

                            <!-- Contact Details Section -->
                            ${_renderSection('Contact Details', '👤', contactRows)}

                            <!-- Service / Other Details Section -->
                            ${_renderSection('Inquiry Details', '📋', serviceRows)}

                            <!-- Tracking Section (conditional) -->
                            ${_renderSection('Campaign Tracking', '📊', trackingRows)}

                            <!-- Page Information Section -->
                            ${_renderSection('Page Information', '🔗', pageInfoRows)}

                          </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                          <td style="padding: 24px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
                            <p style="margin: 0 0 4px; font-size: 11px; color: #94a3b8;">Powered by AI Landing Page Builder</p>
                            <p style="margin: 0; font-size: 11px; color: #94a3b8;">&copy; ${new Date().getFullYear()} ${project.fromName || 'All Rights Reserved'}</p>
                          </td>
                        </tr>

                      </table>
                    </td>
                  </tr>
                </table>
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

    // Get user's projects
    const userProjects = await Project.find({ userId: req.user._id, isDeleted: false }).select('_id');
    const userProjectIds = userProjects.map(p => p._id);

    // 1. Build Query
    const query = { isDeleted: isDeleted === 'true' };
    
    // Filter by user's projects
    query.projectId = { $in: userProjectIds };
    
    // If specific projectId requested, ensure it belongs to user
    if (projectId) {
      if (!userProjectIds.some(id => id.toString() === projectId)) {
        return res.status(403).json({ status: 'fail', message: 'Access denied to this project' });
      }
      query.projectId = projectId; // Override to specific project
    }
    
    if (pageId) query.pageId = pageId;

    if (utmSource) query.utm_source = utmSource;
    if (utmMedium) query.utm_medium = utmMedium;
    if (utmCampaign) query.utm_campaign = utmCampaign;

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
      const schema = schemaMap[lead.pageId ? lead.pageId.toString() : ''] || schemaMap[`p_${lead.projectId.toString()}`];

      const result = {
        _id: lead._id,
        projectId: lead.projectId,
        pageId: lead.pageId,
        pageSlug: lead.pageSlug,
        url: lead.landing_page || lead.meta?.url,
        trackingDetails: lead.trackingDetails || {
          referral_url: lead.landing_page || lead.meta?.url,
          referral_source: lead.referrer || lead.meta?.referer || 'Direct'
        },
        createdAt: lead.createdAt,
        ip: lead.ip_address || lead.meta?.ip,
        userAgent: lead.user_agent || lead.meta?.userAgent,
        referer: lead.referrer || lead.meta?.referer,
        utm_source: lead.utm_source,
        utm_medium: lead.utm_medium,
        utm_campaign: lead.utm_campaign,
        utm_term: lead.utm_term,
        utm_content: lead.utm_content,
        gclid: lead.gclid,
        fbclid: lead.fbclid,
        msclkid: lead.msclkid,
        landing_page: lead.landing_page,
        referrer: lead.referrer,
        user_agent: lead.user_agent,
        ip_address: lead.ip_address,
        submitted_at: lead.submitted_at || lead.createdAt,
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
        // If no schema, fallback to raw data merge
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

    // Get user's projects
    const userProjects = await Project.find({ userId: req.user._id, isDeleted: false }).select('_id');
    const userProjectIds = userProjects.map(p => p._id);

    // 1. Reuse query logic
    const query = { isDeleted: false };
    
    // Filter by user's projects
    query.projectId = { $in: userProjectIds };
    
    // If specific projectId requested, ensure it belongs to user
    if (projectId) {
      if (!userProjectIds.some(id => id.toString() === projectId)) {
        return res.status(403).json({ status: 'fail', message: 'Access denied to this project' });
      }
      query.projectId = projectId; // Override to specific project
    }
    
    if (pageId) query.pageId = pageId;

    if (utmSource) query.utm_source = utmSource;
    if (utmMedium) query.utm_medium = utmMedium;
    if (utmCampaign) query.utm_campaign = utmCampaign;
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
    const schemas = await FormSchema.find({ page_id: { $in: [...new Set(leads.map(l => l.pageId).filter(Boolean))] } }).lean();
    const fieldToLabel = {};
    schemas.forEach(s => s.fields.forEach(f => { fieldToLabel[f.field_name] = f.label; }));

    const headerLabels = ['Name', 'Email', 'Phone', 'Message', 'Date', 'Page', 'Page URL', 'Referral URL', 'Source', 'Medium', 'Campaign', 'Term', 'Content', 'IP Address'];
    const standardKeys = ['name', 'email', 'phone', 'message', 'createdAt', 'pageSlug', 'pageUrl', 'referral_url', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'ip'];

    const shownLabels = new Set(headerLabels.map(l => l.toLowerCase()));
    const dynamicColumns = [];

    const getFormDataArray = (lead) => {
      if (Array.isArray(lead.formData)) return lead.formData;
      if (Array.isArray(lead.formDetails)) return lead.formDetails;
      return [];
    };

    leads.forEach(l => {
      const allData = { ...(l.data || {}), ...l.utm, utm_source: l.utm_source, utm_medium: l.utm_medium, utm_campaign: l.utm_campaign, utm_term: l.utm_term, utm_content: l.utm_content };
      Object.keys(allData).forEach(k => {
        const lowerK = k.toLowerCase().replace(/_/g, "");

        // Skip standard keys and contact info
        if (standardKeys.some(sk => sk.toLowerCase().replace(/_/g, "") === lowerK)) return;
        if (lowerK.includes("email") || lowerK.includes("phone") || lowerK.includes("mobile") || lowerK.includes("tel") || lowerK.includes("contact")) return;

        // Skip explicitly handled or internal system fields
        const skipKeys = ["name", "fullname", "message", "comment", "ip", "pageslug", "projectid", "pageid", "formdata", "trackingdetails", "utm", "landing_page", "referrer", "user_agent", "ip_address", "submitted_at"];
        if (skipKeys.includes(lowerK)) return;

        // Skip plain objects (internal nested data) to prevent [object Object] in CSV
        if (typeof allData[k] === 'object' && allData[k] !== null && !Array.isArray(allData[k])) return;

        const label = fieldToLabel[k] || k.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
        if (!shownLabels.has(label.toLowerCase())) {
          shownLabels.add(label.toLowerCase());
          dynamicColumns.push({ key: k, label });
        }
      });

      const formDataArray = getFormDataArray(l);
      formDataArray.forEach((field, idx) => {
        if (!field) return;
        const key = String(field.name || field.label || `form_field_${idx}`).trim();
        if (!key) return;

        const lowerK = key.toLowerCase().replace(/_/g, "");
        if (standardKeys.some(sk => sk.toLowerCase().replace(/_/g, "") === lowerK)) return;
        if (lowerK.includes("email") || lowerK.includes("phone") || lowerK.includes("mobile") || lowerK.includes("tel") || lowerK.includes("contact")) return;
        const skipKeys = ["name", "fullname", "message", "comment", "ip", "pageslug", "projectid", "pageid", "formdata", "trackingdetails", "utm", "landing_page", "referrer", "user_agent", "ip_address", "submitted_at"];
        if (skipKeys.includes(lowerK)) return;

        const label = String(field.label || field.name || key).replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
        if (!shownLabels.has(label.toLowerCase())) {
          shownLabels.add(label.toLowerCase());
          dynamicColumns.push({ key, label });
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

      const fullPageUrl = l.landing_page || l.meta?.url || l.trackingDetails?.referral_url || '';
      const referralUrl = l.referrer || l.meta?.referer || '';

      const formDataArray = getFormDataArray(l);
      const formDataLookup = formDataArray.reduce((acc, field, idx) => {
        if (!field) return acc;
        const key = String(field.name || field.label || `form_field_${idx}`).trim();
        if (!key) return acc;
        acc[key] = field.value;
        return acc;
      }, {});

      const row = [
        l.data?.full_name || l.data?.name || l.name || '',
        Array.from(emails).join("; ") || l.email || '',
        Array.from(phones).join("; ") || l.phone || '',
        l.data?.message || l.data?.comment || l.message || '',
        new Date(l.submitted_at || l.createdAt).toLocaleString(),
        l.pageSlug || '',
        fullPageUrl,
        referralUrl,
        l.utm_source || l.utm?.utm_source || '',
        l.utm_medium || l.utm?.utm_medium || '',
        l.utm_campaign || l.utm?.utm_campaign || '',
        l.utm_term || l.utm?.utm_term || '',
        l.utm_content || l.utm?.utm_content || '',
        l.referrer || l.meta?.referer || '',
        l.ip_address || l.meta?.ip || l.ip || ''
      ];

      // Add dynamic values
      dynamicColumns.forEach(col => {
        row.push(
          l.data?.[col.key] || l[col.key] || formDataLookup[col.key] || ''
        );
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
    // First find the lead to check ownership
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ status: 'fail', message: 'Lead not found' });
    }
    
    // Check if the lead's project belongs to the user
    const project = await Project.findById(lead.projectId);
    if (!project || project.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ status: 'fail', message: 'Access denied to this lead' });
    }
    
    await Lead.findByIdAndUpdate(req.params.id, { isDeleted: true });
    Project.findByIdAndUpdate(lead.projectId, { $inc: { leadCount: -1 } }).catch(() => { });
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
    
    // Get user's projects
    const userProjects = await Project.find({ userId: req.user._id, isDeleted: false }).select('_id');
    const userProjectIds = userProjects.map(p => p._id);
    
    const match = { isDeleted: false, projectId: { $in: userProjectIds } };
    if (projectId && mongoose.Types.ObjectId.isValid(projectId)) {
      if (!userProjectIds.some(id => id.toString() === projectId)) {
        return res.status(403).json({ status: 'fail', message: 'Access denied to this project' });
      }
      match.projectId = new mongoose.Types.ObjectId(projectId);
    }

    const [utmSources, utmMediums, utmCampaigns] = await Promise.all([
      Lead.distinct('utm_source', match),
      Lead.distinct('utm_medium', match),
      Lead.distinct('utm_campaign', match)
    ]);

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
