#!/bin/bash

# ─────────────────────────────────────────────────────────────────────────────
# Domain Mapper Integration Test Script
# ─────────────────────────────────────────────────────────────────────────────
# 
# This script verifies that the AI Backend and WordPress Domain Mapper
# plugin are properly configured and communicating.
#
# USAGE:
#   chmod +x test-integration.sh
#   ./test-integration.sh
#

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKEND_URL="http://127.0.0.1:5000"
WORDPRESS_URL="http://my-wordpress-site.test"
API_TOKEN="your-unique-plugin-token-here"
TEST_SLUG="my-page"

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Domain Mapper + AI Backend Integration Test${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}\n"

# ─────────────────────────────────────────────────────────────────────────────
# Test 1: Backend Server Health
# ─────────────────────────────────────────────────────────────────────────────

echo -e "${YELLOW}Test 1: Backend Server Health Check${NC}"
echo "Endpoint: GET $BACKEND_URL/"

if response=$(curl -s -w "\n%{http_code}" "$BACKEND_URL/"); then
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)
    
    if [ "$http_code" -eq 200 ]; then
        echo -e "${GREEN}✓ Backend server is running${NC}"
        echo "  Response: $body"
    else
        echo -e "${RED}✗ Backend returned HTTP $http_code${NC}"
        echo "  Response: $body"
    fi
else
    echo -e "${RED}✗ Backend server is NOT running at $BACKEND_URL${NC}"
    echo "  Make sure to run: cd backend && npm start"
    exit 1
fi

echo ""

# ─────────────────────────────────────────────────────────────────────────────
# Test 2: Public Page Endpoint
# ─────────────────────────────────────────────────────────────────────────────

echo -e "${YELLOW}Test 2: Public Page Endpoint${NC}"
echo "Endpoint: GET $BACKEND_URL/p/$TEST_SLUG"

if response=$(curl -s -w "\n%{http_code}" "$BACKEND_URL/p/$TEST_SLUG"); then
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)
    
    if [ "$http_code" -eq 200 ]; then
        echo -e "${GREEN}✓ Public page endpoint is working${NC}"
        echo "  Response: $(echo "$body" | head -c 100)..."
    elif [ "$http_code" -eq 404 ]; then
        echo -e "${YELLOW}⚠ Page not found (expected if you haven't created it yet)${NC}"
        echo "  HTTP: $http_code"
        echo "  Create and publish a page to complete this test"
    else
        echo -e "${RED}✗ Unexpected response HTTP $http_code${NC}"
        echo "  Response: $body"
    fi
else
    echo -e "${RED}✗ Failed to reach public page endpoint${NC}"
fi

echo ""

# ─────────────────────────────────────────────────────────────────────────────
# Test 3: Plugin Verification Endpoint
# ─────────────────────────────────────────────────────────────────────────────

echo -e "${YELLOW}Test 3: Plugin Verification Endpoint${NC}"
echo "Endpoint: POST $BACKEND_URL/plugin/verify"

payload="{
  \"api_key\": \"$API_TOKEN\",
  \"domain\": \"my-wordpress-site.test\"
}"

echo "Payload: $payload"

if response=$(curl -s -w "\n%{http_code}" -X POST "$BACKEND_URL/plugin/verify" \
    -H "Content-Type: application/json" \
    -d "$payload"); then
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)
    
    if [ "$http_code" -eq 200 ]; then
        echo -e "${GREEN}✓ Plugin verification endpoint is working${NC}"
        echo "  Response: $(echo "$body" | head -c 150)..."
    elif [ "$http_code" -eq 401 ]; then
        echo -e "${YELLOW}⚠ Plugin verification failed (401 Unauthorized)${NC}"
        echo "  This is expected if:"
        echo "  1. You haven't published a page with this API token"
        echo "  2. The API token is incorrect"
        echo "  3. The domain doesn't match the published page domain"
    elif [ "$http_code" -eq 400 ]; then
        echo -e "${RED}✗ Bad request (400)${NC}"
        echo "  Verify payload format is correct"
        echo "  Response: $body"
    else
        echo -e "${RED}✗ Unexpected response HTTP $http_code${NC}"
        echo "  Response: $body"
    fi
else
    echo -e "${RED}✗ Failed to reach plugin verification endpoint${NC}"
fi

echo ""

# ─────────────────────────────────────────────────────────────────────────────
# Test 4: WordPress Connectivity
# ─────────────────────────────────────────────────────────────────────────────

echo -e "${YELLOW}Test 4: WordPress Site Connectivity${NC}"
echo "URL: $WORDPRESS_URL/"

if response=$(curl -s -w "\n%{http_code}" "$WORDPRESS_URL/"); then
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)
    
    if [ "$http_code" -eq 200 ]; then
        echo -e "${GREEN}✓ WordPress site is accessible${NC}"
    else
        echo -e "${YELLOW}⚠ WordPress returned HTTP $http_code${NC}"
        echo "  This might be expected if site config is different"
    fi
else
    echo -e "${RED}✗ WordPress site is NOT accessible at $WORDPRESS_URL${NC}"
    echo "  Verify:"
    echo "  1. WordPress is running on correct domain"
    echo "  2. /etc/hosts has entry: 127.0.0.1 my-wordpress-site.test"
    echo "  3. Apache vhost is configured for this domain"
fi

echo ""

# ─────────────────────────────────────────────────────────────────────────────
# Test 5: WordPress Domain Mapper Plugin Check
# ─────────────────────────────────────────────────────────────────────────────

echo -e "${YELLOW}Test 5: WordPress Domain Mapper Plugin Check${NC}"
echo "File: /var/www/html/Wordpress\\ Projects/wp-content/plugins/domain-mapper/domain-mapper.php"

WP_PLUGIN_FILE="/var/www/html/Wordpress Projects/wp-content/plugins/domain-mapper/domain-mapper.php"

if [ -f "$WP_PLUGIN_FILE" ]; then
    echo -e "${GREEN}✓ Domain Mapper plugin file exists${NC}"
    
    # Check if plugin admin settings page exists
    SETTINGS_FILE="/var/www/html/Wordpress Projects/wp-content/plugins/domain-mapper/admin/settings-page.php"
    if [ -f "$SETTINGS_FILE" ]; then
        echo -e "${GREEN}✓ Plugin settings page exists${NC}"
        echo "  Go to: WordPress Admin → Settings → Domain Mapper SaaS"
    else
        echo -e "${RED}✗ Settings page not found${NC}"
    fi
else
    echo -e "${RED}✗ Domain Mapper plugin file not found${NC}"
    echo "  Expected at: $WP_PLUGIN_FILE"
fi

echo ""

# ─────────────────────────────────────────────────────────────────────────────
# Summary
# ─────────────────────────────────────────────────────────────────────────────

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Integration Test Complete${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}\n"

echo "Next Steps:"
echo ""
echo "1. Create & Publish a Page:"
echo "   - Go to AI Backend Dashboard"
echo "   - Create a new page with slug: '$TEST_SLUG'"
echo "   - Publish with domain: 'my-wordpress-site.test'"
echo ""
echo "2. Configure WordPress Plugin:"
echo "   - Go to WordPress Admin → Settings → Domain Mapper SaaS"
echo "   - Enter API Key: http://127.0.0.1:5000@@$API_TOKEN"
echo "   - Enter Source Domain: my-wordpress-site.test"
echo "   - Enter Target Domain: 127.0.0.1:5000"
echo "   - Click 'Apply .htaccess Rules'"
echo ""
echo "3. Test the Proxy:"
echo "   - Visit: $WORDPRESS_URL/p/$TEST_SLUG"
echo "   - Should display the page content from backend"
echo ""
echo "4. View Logs:"
echo "   - Backend: tail -f backend/logs/*.log"
echo "   - WordPress Debug: tail -f wp-content/dm-debug.log"
echo ""
