const { URL } = require("url");
const net = require("net");

/**
 * Checks if a given IP address is private, loopback, or link-local.
 * @param {string} ip
 * @returns {boolean}
 */
function isPrivateIp(ip) {
  if (!ip) return false;

  // IPv4 Checks
  if (net.isIPv4(ip)) {
    const parts = ip.split(".").map(Number);
    // 127.0.0.0/8 (Loopback)
    if (parts[0] === 127) return true;
    // 10.0.0.0/8 (Private)
    if (parts[0] === 10) return true;
    // 172.16.0.0/12 (Private)
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
    // 192.168.0.0/16 (Private)
    if (parts[0] === 192 && parts[1] === 168) return true;
    // 169.254.0.0/16 (Link-local)
    if (parts[0] === 169 && parts[1] === 254) return true;
    // 0.0.0.0/8 (Current network)
    if (parts[0] === 0) return true;
  }

  // IPv6 Checks
  if (net.isIPv6(ip)) {
    const lower = ip.toLowerCase();
    // ::1 (Loopback)
    if (lower === "::1" || lower === "0:0:0:0:0:0:0:1") return true;
    // fe80::/10 (Link-local)
    if (lower.startsWith("fe80:")) return true;
    // fc00::/7 (Unique local address)
    if (lower.startsWith("fc00:") || lower.startsWith("fd00:")) return true;
  }

  return false;
}

/**
 * Validates a target URL against SSRF vulnerabilities.
 * @param {string} urlString
 * @returns {{ valid: boolean, error?: string, parsedUrl?: URL }}
 */
function validateWebhookUrl(urlString) {
  if (!urlString || typeof urlString !== "string") {
    return { valid: false, error: "Target URL is required" };
  }

  let parsed;
  try {
    parsed = new URL(urlString);
  } catch (e) {
    return { valid: false, error: "Invalid URL format" };
  }

  // Protocol check
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { valid: false, error: "URL protocol must be HTTP or HTTPS" };
  }

  // Host check
  const hostname = parsed.hostname.toLowerCase();

  // Forbidden hostname patterns
  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal") ||
    hostname === "metadata.google.internal" ||
    hostname === "169.254.169.254"
  ) {
    // Allow localhost in non-production development testing ONLY if explicitly allowed
    if (process.env.ALLOW_LOCAL_WEBHOOKS === "true") {
      return { valid: true, parsedUrl: parsed };
    }
    return { valid: false, error: "Local or internal hosts are restricted for security reasons" };
  }

  // Direct IP check
  if (isPrivateIp(hostname)) {
    if (process.env.ALLOW_LOCAL_WEBHOOKS === "true") {
      return { valid: true, parsedUrl: parsed };
    }
    return { valid: false, error: "Private or loopback IP ranges are restricted" };
  }

  return { valid: true, parsedUrl: parsed };
}

module.exports = {
  validateWebhookUrl,
  isPrivateIp
};
