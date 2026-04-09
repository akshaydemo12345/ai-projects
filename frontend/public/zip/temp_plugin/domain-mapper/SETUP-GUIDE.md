# Domain Mapper + AI Backend Integration Setup

This guide shows how to set up the WordPress Domain Mapper plugin to proxy requests from `http://my-wordpress-site.test/{slug}` to the AI backend at `http://127.0.0.1:5000/p/{slug}`.

## Architecture

```
User Request
    ↓
http://my-wordpress-site.test/{slug}
    ↓
WordPress Domain Mapper Plugin (verifies API token)
    ↓
Backend Verification: POST http://127.0.0.1:5000/plugin/verify
    ↓
If verified → Proxy to: http://127.0.0.1:5000/p/{slug}
    ↓
Page Content Displayed
```

---

## Step 1: Configure Backend

### Backend `.env` File

Update `/var/www/html/circle-animation/landing-page-ai-builder/backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ai-landing-page
JWT_SECRET=lumina_ai_super_secret_key_123
SESSION_SECRET=lumina_ai_session_secret_456

# WordPress Plugin Configuration
FRONTEND_URL=http://my-wordpress-site.test/
PLUGIN_API_TOKEN=your-unique-plugin-token-here
```

### Start Backend Server

```bash
cd /var/www/html/circle-animation/landing-page-ai-builder/backend
npm install
npm start
# Server will run on http://127.0.0.1:5000/
```

---

## Step 2: WordPress Plugin Configuration

### 2a. Access Plugin Settings

1. Go to **WordPress Admin Dashboard**
2. Navigate to **Settings → Domain Mapper SaaS**

### 2b. Configure Plugin Settings

Fill in these fields:

| Setting | Value |
|---------|-------|
| **API Key** | `http://127.0.0.1:5000@@your-unique-plugin-token-here` |
| **Source Domain** | `my-wordpress-site.test` |
| **Target Domain** | `127.0.0.1:5000` |
| **Allowed Paths** | `/p/` (or use `*` to allow all) |
| **Cache Time** | `300` (seconds) |
| **Status** | `Active` |

### 2c. Apply Rewrite Rules

After saving settings:

1. Click **"Apply .htaccess Rules"** button
2. Verify `.htaccess` file was updated in WordPress root
3. Test the rewrite rules

---

## Step 3: Create AI Pages in Backend

### 3a. Create Page via Backend API

```bash
curl -X POST http://127.0.0.1:5000/pages \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Landing Page",
    "slug": "my-page",
    "content": { /* page content */ }
  }'
```

### 3b. Publish Page

```bash
curl -X POST http://127.0.0.1:5000/pages/{PAGE_ID}/publish \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "my-wordpress-site.test"
  }'
```

---

## Step 4: Verify Integration

### Test Public Endpoint (No Proxy)

```bash
curl http://127.0.0.1:5000/p/my-page
```

Expected Response:
```json
{
  "status": "success",
  "data": {
    "page": {
      "title": "My Landing Page",
      "slug": "my-page",
      "content": { ... },
      "publishedAt": "2026-04-07T10:00:00Z"
    }
  }
}
```

### Test Plugin Verification

```bash
curl -X POST http://127.0.0.1:5000/plugin/verify \
  -H "Content-Type: application/json" \
  -d '{
    "api_key": "your-unique-plugin-token-here",
    "domain": "my-wordpress-site.test"
  }'
```

Expected Response:
```json
{
  "status": "success",
  "valid": true,
  "message": "Plugin verified",
  "data": {
    "page": {
      "title": "My Landing Page",
      "slug": "my-page",
      "content": { ... }
    }
  }
}
```

### Test WordPress Proxy

Navigate to: `http://my-wordpress-site.test/p/my-page`

This should:
1. Trigger WordPress rewrite rules
2. Call plugin verify endpoint
3. If token is valid → display page content from backend
4. If token is invalid → show 401 error

---

## Step 5: Troubleshooting

### Check Plugin Logs

```bash
tail -f /var/www/html/Wordpress\ Projects/wp-content/dm-debug.log
```

### Debug Rewrite Rules

Add to WordPress `wp-config.php`:

```php
define( 'WP_DEBUG', true );
define( 'DM_DEBUG', true );
define( 'WP_DEBUG_LOG', WP_CONTENT_DIR . '/debug.log' );
```

### Test .htaccess Manually

```bash
# Check if mod_rewrite is enabled
apache2ctl -M | grep rewrite

# Verify .htaccess syntax
apache2ctl configtest
```

### Common Issues

| Issue | Solution |
|-------|----------|
| Plugin verify returns 401 | Check API token in plugin settings matches backend |
| 404 Not Found on `/p/{slug}` | Verify page exists and is published in backend |
| .htaccess not working | Enable `AllowOverride All` in Apache config |
| CORS errors | Backend already has CORS configured for WordPress domain |

---

## Step 6: Production Deployment

### For Production Domain

Update `.env` and plugin settings:

```env
FRONTEND_URL=https://your-wordpress-site.com/
PLUGIN_API_TOKEN=generate-strong-token-here
```

### Install SSL Certificate

```bash
# Using Let's Encrypt
certbot certonly --webroot -w /var/www/html/circle-animation/landing-page-ai-builder/backend -d your-backend-domain.com
```

### Update Apache Virtual Host

```apache
<VirtualHost *:443>
    ServerName api.your-domain.com
    SSLEngine on
    SSLCertificateFile /path/to/cert.pem
    
    ProxyPreserveHost On
    ProxyPass / http://127.0.0.1:5000/
    ProxyPassReverse / http://127.0.0.1:5000/
</VirtualHost>
```

---

## API Token Format

The plugin accepts two API token formats:

**Format 1: Simple Token**
```
your-unique-plugin-token-here
```
Uses default endpoint: `http://localhost:5000/plugin/verify`

**Format 2: Custom Endpoint**
```
http://127.0.0.1:5000@@your-unique-plugin-token-here
```
Uses custom verification endpoint

Either can be base64-encoded for additional obfuscation.

---

## How It Works

1. **User visits**: `http://my-wordpress-site.test/p/my-page`
2. **WordPress rewrite rule** catches `/p/*` requests
3. **Domain Mapper plugin** intercepts before WordPress processes request
4. **Plugin calls**: `POST http://127.0.0.1:5000/plugin/verify` with API token
5. **Backend verifies** token and checks page exists and is published
6. **If valid**: Plugin proxies request to `http://127.0.0.1:5000/p/my-page`
7. **Backend returns** JSON with page content
8. **Plugin renders** content in WordPress frontend
9. **Browser sees** the page served from `http://my-wordpress-site.test/p/my-page` (URL never changes)

---

## Environment Variables Reference

### Backend

```env
PORT=5000                                    # Backend port
MONGO_URI=mongodb://localhost:27017/...     # MongoDB connection
FRONTEND_URL=http://my-wordpress-site.test/ # WordPress site URL
PLUGIN_API_TOKEN=your-token                 # Token for verification
```

### WordPress Plugin Settings

```
API Key:         http://127.0.0.1:5000@@your-token
Source Domain:   my-wordpress-site.test
Target Domain:   127.0.0.1:5000
Allowed Paths:   /p/
Cache Time:      300
Status:          Active
```

---

For more details, see the Domain Mapper plugin README.md
