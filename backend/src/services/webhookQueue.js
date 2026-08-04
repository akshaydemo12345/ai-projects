const { Queue, Worker } = require("bullmq");
const ioredis = require("ioredis");
const axios = require("axios");
const WebhookLog = require("../models/WebhookLog");
const { validateWebhookUrl } = require("../utils/ssrfGuard");
const { generateWebhookSignature, maskSensitiveHeaders } = require("../utils/webhookSigner");
const logger = require("../utils/logger");

const REDIS_HOST = process.env.REDIS_HOST || "127.0.0.1";
const REDIS_PORT = parseInt(process.env.REDIS_PORT || "6379", 10);
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || undefined;

// Redis connection options
const redisConnection = new ioredis({
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASSWORD,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  lazyConnect: true
});

let webhookQueue = null;
let webhookWorker = null;
let redisAvailable = false;

// Attempt to connect to Redis
redisConnection
  .connect()
  .then(() => {
    redisAvailable = true;
    console.log("✅ Redis connected for Webhook Queue");

    // Initialize BullMQ Queue
    webhookQueue = new Queue("webhookDeliveryQueue", {
      connection: redisConnection,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 2000 // 2s, 4s, 8s
        },
        removeOnComplete: 500, // Keep last 500 completed jobs in queue
        removeOnFail: 1000
      }
    });

    // Initialize BullMQ Worker
    webhookWorker = new Worker(
      "webhookDeliveryQueue",
      async job => {
        return await executeWebhookDelivery(job.data, job.attemptsMade + 1);
      },
      { connection: redisConnection, concurrency: 5 }
    );

    webhookWorker.on("completed", job => {
      logger.info(`Webhook Job ${job.id} completed successfully`);
    });

    webhookWorker.on("failed", (job, err) => {
      logger.error(`Webhook Job ${job?.id} failed after attempts: ${err.message}`);
    });
  })
  .catch(err => {
    console.warn("⚠️ Redis connection failed for Webhook Queue. Falling back to direct execution.", err.message);
    redisAvailable = false;
  });

/**
 * Core function to deliver a webhook payload over HTTP/HTTPS.
 * Updates WebhookLog with attempt result.
 */
async function executeWebhookDelivery(data, attemptNumber = 1) {
  const { logId, formId, leadId, url, method, headers, payload, secret, idempotencyKey, isTest } = data;

  // 1. SSRF Validation
  const validation = validateWebhookUrl(url);
  if (!validation.valid) {
    const errorMsg = `SSRF Guard blocked execution: ${validation.error}`;
    await WebhookLog.findByIdAndUpdate(logId, {
      deliveryStatus: "failed",
      responseStatus: 400,
      attempts: attemptNumber,
      error: errorMsg
    });
    throw new Error(errorMsg); // Stop execution
  }

  // 2. Prepare headers
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = generateWebhookSignature(payload, secret, timestamp);

  const requestHeaders = {
    "Content-Type": "application/json",
    "User-Agent": "PageCraft-Webhook-Dispatcher/1.0",
    "X-Webhook-Signature": signature,
    "X-Webhook-Timestamp": timestamp.toString(),
    "X-Webhook-Event": isTest ? "form.test_submission" : "form.lead_submitted",
    "X-Idempotency-Key": idempotencyKey
  };

  // Add custom user headers
  if (Array.isArray(headers)) {
    headers.forEach(h => {
      if (h.key && h.value) {
        requestHeaders[h.key] = h.value;
      }
    });
  } else if (headers && typeof headers === "object") {
    Object.assign(requestHeaders, headers);
  }

  const maskedHeaders = maskSensitiveHeaders(requestHeaders);

  // 3. Make Outbound HTTP Call
  let responseStatus = 0;
  let responseBody = "";
  let deliveryStatus = "pending";
  let errorMsg = "";

  try {
    const response = await axios({
      method: method || "POST",
      url: url,
      data: payload,
      headers: requestHeaders,
      timeout: 10000, // 10s timeout
      validateStatus: () => true // Handle status codes manually
    });

    responseStatus = response.status;
    responseBody = typeof response.data === "object" ? JSON.stringify(response.data).slice(0, 5000) : String(response.data).slice(0, 5000);

    if (responseStatus >= 200 && responseStatus < 300) {
      deliveryStatus = "success";
    } else if (responseStatus >= 400 && responseStatus < 500) {
      // 4xx Client Error: Non-retryable
      deliveryStatus = "failed";
      errorMsg = `HTTP Client Error ${responseStatus}`;
    } else {
      // 5xx Server Error
      deliveryStatus = "failed";
      errorMsg = `HTTP Server Error ${responseStatus}`;
    }
  } catch (err) {
    deliveryStatus = "failed";
    errorMsg = err.message || "Network Error / Connection Timeout";
    responseBody = errorMsg;
  }

  // 4. Update WebhookLog
  await WebhookLog.findByIdAndUpdate(logId, {
    url,
    method,
    requestHeaders: maskedHeaders,
    requestPayload: payload,
    responseStatus,
    responseBody,
    deliveryStatus,
    attempts: attemptNumber,
    error: errorMsg
  });

  // If 5xx or network error and we haven't reached max attempts in BullMQ worker, throw error so BullMQ retries
  if (deliveryStatus === "failed" && (responseStatus >= 500 || responseStatus === 0)) {
    throw new Error(errorMsg);
  }

  return { success: deliveryStatus === "success", responseStatus, responseBody, error: errorMsg };
}

/**
 * Dispatcher function invoked by Lead submission or Test button.
 */
async function dispatchWebhook({ formId, leadId = null, webhookConfig, payload, isTest = false }) {
  if (!webhookConfig || !webhookConfig.enabled || !webhookConfig.url) {
    return null;
  }

  const { url, method = "POST", headers = [], secret = "" } = webhookConfig;

  // SSRF pre-check
  const validation = validateWebhookUrl(url);
  if (!validation.valid) {
    // Create immediate failed log
    const idempotencyKey = `webhook_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const log = await WebhookLog.create({
      formId,
      leadId,
      url,
      method,
      requestHeaders: maskSensitiveHeaders(headers),
      requestPayload: payload,
      deliveryStatus: "failed",
      responseStatus: 400,
      attempts: 1,
      error: `SSRF Guard blocked dispatch: ${validation.error}`,
      idempotencyKey,
      isTest
    });
    return log;
  }

  const idempotencyKey = `wh_${leadId || "test"}_${Date.now()}`;

  // 1. Create Initial WebhookLog (Pending state)
  const log = await WebhookLog.create({
    formId,
    leadId,
    url,
    method,
    requestHeaders: maskSensitiveHeaders(headers),
    requestPayload: payload,
    deliveryStatus: "pending",
    attempts: 0,
    idempotencyKey,
    isTest
  });

  const jobData = {
    logId: log._id.toString(),
    formId,
    leadId: leadId ? leadId.toString() : null,
    url,
    method,
    headers,
    payload,
    secret,
    idempotencyKey,
    isTest
  };

  // 2. Enqueue in BullMQ if Redis is operational
  if (redisAvailable && webhookQueue) {
    try {
      await webhookQueue.add("deliverWebhook", jobData, {
        jobId: idempotencyKey
      });
      return log;
    } catch (queueErr) {
      console.warn("⚠️ Queue enqueue failed, switching to inline execution:", queueErr.message);
    }
  }

  // Fallback to inline asynchronous execution (does NOT await blocking the main request)
  setImmediate(async () => {
    try {
      await executeWebhookDelivery(jobData, 1);
    } catch (err) {
      logger.error("Inline webhook execution error:", err.message);
    }
  });

  return log;
}

module.exports = {
  dispatchWebhook,
  executeWebhookDelivery
};
