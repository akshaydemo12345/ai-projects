const mongoose = require("mongoose");

const WebhookLogSchema = new mongoose.Schema(
  {
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FormSchema",
      required: true,
      index: true
    },
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      default: null,
      index: true
    },
    url: {
      type: String,
      required: true
    },
    method: {
      type: String,
      enum: ["POST", "PUT"],
      default: "POST"
    },
    requestHeaders: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    requestPayload: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    responseStatus: {
      type: Number,
      default: 0
    },
    responseBody: {
      type: String,
      default: ""
    },
    deliveryStatus: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
      index: true
    },
    attempts: {
      type: Number,
      default: 1
    },
    error: {
      type: String,
      default: ""
    },
    idempotencyKey: {
      type: String,
      required: true,
      index: true
    },
    isTest: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// TTL Index: Auto-delete logs after 30 days (2,592,000 seconds)
WebhookLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

module.exports = mongoose.model("WebhookLog", WebhookLogSchema);
