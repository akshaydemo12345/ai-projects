#!/usr/bin/env node
/**
 * HTML to Template Converter (Folder Support Version)
 * Usage: node scripts/html-to-template.js <input_folder_or_file> <category> <templateNumber>
 */

const fs = require('fs');
const path = require('path');

// ─── Args ─────────────────────────────────────────────────────────────────────
const [,, inputFile, category = 'ecommerce', userTemplateNum] = process.argv;

if (!inputFile) {
  console.log(`
Usage:
  node scripts/html-to-template.js <input_folder_or_file> <category> [optional_templateNumber]
  `);
  process.exit(1);
}

// --- Auto-Numbering Logic ---
let templateNum = userTemplateNum;
const outputDir = path.join('frontend/src/templates', category);

if (!templateNum) {
  console.log(`🔍 No template number provided. Checking category "${category}"...`);
  if (fs.existsSync(outputDir)) {
    const existingFiles = fs.readdirSync(outputDir);
    const templateFiles = existingFiles.filter(f => f.startsWith('templates') && f.endsWith('.ts'));
    
    if (templateFiles.length > 0) {
      // Find highest number from filenames like templates01.ts, templates02.ts
      const numbers = templateFiles.map(f => {
        const match = f.match(/templates(\d+)\.ts/);
        return match ? parseInt(match[1]) : 0;
      });
      const maxNum = Math.max(...numbers);
      templateNum = maxNum + 1;
      console.log(`✨ Auto-detected next number: ${templateNum}`);
    } else {
      templateNum = 1;
      console.log(`✨ Starting with first template: 1`);
    }
  } else {
    templateNum = 1;
    console.log(`✨ New category detected. Starting with: 1`);
  }
}

const paddedNum = templateNum.toString().padStart(2, '0');

if (!fs.existsSync(inputFile)) {
  console.error(`❌ File or Folder not found: ${inputFile}`);
  process.exit(1);
}

const stats = fs.statSync(inputFile);
let mainHtmlPath = inputFile;
let baseDir = path.dirname(inputFile);

if (stats.isDirectory()) {
  baseDir = inputFile;
  const files = fs.readdirSync(inputFile);
  const htmlFile = files.find(f => f.toLowerCase() === 'index.html') || files.find(f => f.toLowerCase().endsWith('.html'));
  
  if (!htmlFile) {
    console.error(`❌ No HTML file found in folder: ${inputFile}`);
    process.exit(1);
  }
  mainHtmlPath = path.join(inputFile, htmlFile);
}

console.log(`🚀 Starting conversion for ${mainHtmlPath}...`);

// ─── Read HTML ────────────────────────────────────────────────────────────────
let rawHtml = fs.readFileSync(mainHtmlPath, 'utf-8');

// ─── Step 1: Extract Head Elements & Local CSS ─────────────────────────────
let headElements = '';
let css = '';

// Auto-detect icons to ensure they load
if (rawHtml.includes('material-symbols-outlined')) {
  headElements += '<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />\n';
}
if (rawHtml.includes('material-icons')) {
  headElements += '<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />\n';
}
if (rawHtml.includes('fa-') || rawHtml.includes('fontawesome')) {
  headElements += '<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" rel="stylesheet" />\n';
}

// Extract CSS from <style> tags
const styleMatches = [...rawHtml.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)];
styleMatches.forEach(match => {
  css += match[1] + '\n';
  rawHtml = rawHtml.replace(match[0], ''); // Remove from rawHtml to avoid duplication
});

// Extract external links (Google Fonts, CDNs) and handle LOCAL CSS
const headLinks = rawHtml.match(/<link[^>]*>/gi) || [];
headLinks.forEach(link => {
  if (link.includes('fonts.googleapis.com') || link.includes('cdnjs.cloudflare.com') || link.includes('unpkg.com') || link.includes('fonts.gstatic.com')) {
    // Only add if not already added by auto-detect
    if (!headElements.includes(link)) {
        headElements += link + '\n';
    }
  } else if (link.includes('rel="stylesheet"') || link.includes("rel='stylesheet'")) {
    // Try to find local href
    const hrefMatch = link.match(/href=["']([^"']+)["']/i);
    if (hrefMatch) {
      const href = hrefMatch[1];
      if (!href.startsWith('http') && !href.startsWith('//')) {
        const cssPath = path.join(baseDir, href);
        if (fs.existsSync(cssPath)) {
          console.log(`🔗 Found local CSS: ${href}`);
          css += fs.readFileSync(cssPath, 'utf-8') + '\n';
          rawHtml = rawHtml.replace(link, ''); // Remove local link tag
        }
      }
    }
  }
});

const headScripts = rawHtml.match(/<script[^>]*src="[^"]*"[^>]*><\/script>/gi) || [];
headScripts.forEach(script => {
  if (script.includes('cdnjs.cloudflare.com') || script.includes('unpkg.com')) {
    headElements += script + '\n';
  }
});

// ─── Step 2: Extract body content ─────────────────────────────────────────────
const bodyMatch = rawHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
let bodyHtml = bodyMatch ? bodyMatch[1].trim() : rawHtml.trim();

// Remove any remaining script tags that are local (usually at the end of body)
bodyHtml = bodyHtml.replace(/<script[^>]*src=["'](?!https?:\/\/|data:)([^"']+)["'][^>]*><\/script>/gi, '');

// ─── Step 3: Handle Images ────────────────────────────────────────────────────
const publicImgDir = path.join('frontend/public/assets/templates', category, `templates${paddedNum}`, 'images');
fs.mkdirSync(publicImgDir, { recursive: true });

const imgBaseUrl = `/assets/templates/${category}/templates${paddedNum}/images`;

// Function to copy images
function copyImagesRecursively(dir) {
  if (!fs.existsSync(dir)) return;
  const items = fs.readdirSync(dir);
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      copyImagesRecursively(fullPath);
    } else if (/\.(png|jpg|jpeg|gif|webp|svg)$/i.test(item)) {
      fs.copyFileSync(fullPath, path.join(publicImgDir, item));
      console.log(`🖼️  Copied image: ${item}`);
    }
  });
}

// Copy images from base directory
if (stats.isDirectory()) {
    copyImagesRecursively(baseDir);
} else {
    // If it was just a file, look for images in the same folder
    const files = fs.readdirSync(baseDir);
    files.forEach(f => {
        if (/\.(png|jpg|jpeg|gif|webp|svg)$/i.test(f)) {
            fs.copyFileSync(path.join(baseDir, f), path.join(publicImgDir, f));
        }
    });
}

// Update image paths in HTML and CSS
const imgRegex = /src=["'](?!https?:\/\/|data:)([^"']+\.(?:png|jpg|jpeg|gif|webp|svg))["']/gi;
bodyHtml = bodyHtml.replace(imgRegex, (match, src) => {
  const filename = path.basename(src);
  return `src="${imgBaseUrl}/${filename}"`;
});

css = css.replace(/url\(["']?(?!https?:\/\/|data:)([^"'\)]+\.(?:png|jpg|jpeg|gif|webp|svg))["']?\)/gi, (match, src) => {
    const filename = path.basename(src);
    return `url("${imgBaseUrl}/${filename}")`;
});

// ─── Step 4: Auto-replace common patterns ─────────────────────────────────────

// --- Logo / Brand Name ---
const brandKeywords = ['logo', 'brand', 'site-name', 'navbar-brand', 'footer-logo'];
brandKeywords.forEach(kw => {
  const kwRegex = new RegExp(`(<[^>]*?(?:class|id)="[^"]*?${kw}[^"]*?"[^>]*?>)([\\s\\S]*?)(<\\/[^>]+?>)`, 'gi');
  bodyHtml = bodyHtml.replace(kwRegex, (match, open, content, close) => {
    if (content.includes('<img')) return match; 
    return `${open}LOGO_PLACEHOLDER${close}`;
  });
});

const titleMatch = rawHtml.match(/<title>([\s\S]*?)<\/title>/i);
if (titleMatch) {
  const title = titleMatch[1].split('—')[0].split('|')[0].trim();
  if (title && title.length > 2) {
    console.log(`🏷️  Found Brand Name in Title: ${title}`);
    const brandRegex = new RegExp(`>\\s*${title}\\s*<`, 'gi');
    bodyHtml = bodyHtml.replace(brandRegex, '>LOGO_PLACEHOLDER<');
  }
}

// --- Dynamic Colors ---
const colorRegex = /#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})\b/g;
const colorCounts = {};
const neutralColors = [
  'ffffff', 'fff', '000000', '000', 
  'f8f8f8', 'fafafa', 'eeeeee', 'eee', 'cccccc', 'ccc', '333333', '333', '666666', '666', '999999', '999', 
  '1a1a1a', '212529', 'f5f5f5', '111827', '1f2937', '374151', '4b5563', '6b7280', '9ca3af', 'd1d5db', 'e5e7eb', 'f3f4f6', 'f9fafb',
  '141d23', '0b0f12', '121212', '222222', '444444', '555555', '777777', '888888', 'aaaaaa', 'bbbbbb', 'dddddd'
];

[...css.matchAll(colorRegex)].forEach(m => {
  const c = m[1].toLowerCase();
  if (!neutralColors.includes(c)) {
    colorCounts[c] = (colorCounts[c] || 0) + 1;
  }
});

const sortedColors = Object.entries(colorCounts).sort((a, b) => b[1] - a[1]);
if (sortedColors.length > 0) {
  const topColor = sortedColors[0];
  console.log(`🎨 Primary color detected: #${topColor[0]}`);
  
  const hex = '#' + topColor[0];
  const placeholder = 'PRIMARY_COLOR_PLACEHOLDER';
  
  // Replace primary occurrences
  css = css.replace(new RegExp(hex, 'gi'), placeholder);
  bodyHtml = bodyHtml.replace(new RegExp(hex, 'gi'), placeholder);
  
  // Force all other non-neutral colors to either Primary or White
  if (sortedColors.length > 1) {
    sortedColors.slice(1, 5).forEach(([col, count]) => {
      const otherHex = '#' + col;
      const r = parseInt(col.substring(0, 2), 16);
      const g = parseInt(col.substring(2, 4), 16);
      const b = parseInt(col.substring(4, 6), 16);
      
      // If it's a light color (likely a background), force it to white
      if (r + g + b > 500) {
        css = css.replace(new RegExp(otherHex, 'gi'), '#ffffff');
        bodyHtml = bodyHtml.replace(new RegExp(otherHex, 'gi'), '#ffffff');
      } else {
        // Otherwise, make it follow the primary color
        css = css.replace(new RegExp(otherHex, 'gi'), placeholder);
        bodyHtml = bodyHtml.replace(new RegExp(otherHex, 'gi'), placeholder);
      }
    });
  }

  if (hex.length === 7) {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    const rgbRegex = new RegExp(`rgba?\\(\\s*${r},\\s*${g},\\s*${b}[^\\)]*\\)`, 'gi');
    css = css.replace(rgbRegex, placeholder);
    bodyHtml = bodyHtml.replace(rgbRegex, placeholder);
  }
}

// Force specific white backgrounds for known classes
css = css.replace(/background:\s*[^;!]+(?=;|\s|$)/gi, (match) => {
  if (match.includes('PRIMARY_COLOR_PLACEHOLDER')) return match;
  if (match.includes('transparent')) return match;
  if (match.includes('url')) return match;
  return 'background: #ffffff';
});

// --- Project Name ---
bodyHtml = bodyHtml.replace(
  /(©\s*\d{4}\s*)([A-Za-z][^<.]{2,40})([\.<])/g,
  (match, copy, name, end) => `${copy}PROJECT_NAME_PLACEHOLDER${end}`
);

// ─── Step 5: Final Touches ────────────────────────────────────────────────────
if (headElements) {
  bodyHtml = headElements + '\n' + bodyHtml;
}

// Add mandatory icon fix and UNIVERSAL RESPONSIVE CSS
css += `
.material-symbols-outlined, .material-icons {
  font-display: swap;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
}

/* UNIVERSAL RESPONSIVE FIXES */
@media(max-width: 900px) {
  .container { max-width: 100%; padding: 0 1.5rem; }
  [class*="grid"], .grid { grid-template-columns: 1fr 1fr !important; gap: 1rem !important; }
  [class*="flex"]:not(nav), .flex:not(nav) { flex-wrap: wrap; }
  .newsletter, .glass-box, section > div { grid-template-columns: 1fr !important; text-align: center; gap: 2rem !important; }
  form { width: 100%; }
}

@media(max-width: 600px) {
  [class*="grid"], .grid { grid-template-columns: 1fr !important; }
  h1 { font-size: 2.5rem !important; line-height: 1.1 !important; }
  h2 { font-size: 2rem !important; }
  .nav nav, .links { display: none !important; }
  .foot-top, footer > div { flex-direction: column !important; text-align: center; gap: 1.5rem !important; }
  .newsletter form { flex-direction: column; border-radius: 20px !important; padding: 1rem !important; }
  .newsletter input { width: 100%; text-align: center; margin-bottom: 0.5rem; }
  .newsletter button { width: 100%; }
}
`;

css = css.replace(/`/g, '\\`');
bodyHtml = bodyHtml.replace(/`/g, '\\`');

const catCamel = category.replace(/-([a-z])/g, g => g[1].toUpperCase());
const stylesVar = `${catCamel}${paddedNum}Styles`;
const htmlVar = `${catCamel}${paddedNum}Html`;

const tsOutput = `// Auto-generated ULTRA-DYNAMIC template — ${category} templates${paddedNum}
// Generated: ${new Date().toISOString()}

export const ${stylesVar} = \`
${css.trim()}
\`;

export const ${htmlVar} = \`
${bodyHtml.trim()}
\`;
`;

// ─── Step 6: Write output files ────────────────────────────────────────────────
const outputFile = path.join(outputDir, `templates${paddedNum}.ts`);

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputFile, tsOutput, 'utf-8');

// ─── Step 7: DELETE INPUT ───────────────────────────────────────────────────
try {
  if (stats.isDirectory()) {
    fs.rmSync(inputFile, { recursive: true, force: true });
    console.log(`🗑️  Deleted source folder: ${inputFile}`);
  } else {
    fs.unlinkSync(inputFile);
    console.log(`🗑️  Deleted source file: ${inputFile}`);
  }
} catch (err) {
  console.warn(`⚠️  Could not delete source: ${err.message}`);
}

console.log(`
✅ SUCCESS! Template created (Folder Support) and source deleted.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📄 File: ${outputFile}
🖼️  Images: ${publicImgDir}

🎨 Colors Replaced: Dynamic
🏷️  Logo/Brand: Auto-replaced
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
