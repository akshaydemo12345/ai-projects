<?php
/**
 * Domain Mapper Plugin Configuration Template
 * 
 * This file contains the recommended settings for the Domain Mapper plugin
 * to work with the AI Landing Page Backend.
 * 
 * USAGE:
 * 1. Go to WordPress Admin → Settings → Domain Mapper SaaS
 * 2. Fill in the fields below
 * 3. Click "Apply .htaccess Rules"
 * 4. Test the integration
 */

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURATION FOR LOCAL/DEVELOPMENT SETUP
// ─────────────────────────────────────────────────────────────────────────────

$DM_SETTINGS_DEV = [
    'api_key'       => 'http://127.0.0.1:5000@@your-unique-plugin-token-here',
    // OR format: 'your-unique-plugin-token-here'
    // (defaults to http://localhost:5000/plugin/verify)
    
    'source_domain' => 'my-wordpress-site.test',
    // The domain where WordPress is hosted (where users visit)
    
    'target_domain' => '127.0.0.1:5000',
    // The backend API server that serves the pages
    
    'allowed_paths' => '/p/',
    // Rewrite rules only apply to these paths
    // Examples: /p/, /pages/, /* (for all paths)
    
    'cache_time'    => 300,
    // How long to cache API verification results (seconds)
    
    'status'        => 'active',
    // 'active' or 'inactive'
    
    'debug_mode'    => true,
    // Enable detailed logging to dm-debug.log
    
    'plan'          => 'dev',
    // Free tier plan
];

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURATION FOR PRODUCTION SETUP
// ─────────────────────────────────────────────────────────────────────────────

$DM_SETTINGS_PROD = [
    'api_key'       => 'https://api.your-domain.com@@generate-a-strong-token-here',
    // Production backend API with HTTPS
    
    'source_domain' => 'your-wordpress-site.com',
    // Your production WordPress domain
    
    'target_domain' => 'api.your-domain.com',
    // Your production backend domain (must match SSL cert)
    
    'allowed_paths' => '/p/',
    // Only proxy /p/* routes
    
    'cache_time'    => 600,
    // Longer cache time for production
    
    'status'        => 'active',
    
    'debug_mode'    => false,
    // Disable debug logging in production
    
    'plan'          => 'pro',
    // Production plan
];

// ─────────────────────────────────────────────────────────────────────────────
// STEP-BY-STEP SETUP INSTRUCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/*

STEP 1: Install Domain Mapper Plugin
─────────────────────────────────────
  a) Upload /domain-mapper/ to wp-content/plugins/
  b) Go to WordPress Admin → Plugins
  c) Activate "Domain Mapper SaaS"

STEP 2: Configure Backend
──────────────────────────
  a) Update backend/.env:
     FRONTEND_URL=http://my-wordpress-site.test/
     PLUGIN_API_TOKEN=your-unique-plugin-token-here
  
  b) Start backend server:
     npm start
  
  c) Verify endpoint is accessible:
     curl http://127.0.0.1:5000/plugin/verify

STEP 3: Configure Plugin
────────────────────────
  a) Go to WordPress Admin → Settings → Domain Mapper SaaS
  
  b) Fill in these fields:
     
     Field                  | Value
     ─────────────────────────────────────────────────────────────
     API Key                | http://127.0.0.1:5000@@your-unique-plugin-token-here
     Source Domain          | my-wordpress-site.test
     Target Domain          | 127.0.0.1:5000
     Allowed Paths          | /p/
     Cache Time (seconds)   | 300
     Debug Mode             | ✓ Checked
     Status                 | Active
  
  c) Click "Apply .htaccess Rules"
  
  d) Verify .htaccess was updated

STEP 4: Create & Publish Page
──────────────────────────────
  a) Go to AI backend dashboard (or use API)
  
  b) Create a new page:
     Title: "My Landing Page"
     Slug:  "my-page"
  
  c) Publish with domain: "my-wordpress-site.test"
  
  d) Save the API token from publish settings

STEP 5: Test Integration
─────────────────────────
  a) Direct backend call:
     curl http://127.0.0.1:5000/p/my-page
  
  b) Verify plugin endpoint:
     curl -X POST http://127.0.0.1:5000/plugin/verify \
       -H "Content-Type: application/json" \
       -d '{"api_key":"your-token", "domain":"my-wordpress-site.test"}'
  
  c) Through WordPress proxy:
     Navigate to: http://my-wordpress-site.test/p/my-page
     Should display page content from backend

STEP 6: Troubleshooting
───────────────────────
  a) Check logs:
     tail -f wp-content/dm-debug.log
  
  b) Enable WordPress debug:
     define('WP_DEBUG', true);
     define('DM_DEBUG', true);
  
  c) Verify rewrite rules:
     apache2ctl -M | grep rewrite
     cat .htaccess (check Domain Mapper rules)

*/

// ─────────────────────────────────────────────────────────────────────────────
// API ENDPOINT REFERENCE
// ─────────────────────────────────────────────────────────────────────────────

/*

Backend Public Endpoints (no JWT required):

  GET /p/:slug
    Description: Fetch published page by slug
    URL:         http://127.0.0.1:5000/p/my-page
    Response:    { status: 'success', data: { page: {...} } }

  POST /plugin/verify
    Description: Verify plugin token & get page config
    URL:         http://127.0.0.1:5000/plugin/verify
    Body:        { api_key: '...', domain: 'my-wordpress-site.test' }
    Response:    { valid: true, data: { page: {...} } }

Flow:
  1. User visits: http://my-wordpress-site.test/p/my-page
  2. WordPress rewrite rule catches /p/* 
  3. Plugin calls: POST /plugin/verify with token
  4. Backend verifies token & page exists
  5. If valid: Plugin proxies to GET /p/my-page
  6. Content displayed to user (URL stays: my-wordpress-site.test/p/my-page)

*/

// ─────────────────────────────────────────────────────────────────────────────
// DATABASE: How Plugin Settings Are Stored
// ─────────────────────────────────────────────────────────────────────────────

/*

WordPress stores settings in wp_options table:

  Option Name: dm_settings
  Option Value: {
    "api_key": "http://127.0.0.1:5000@@token",
    "source_domain": "my-wordpress-site.test",
    "target_domain": "127.0.0.1:5000",
    "allowed_paths": "/p/",
    "cache_time": "300",
    "status": "active",
    "debug_mode": true,
    "plan": "dev",
    "last_verified": 1712505600  // Unix timestamp
  }

To manually verify settings in WordPress:
  SELECT * FROM wp_options WHERE option_name = 'dm_settings';

*/
?>
