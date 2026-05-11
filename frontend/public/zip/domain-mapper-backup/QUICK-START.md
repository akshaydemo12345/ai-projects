## Quick Setup Reference

### Configuration Summary

```
WordPress Site:     http://my-wordpress-site.test/
Backend API:        http://127.0.0.1:5000/
Proxy Path:         /p/{slug}
Example URL:        http://my-wordpress-site.test/p/my-page
```

---

### Step 1: Start Backend (Terminal 1)

```bash
cd /var/www/html/circle-animation/landing-page-ai-builder/backend
npm install
npm start
```

Backend will run on: `http://127.0.0.1:5000`

---

### Step 2: Verify Backend is Running

```bash
# Test API health
curl http://127.0.0.1:5000/

# Expected response:
# {"message":"AI Landing Page API is running"}
```

---

### Step 3: Configure WordPress Plugin

Go to **WordPress Admin → Settings → Domain Mapper SaaS**

**Enter these values:**

| Field | Value |
|-------|-------|
| API Key | `http://127.0.0.1:5000@@your-unique-plugin-token-here` |
| Source Domain | `my-wordpress-site.test` |
| Target Domain | `127.0.0.1:5000` |
| Allowed Paths | `/p/` |
| Cache Time | `300` |
| Status | `active` |
| Debug Mode | ✓ checked |

**Then click:** "Apply .htaccess Rules"

---

### Step 4: Create & Publish a Page

Use the backend dashboard or API:

```bash
# 1. Create page (with JWT token)
curl -X POST http://127.0.0.1:5000/pages \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Landing Page",
    "slug": "my-page",
    "content": {"title": "Hello World"}
  }'

# 2. Publish page
curl -X POST http://127.0.0.1:5000/pages/PAGE_ID/publish \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "domain": "my-wordpress-site.test"
  }'
```

---

### Step 5: Test Integration

**Direct backend (no proxy):**
```bash
curl http://127.0.0.1:5000/p/my-page
```

**Through WordPress proxy:**
```bash
curl http://my-wordpress-site.test/p/my-page
```

**Both URLs should return the same page content.**

---

### Troubleshooting

**Plugin verify endpoint returns 401:**
- Check API token format is correct
- Verify page exists and is published
- Confirm domain matches page domain

**404 on page endpoint:**
- Create and publish a page first
- Check slug matches what you're requesting

**.htaccess not working:**
```bash
# Verify mod_rewrite is enabled
apache2ctl -M | grep rewrite

# Check .htaccess syntax
apache2ctl configtest

# Enable mod_rewrite if needed
sudo a2enmod rewrite
sudo systemctl reload apache2
```

**Can't reach WordPress:**
- Add to `/etc/hosts`: `127.0.0.1 my-wordpress-site.test`
- Verify Apache vhost is configured

---

### Test Integration Script

```bash
cd "/var/www/html/Wordpress Projects/wp-content/plugins/domain-mapper"
./test-integration.sh
```

This runs comprehensive tests of all components.

---

### How It Works

```
1. User visits:    http://my-wordpress-site.test/p/my-page
                   ↓
2. Apache/WordPress catches /p/* pattern
                   ↓
3. Domain Mapper plugin intercepts request
                   ↓
4. Plugin calls:   POST http://127.0.0.1:5000/plugin/verify
                   with api_key & domain
                   ↓
5. Backend verifies token & checks page exists
                   ↓
6. If valid:       Plugin proxies to: http://127.0.0.1:5000/p/my-page
                   ↓
7. Backend returns: JSON with page content
                   ↓
8. Plugin renders:  Page displayed on WordPress
                   ↓
9. Browser shows:  http://my-wordpress-site.test/p/my-page
                   (URL never changes - stays on WordPress domain)
```

---

### Environment Variables

**Backend (.env):**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ai-landing-page
FRONTEND_URL=http://my-wordpress-site.test/
PLUGIN_API_TOKEN=your-unique-plugin-token-here
```

**WordPress Plugin Settings (via Admin UI):**
- API Key: `http://127.0.0.1:5000@@your-unique-plugin-token-here`
- Source Domain: `my-wordpress-site.test`
- Target Domain: `127.0.0.1:5000`

---

### Logs

**Backend logs:**
```bash
tail -f /var/www/html/circle-animation/landing-page-ai-builder/backend/logs/*.log
```

**WordPress plugin debug:**
```bash
tail -f "/var/www/html/Wordpress Projects/wp-content/dm-debug.log"
```

**Apache error log:**
```bash
sudo tail -f /var/log/apache2/error.log
```

---

### Port Forwarding (if needed)

If backend and WordPress are on different machines:

**On backend server machine:**
```bash
ssh -R 3000:localhost:5000 user@wordpress-machine
```

Then use: `http://remote-backend-host:3000` in plugin settings

---

For detailed setup guide, see: `SETUP-GUIDE.md`
