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

    function send(d, f, b, t, n) {
      n = n || 1;
      fetch((A ? A : "") + "/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(d),
        mode: "cors"
      })
      .then(function(r) { return r.json() })
      .then(function(r) {
        if (r.status === "success") {
          f.reset();
          // Redirect to the dedicated thank-you page
          if (SL) {
            window.location.href = window.location.origin + "/" + SL + "/thank-you";
          } else {
            alert("Thank you! Your message has been sent.");
          }
        } else throw new Error(r.message || "Error")
      })
      .catch(function(e) {
        if (n < 3) {
          if (b) b.textContent = "Retrying...";
          setTimeout(function() { send(d, f, b, t, n + 1) }, 2000);
        } else {
          alert("Failed: " + e.message);
          if (b) { b.disabled = false; b.textContent = t; }
        }
      })
    }

    document.addEventListener("submit", function(e) {
      var f = e.target;
      if (f.tagName !== "FORM") return;
      e.preventDefault();
      var b = f.querySelector('button[type="submit"]') || f.querySelector("button"),
          t = b ? (b.textContent || "Submit") : "Submit";
      if (b) { b.disabled = true; b.textContent = "Sending..." }
      var fd = new FormData(f);
      var data = {
        pageSlug: SL,
        pageId: PI,
        projectId: PJ,
        name: fd.get("name") || fd.get("first_name") || (f.querySelector('input[type="text"]') ? f.querySelector('input[type="text"]').value : ""),
        email: fd.get("email") || (f.querySelector('input[type="email"]') ? f.querySelector('input[type="email"]').value : ""),
        phone: fd.get("phone") || fd.get("tel") || (f.querySelector('input[type="tel"]') ? f.querySelector('input[type="tel"]').value : ""),
        message: fd.get("message") || fd.get("comments") || (f.querySelector('textarea') ? f.querySelector('textarea').value : "")
      };
      send(data, f, b, t, 1);
    })
  })();`;

  // ── Encode as base64 and wrap in a self-decoding eval stub ────────────────
  const encoded = Buffer.from(source).toString('base64');
  // The served script: a single-line eval that decodes and runs — nothing readable
  const obfuscated = `(function(d,e,c){var s=d.createElement('script');s.text=c(e);d.head.appendChild(s)})(document,'${encoded}',function(e){return atob(e)});`;

  res.send(obfuscated);
};



