const express = require("express");
const router = express.Router();
const FormSchema = require("../models/FormSchema");
const { protect } = require("../middleware/authMiddleware");
const webhookController = require("../controllers/webhookController");

// GET schema for a project
router.get("/project/:project_id", async (req, res) => {
  try {
    const schema = await FormSchema.findOne({
      project_id: req.params.project_id
    });

    if (!schema) {
      return res.status(404).json({
        success: false,
        message: "No form schema found for this project"
      });
    }

    res.json({
      success: true,
      data: schema
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET schema for a page (by slug)
router.get("/page/:slug", async (req, res) => {
  try {
    const Page = require("../models/Page");
    const page = await Page.findOne({ slug: req.params.slug });

    if (!page) {
      return res.status(404).json({ success: false, message: "Page not found" });
    }

    const schema = await FormSchema.findOne({
      project_id: page.projectId
    });

    if (!schema) {
      return res.status(404).json({ success: false, message: "No form schema found" });
    }

    res.json({
      success: true,
      data: schema
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET schema for a page by page ID
router.get("/by-page-id/:pageId", async (req, res) => {
  try {
    let schema = await FormSchema.findOne({ page_id: req.params.pageId });
    if (!schema) {
      const Page = require("../models/Page");
      const page = await Page.findById(req.params.pageId);
      if (page) {
        schema = await FormSchema.findOne({ project_id: page.projectId });
      }
    }
    if (!schema) {
      return res.status(404).json({ success: false, message: "No form schema found" });
    }
    res.json({
      success: true,
      data: schema
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── WEBHOOK ROUTES ────────────────────────────────────────────────────────
// GET webhook config and logs for a FormSchema
router.get("/:id/webhook", protect, webhookController.getWebhookConfigAndLogs);

// PUT update webhook config for a FormSchema
router.put("/:id/webhook", protect, webhookController.updateWebhookConfig);

// POST trigger test webhook execution
router.post("/:id/webhook/test", protect, webhookController.testWebhook);

// POST resend a failed/past webhook log
router.post("/webhook-logs/:logId/resend", protect, webhookController.resendWebhook);

module.exports = router;
