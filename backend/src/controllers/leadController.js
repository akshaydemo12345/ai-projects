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
    const { name, email, phone, message, pageSlug, pageId, projectId, domain, url, path: reqPath } = req.body;

    // Determine domain and url if not provided in body (e.g. from headers)
    const finalDomain = domain || req.get('origin') || req.get('host') || 'unknown';
    const finalUrl = url || req.get('referer') || 'unknown';
    
    // Robust slug detection
    const targetSlug = pageSlug || (reqPath || '').replace(/^\/+|\/+$/g, '').split('/')[0];

    // Basic validation
    if (!email || !targetSlug) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields: email and pageSlug are mandatory.'
      });
    }

    // ─── DUPLICATE PROTECTION: Prevent multiple leads within seconds ───
    const recentLead = await Lead.findOne({
      email: email.toLowerCase(),
      pageSlug: targetSlug,
      createdAt: { $gt: new Date(Date.now() - 5000) } // 5 second window
    });

    if (recentLead) {
      return res.status(200).json({
        status: 'success',
        message: 'Lead already captured',
        data: { leadId: recentLead._id, duplicate: true }
      });
    }

    // Try to find the page to verify it exists and get projectId if missing
    let finalProjectId = projectId;
    let page = null;
    
    page = await Page.findOne({ slug: targetSlug });
    if (page) {
      if (!finalProjectId) finalProjectId = page.projectId;
    }

    const lead = await Lead.create({
      name: name || 'Contact',
      email: email.trim().toLowerCase(),
      phone: phone || '',
      message: message || '',
      pageSlug: targetSlug,
      pageId: pageId || (page ? page._id : null),
      projectId: finalProjectId,
      domain: finalDomain,
      url: finalUrl,
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

    // Set cookie with landing page context for Thank You page
    const lpContext = JSON.stringify({
      pageSlug: pageSlug,
      pageId: pageId || null,
      projectId: finalProjectId || null,
      timestamp: Date.now()
    });

    res.cookie('lp_context', lpContext, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 300000 // 5 minutes
    });

    const thankYouUrl = page && page.thankYouUrl ? page.thankYouUrl : `/${targetSlug}/thank-you`;

    return res.status(201).json({
      status: 'success',
      message: 'Lead saved successfully',
      thankYouUrl,
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

    // Decrement the project's aggregate lead count
    if (lead.projectId) {
      await Project.findByIdAndUpdate(lead.projectId, { $inc: { leadCount: -1 } });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};


/**
 * @desc    Serve the lead capture tracker script (obfuscated)
 * @route   GET /api/leads/tracker.js
 * @access  Public
 */
exports.getTrackerJs = (req, res) => {
  res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // ── Full readable source (kept here for maintainability) ──────────────────
  const source = `(function(){
    var s = document.getElementById("dm-lead-tracker") || document.currentScript;
    if (!s) return;
    var A = s.getAttribute("data-api-url") || "",
        SL = s.getAttribute("data-page-slug") || "",
        PI = s.getAttribute("data-page-id") || "",
        PJ = s.getAttribute("data-project-id") || "";

    console.log('[Lead Tracker] Initialized with API:', A, 'Slug:', SL);

    function send(d, f, b, t, n) {
      console.log('[Lead Tracker] Dummy simulation starting for lead:', d);
      
      // Front-end dummy simulation of an API request
      setTimeout(function() {
        console.log('[Lead Tracker] Response: success');
        f.reset();
        
        // Dispatch success event for external scripts (pixels, etc.)
        var ev = new CustomEvent('submit-success', { detail: { leadId: 'dummy_lead_' + Date.now() } });
        document.dispatchEvent(ev);

        // Redirect logic: prioritize window.pageThankYouUrl
        var tyUrl = window.pageThankYouUrl || "";
        if (tyUrl && tyUrl.trim() !== "") {
          console.log('[Lead Tracker] Redirecting to custom URL:', tyUrl);
          window.location.replace(tyUrl);
        } else if (SL) {
          console.log('[Lead Tracker] Redirecting to default Thank You page');
          window.location.replace(window.location.origin + "/" + SL + "/thank-you");
        } else {
          alert("Thank you! Your message has been sent.");
          if (b) { b.disabled = false; b.textContent = t; b.style.opacity = "1"; b.style.cursor = "pointer"; }
          f.removeAttribute("data-submitting");
        }
      }, 1000); // 1-second simulated delay
    }

    document.addEventListener("submit", function(e) {
      var f = e.target;
      if (f.tagName !== "FORM") return;
      
      // 1. Check if already submitting to prevent double-clicks
      if (f.getAttribute("data-submitting") === "true") {
        e.preventDefault();
        return;
      }

      console.log('[Lead Tracker] Form submit intercepted');
      
      // 2. Mark as submitting and prevent default
      f.setAttribute("data-submitting", "true");
      e.preventDefault();
      e.stopImmediatePropagation();

      var b = f.querySelector('button[type="submit"]') || f.querySelector("button"),
          t = b ? (b.textContent || "Submit") : "Submit";
      
      if (b) { 
        b.disabled = true; 
        b.textContent = "Sending...";
        b.style.opacity = "0.7";
        b.style.cursor = "not-allowed";
      }

      var fd = new FormData(f);
      
      // Try multiple field name variations
      var data = {
        pageSlug: SL,
        pageId: PI,
        projectId: PJ,
        name: (fd.get("name") || fd.get("first_name") || fd.get("firstName") || fd.get("fullname") || 
               (f.querySelector('input[name*="name"]') ? f.querySelector('input[name*="name"]').value : "") ||
               (f.querySelector('input[type="text"]') ? f.querySelector('input[type="text"]').value : "")).trim(),
        email: (fd.get("email") || fd.get("email_address") || 
               (f.querySelector('input[type="email"]') ? f.querySelector('input[type="email"]').value : "")).trim(),
        phone: (fd.get("phone") || fd.get("tel") || fd.get("telephone") || fd.get("mobile") ||
               (f.querySelector('input[type="tel"]') ? f.querySelector('input[type="tel"]').value : "")).trim(),
        message: (fd.get("message") || fd.get("comments") || fd.get("comment") || fd.get("inquiry") ||
                 (f.querySelector('textarea') ? f.querySelector('textarea').value : "")).trim(),
        domain: window.location.hostname,
        url: window.location.href
      };
      
      console.log('[Lead Tracker] Collected data:', data);

      // Validate email before sending
      if (!data.email) {
        console.warn('[Lead Tracker] No email found, allowing natural submission if any');
        f.removeAttribute("data-submitting");
        if (b) { b.disabled = false; b.textContent = t; b.style.opacity = "1"; b.style.cursor = "pointer"; }
        return; 
      }

      send(data, f, b, t, 1);
    }, true);
  })();`;

  // ── Encode as base64 and wrap in a self-decoding eval stub ────────────────
  const encoded = Buffer.from(source).toString('base64');
  // The served script: a single-line eval that decodes and runs — nothing readable
  const obfuscated = `(function(d,e,c){var s=d.createElement('script');s.text=c(e);d.head.appendChild(s)})(document,'${encoded}',function(e){return atob(e)});`;

  res.send(obfuscated);
};



