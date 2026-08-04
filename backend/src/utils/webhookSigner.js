const crypto = require("crypto");

/**
 * Generates an HMAC-SHA256 signature for a webhook payload.
 * @param {object|string} payload
 * @param {string} secret
 * @param {number} timestamp
 * @returns {string} hex signature
 */
function generateWebhookSignature(payload, secret, timestamp) {
  const secretKey = secret || process.env.WEBHOOK_GLOBAL_SECRET || "fallback-webhook-secret-key";
  const stringifiedPayload = typeof payload === "string" ? payload : JSON.stringify(payload);
  const signaturePayload = `${timestamp}.${stringifiedPayload}`;

  return crypto
    .createHmac("sha256", secretKey)
    .update(signaturePayload)
    .digest("hex");
}

/**
 * Sanitizes and masks sensitive headers for safe persistence in WebhookLogs.
 * @param {Array<{key: string, value: string}>|object} headers
 * @returns {object} Clean key-value object with masked sensitive header values
 */
function maskSensitiveHeaders(headers) {
  const SENSITIVE_KEYS = ["authorization", "auth", "token", "secret", "x-api-key", "api-key", "apikey", "password", "bearer"];
  const masked = {};

  if (Array.isArray(headers)) {
    headers.forEach(h => {
      if (!h || !h.key) return;
      const lowerKey = h.key.toLowerCase().trim();
      const isSensitive = SENSITIVE_KEYS.some(k => lowerKey.includes(k));
      masked[h.key] = isSensitive ? "********" : h.value;
    });
  } else if (headers && typeof headers === "object") {
    Object.keys(headers).forEach(key => {
      const lowerKey = key.toLowerCase().trim();
      const isSensitive = SENSITIVE_KEYS.some(k => lowerKey.includes(k));
      masked[key] = isSensitive ? "********" : headers[key];
    });
  }

  return masked;
}

module.exports = {
  generateWebhookSignature,
  maskSensitiveHeaders
};
