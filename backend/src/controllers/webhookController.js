const FormSchema = require("../models/FormSchema");
const WebhookLog = require("../models/WebhookLog");
const { validateWebhookUrl } = require("../utils/ssrfGuard");
const { dispatchWebhook, executeWebhookDelivery } = require("../services/webhookQueue");
const logger = require("../utils/logger");

/**
 * @desc    Get Webhook config and recent logs for a FormSchema
 * @route   GET /api/forms/:id/webhook
 * @access  Private
 */
exports.getWebhookConfigAndLogs = async (req, res) => {
  try {
    const { id } = req.params;
    const formSchema = await FormSchema.findById(id);

    if (!formSchema) {
      return res.status(404).json({ success: false, message: "Form schema not found" });
    }

    const logs = await WebhookLog.find({ formId: id })
      .sort({ createdAt: -1 })
      .limit(50);

    return res.json({
      success: true,
      data: {
        webhook: formSchema.webhook || {
          enabled: false,
          url: "",
          method: "POST",
          headers: [],
          secret: ""
        },
        logs
      }
    });
  } catch (err) {
    logger.error("Error fetching webhook config:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Update Webhook config for a FormSchema
 * @route   PUT /api/forms/:id/webhook
 * @access  Private
 */
exports.updateWebhookConfig = async (req, res) => {
  try {
    const { id } = req.params;
    const { enabled, url, method, headers, secret, applyToAllPages = true } = req.body;

    // Validate URL if enabled
    if (enabled && url) {
      const validation = validateWebhookUrl(url);
      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          message: `Invalid Webhook URL: ${validation.error}`
        });
      }
    }

    const formSchema = await FormSchema.findById(id);
    if (!formSchema) {
      return res.status(404).json({ success: false, message: "Form schema not found" });
    }

    // Clean headers array
    const cleanHeaders = Array.isArray(headers)
      ? headers.filter(h => h && h.key && h.key.trim() !== "")
      : [];

    formSchema.webhook = {
      enabled: Boolean(enabled),
      url: (url || "").trim(),
      method: ["POST", "PUT"].includes(method) ? method : "POST",
      headers: cleanHeaders,
      secret: (secret || "").trim()
    };

    await formSchema.save();

    // If applyToAllPages is enabled, update all pages in the same project
    if (applyToAllPages && formSchema.project_id) {
      await FormSchema.updateMany(
        { project_id: formSchema.project_id },
        { $set: { webhook: formSchema.webhook } }
      );
    }

    return res.json({
      success: true,
      message: applyToAllPages ? "Webhook settings saved for all project pages" : "Webhook configuration saved successfully",
      data: { webhook: formSchema.webhook }
    });
  } catch (err) {
    logger.error("Error updating webhook config:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Send a test webhook payload
 * @route   POST /api/forms/:id/webhook/test
 * @access  Private
 */
exports.testWebhook = async (req, res) => {
  try {
    const { id } = req.params;
    const { url, method, headers, secret } = req.body;

    const formSchema = await FormSchema.findById(id);
    if (!formSchema) {
      return res.status(404).json({ success: false, message: "Form schema not found" });
    }

    // Use passed config if provided, otherwise fallback to formSchema saved config
    const targetUrl = url || formSchema.webhook?.url;
    const targetMethod = method || formSchema.webhook?.method || "POST";
    const targetHeaders = headers || formSchema.webhook?.headers || [];
    const targetSecret = secret !== undefined ? secret : formSchema.webhook?.secret;

    if (!targetUrl) {
      return res.status(400).json({ success: false, message: "Webhook URL is required for testing" });
    }

    // SSRF Validation
    const validation = validateWebhookUrl(targetUrl);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: `Security Check Failed: ${validation.error}`
      });
    }

    const testPayload = {
      event: "form.test_submission",
      formId: formSchema._id,
      pageId: formSchema.page_id,
      projectId: formSchema.project_id,
      timestamp: new Date().toISOString(),
      leadData: {
        full_name: "Test User",
        email: "test.lead@example.com",
        phone: "+1 (555) 019-2834",
        message: "This is a test lead submission from PageCraft Webhook Tester."
      },
      meta: {
        isTest: true,
        source: "PageCraft Admin Dashboard"
      }
    };

    const webhookConfig = {
      enabled: true,
      url: targetUrl,
      method: targetMethod,
      headers: targetHeaders,
      secret: targetSecret
    };

    const log = await dispatchWebhook({
      formId: formSchema._id,
      leadId: null,
      webhookConfig,
      payload: testPayload,
      isTest: true
    });

    // Give asynchronous delivery 1.5s to complete for immediate UI feedback in test mode
    await new Promise(resolve => setTimeout(resolve, 1500));

    const updatedLog = await WebhookLog.findById(log._id);

    return res.json({
      success: true,
      message: updatedLog?.deliveryStatus === "success" ? "Test webhook delivered successfully!" : "Test webhook dispatch completed.",
      data: { log: updatedLog || log }
    });
  } catch (err) {
    logger.error("Error executing test webhook:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Resend a failed or past webhook delivery
 * @route   POST /api/forms/webhook-logs/:logId/resend
 * @access  Private
 */
exports.resendWebhook = async (req, res) => {
  try {
    const { logId } = req.params;
    const log = await WebhookLog.findById(logId);

    if (!log) {
      return res.status(404).json({ success: false, message: "Webhook log not found" });
    }

    const formSchema = await FormSchema.findById(log.formId);
    if (!formSchema) {
      return res.status(404).json({ success: false, message: "Form schema not found for this log" });
    }

    // SSRF Check
    const validation = validateWebhookUrl(log.url);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: `Security Check Failed: ${validation.error}`
      });
    }

    const jobData = {
      logId: log._id.toString(),
      formId: formSchema._id.toString(),
      leadId: log.leadId ? log.leadId.toString() : null,
      url: log.url,
      method: log.method,
      headers: formSchema.webhook?.headers || [],
      payload: log.requestPayload,
      secret: formSchema.webhook?.secret || "",
      idempotencyKey: `resend_${log._id}_${Date.now()}`,
      isTest: log.isTest
    };

    // Re-execute delivery directly
    const result = await executeWebhookDelivery(jobData, (log.attempts || 1) + 1);
    const updatedLog = await WebhookLog.findById(logId);

    return res.json({
      success: true,
      message: result.success ? "Webhook resent successfully!" : `Resend attempt completed with status ${result.responseStatus}`,
      data: { log: updatedLog }
    });
  } catch (err) {
    logger.error("Error resending webhook:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
