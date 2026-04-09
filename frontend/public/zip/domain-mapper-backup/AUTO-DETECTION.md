# Domain Auto-Detection Setup

This plugin now automatically detects source and target domains, eliminating manual configuration.

---

## What Gets Auto-Detected?

### 1. Source Domain (WordPress Domain)

**Automatically detected from:** WordPress Home URL

```
WordPress Home URL: http://my-wordpress-site.test/
↓
Auto-detected Source Domain: my-wordpress-site.test
```

**What this is:**
- The domain where WordPress is running
- What users see in their browser
- Extracted from: `home_url()` WordPress function

**When it's used:**
- To identify incoming requests
- To match with backend page domain configurations

---

### 2. Target Domain (Backend API)

**Automatically detected from:** API Key endpoint

```
API Key Format: http://127.0.0.1:5000@@your-token
                    └─────────────────────┘
                         ↓
           Auto-detected Target Domain: 127.0.0.1:5000
```

**Fallback if not in API Key:**
- Defaults to: `127.0.0.1:5000`

**What this is:**
- The backend server domain
- Where pages are fetched from
- Extracted from the endpoint part of the API key

**When it's used:**
- To proxy requests to the backend
- To verify pages exist

---

## Setup Flow

### On Plugin Activation

1. **First time activation:**
   ```
   WordPress detects plugin is new
   ↓
   Activation function runs
   ↓
   Auto-detect source domain from WordPress
   ↓
   Default target domain to 127.0.0.1:5000
   ↓
   Save defaults to database
   ```

2. **Plugin is already installed:**
   - Existing settings are preserved
   - Auto-detection only fills in empty fields

### When Saving Settings

1. **Admin enters API Key:**
   ```
   Admin enters: http://127.0.0.1:5000@@your-token
   ↓
   Auto-detect function extracts: 127.0.0.1:5000
   ↓
   Shows preview: "Auto-detected: 127.0.0.1:5000"
   ↓
   Admin can override or accept
   ↓
   Save to database
   ```

2. **Admin leaves domain fields blank:**
   ```
   Admin saves settings without changing domains
   ↓
   If fields are empty, auto-detect fills them in
   ↓
   Shows in admin interface
   ```

---

## Admin Interface Display

### Settings Page View

```
┌─────────────────────────────────────────────┐
│ Licence & API                               │
├─────────────────────────────────────────────┤
│ API Key:          [http://127.0.0.1:5000@@] │
│                   [Verify Now]              │
│                                             │
│ Licence Status:   ✓ Active (pro)            │
│                   Last verified: 2 hours ago│
│                                             │
│ Source Domain:    [my-wordpress-site.test] │
│ Auto-detected: my-wordpress-site.test       │
│ The domain visitors see in their browser.   │
│                                             │
│ Target Domain:    [127.0.0.1:5000]         │
│ Auto-detected: 127.0.0.1:5000              │
│ The backend API domain. Auto-detected from  │
│ API Key endpoint if provided.               │
│                                             │
│ Routing Configuration                       │
│ Allowed Paths:    [/p/                    ] │
│                                             │
└─────────────────────────────────────────────┘
```

**Blue text indicates:** Auto-detected values (not manually set)

---

## API Reference: Auto-Detection Class

### Usage in Code

```php
// Get auto-detected source domain
$source = DomainMapper_AutoDetect::get_source_domain();
// Returns: "my-wordpress-site.test"

// Extract target domain from API key
$target = DomainMapper_AutoDetect::get_target_domain_from_api_key($api_key);
// Returns: "127.0.0.1:5000"

// Validate domain format
$is_valid = DomainMapper_AutoDetect::is_valid_domain($domain);
// Returns: true|false

// Auto-populate settings with detected values
$settings = DomainMapper_AutoDetect::auto_populate($settings);
// Returns: $settings with filled-in auto-detected values

// Get suggestions for display
$suggestions = DomainMapper_AutoDetect::get_suggestions();
// Returns: [
//   'source' => 'my-wordpress-site.test',
//   'target' => '127.0.0.1:5000',
//   'source_set' => true,  // manually configured
//   'target_set' => false  // auto-detected
// ]
```

---

## Complete Setup Example

### Step 1: Install Plugin

```bash
wp plugin activate domain-mapper
```

**Automatic:**
- Source Domain auto-detected: `my-wordpress-site.test`
- Target Domain defaulted to: `127.0.0.1:5000`

### Step 2: Go to Plugin Settings

WordPress Admin → Settings → Domain Mapper

**You'll see:**
```
✓ Source Domain: [_________________________________]
  Auto-detected: my-wordpress-site.test

✓ Target Domain: [_________________________________]
  Auto-detected: 127.0.0.1:5000
```

### Step 3: Enter API Key

Enter API Key with endpoint:
```
http://127.0.0.1:5000@@your-unique-token-here
```

**Automatic:**
- Target Domain updates to: `127.0.0.1:5000` (extracted from endpoint)
- Shows as auto-detected

### Step 4: Click Save

**Automatic:**
- All fields filled with auto-detected or manual values
- If any field was left empty, it's auto-populated
- Settings saved to WordPress database

---

## Validation Rules

### Domain Format Validation

The auto-detect validates domains using these rules:

**Valid formats:**
```
my-wordpress-site.test        ✓ Standard domain
api.example.com               ✓ With subdomain
127.0.0.1                     ✓ IP address
localhost.test                ✓ Localhost variant
127.0.0.1:5000               ✓ IP with port
example.com:8080             ✓ Domain with port
```

**Invalid formats:**
```
-invalid.com                  ✗ Starts with hyphen
.invalid.com                  ✗ Starts with dot
invalid.                      ✗ Ends with dot
invalid-.com                  ✗ Ends with hyphen
http://example.com            ✗ Includes scheme
example.com/                  ✗ Includes slash
```

---

## Troubleshooting

### Problem: Source Domain Not Auto-Detected

**Cause:** WordPress `home_url()` is empty or invalid

**Solution:**
```php
// In WordPress Admin:
// Settings → General → WordPress Address (URL) and Site Address (URL)
// Make sure both are set

// Or check in wp-config.php:
define('WP_HOME', 'http://my-wordpress-site.test');
define('WP_SITEURL', 'http://my-wordpress-site.test');
```

### Problem: Target Domain Shows as "127.0.0.1:5000" Even Though API Key is Set

**Cause:** API Key doesn't contain endpoint (only has token part)

**Solution:** Use full format:
```
Before:  your-unique-token-here
After:   http://127.0.0.1:5000@@your-unique-token-here
```

### Problem: Auto-Detection Shows Red Warning

**Cause:** Domain format is invalid

**Solution:** Verify domain follows rules:
- No URLs (no `http://` part)
- No trailing slashes
- Valid characters (letters, numbers, dots, hyphens, ports)

---

## Environment Variables

### No Environment Variables Needed!

One of the benefits of auto-detection is that it uses:

1. **WordPress settings** for source domain
2. **API Key** for target domain endpoint
3. **Sensible defaults** as fallback

No need to configure `wp-config.php` or `.env` files!

---

## How It Works Internally

### On Activation (domain-mapper.php)

```php
public static function activate(): void {
    $defaults = [ /* ... */ ];
    
    if ( ! get_option( DM_OPTION ) ) {
        // Call auto-detect to fill in missing values
        $defaults = DomainMapper_AutoDetect::auto_populate( $defaults );
        add_option( DM_OPTION, $defaults );
    }
}
```

### When Sanitizing Settings (settings-page.php)

```php
public function sanitize_settings( $raw ): array {
    // ... sanitize user input ...
    
    // Always call auto-populate to fill blanks
    $clean = DomainMapper_AutoDetect::auto_populate( $clean );
    
    return $clean;
}
```

### Field Rendering (settings-page.php)

```php
public function field_source_domain(): void {
    $suggestions = DomainMapper_AutoDetect::get_suggestions();
    $auto_detected = $suggestions['source'];
    
    // Show placeholder and "Auto-detected" hint
    if ( $auto_detected && ! $suggestions['source_set'] ) {
        echo "Auto-detected: $auto_detected";
    }
}
```

---

## For Developers

### Using Auto-Detection in Custom Code

```php
// Get suggestions for API verification
$suggestions = DomainMapper_AutoDetect::get_suggestions();

$source_domain = $suggestions['source'];  // WordPress domain
$target_domain = $suggestions['target'];  // Backend domain

// Check if values were auto-detected vs manually set
if ( ! $suggestions['source_set'] ) {
    // Source domain is auto-detected
}

// Validate before using
if ( DomainMapper_AutoDetect::is_valid_domain( $domain ) ) {
    // Safe to use in proxy configuration
}
```

### Integrating with External Systems

```php
// Get current settings with auto-detection applied
$settings = get_option( 'dm_settings' );

// Ensure all fields are present and valid
$settings = DomainMapper_AutoDetect::auto_populate( $settings );

// Now safely access:
$source = $settings['source_domain'];
$target = $settings['target_domain'];
```

---

## Summary

With auto-detection, plugin setup is now:

✅ **Install plugin** → Auto-detects WordPress domain  
✅ **Enter API Key** → Auto-detects backend domain from endpoint  
✅ **Click Save** → Done! Ready to use  

**No manual domain configuration needed!**
