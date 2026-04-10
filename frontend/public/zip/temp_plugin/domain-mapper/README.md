# Domain Mapper SaaS – WordPress Plugin

**Version:** 1.0.0  
**Requires WordPress:** 5.8+  
**Requires PHP:** 7.4+

---

## What it does

Reverse-proxies **DomainB** through **DomainA**, keeping DomainA in the visitor's browser at all times. Licence-gated via a SaaS API endpoint.

---

## File Structure

```
domain-mapper/
├── domain-mapper.php          # Main bootstrap, constants, loader
├── uninstall.php              # Clean removal of all plugin data
├── admin/
│   ├── admin.js               # AJAX: verify, flush cache, log viewer
│   └── settings-page.php      # WP Settings API page + AJAX handlers
└── includes/
    ├── class-api.php          # SaaS licence verification + cron sync
    ├── class-cache.php        # WP transient wrapper (page + API cache)
    ├── class-proxy.php        # HTTP proxy engine (wp_remote_request)
    └── class-rewriter.php     # HTML URL rewriter (DomainB → DomainA)
```

---

## Installation

1. Upload the `domain-mapper/` folder to `/wp-content/plugins/`.
2. Activate via **Plugins → Installed Plugins**.
3. Navigate to **Settings → Domain Mapper**.
4. Enter your **API Key**, **Source Domain (DomainA)**, and **Target Domain (DomainB)**.
5. Click **Verify Now** – the badge turns green on success.
6. Save Settings.

---

## Configuration

| Field | Description |
|---|---|
| API Key | Your SaaS licence key (`sk-…`). Stored securely, never exposed in HTML. |
| Source Domain (DomainA) | The domain visitors see (no scheme, e.g. `domaina.com`). |
| Target Domain (DomainB) | The domain being proxied (e.g. `domainb.com`). |
| Debug Mode | Writes timestamped entries to `wp-content/dm-debug.log`. |

---

## API Contract

The plugin POSTs to `https://your-saas.com/api/verify`:

```json
// Request body
{ "api_key": "sk-xxx", "domain": "domaina.com" }

// Expected response
{
  "status":     "active",
  "source_url": "https://domaina.com",
  "cache_time": 3600,
  "plan":       "pro"
}
```

Update `DM_API_ENDPOINT` in `domain-mapper.php` to point to your endpoint.

---

## Hooks & Filters

| Hook | Type | Description |
|---|---|---|
| `dm_proxy_should_intercept` | filter | Return `false` to disable proxying for a request. |
| `dm_before_rewrite` | filter | Pre-process HTML before URL rewriting. |
| `dm_after_rewrite` | filter | Post-process HTML after URL rewriting. |
| `dm_rewrite_tag_attr_map` | filter | Customise which tag/attribute pairs are rewritten. |
| `dm_proxy_request_args` | filter | Modify `wp_remote_request` args before the upstream call. |
| `dm_proxy_forward_headers` | filter | Add/remove headers forwarded to the target. |
| `dm_proxy_forward_cookies` | filter | Add/remove cookies forwarded to the target. |
| `dm_proxy_error_html` | filter | Override the 502 error page HTML. |

---

## Security

- **SSRF protection** – private IPs, localhost, and metadata endpoints are blocked.
- **Input sanitisation** – all settings values are sanitised and validated on save.
- **Nonce-protected** – all AJAX endpoints verify a WP nonce + `manage_options` capability.
- **API keys** – stored in a `no-autoload` option row; never output in HTML.
- **Sensitive headers** – `X-Frame-Options`, CSP, and HSTS stripped from upstream responses.

---

## Debug Log

Enable **Debug Mode** in settings. Logs are written to:

```
wp-content/dm-debug.log
```

Use the **View Log** / **Clear Log** buttons in the admin UI, or read directly via SSH.

---

## Cron

An hourly WP-Cron event (`dm_hourly_sync`) re-verifies the licence and refreshes the API cache. If the site has no traffic, ensure WP-Cron is triggered by a real cron job:

```
*/5 * * * * wget -q -O /dev/null https://domaina.com/wp-cron.php?doing_wp_cron
```

---

## Changelog

### 1.0.0
- Initial release.
