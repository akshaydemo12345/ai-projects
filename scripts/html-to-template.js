#!/usr/bin/env node
/**
 * HTML to Template Converter v2.0 (IMPROVED & DEBUGGED)
 * Usage: node html-to-template-v2.js <input_folder_or_file> [category] [templateNumber] [--no-delete]
 * 
 * Features:
 * - ✅ Flexible path handling
 * - ✅ Better error handling & logging
 * - ✅ Works with any project structure
 * - ✅ Option to keep source files
 * - ✅ Better regex patterns
 */

const fs = require('fs');
const path = require('path');

// ─── CONFIGURATION ────────────────────────────────────────────────────────
const CONFIG = {
  outputRoot: 'frontend/src/templates',  // App templates folder
  publicRoot: 'frontend/public/assets/templates', // App public assets folder
  keepSource: true,                     // Set to true to keep source files
  verbose: true                          // Detailed logging
};

// ─── UTILS ────────────────────────────────────────────────────────────────
const log = {
  info: (msg) => console.log(`ℹ️  ${msg}`),
  success: (msg) => console.log(`✅ ${msg}`),
  error: (msg) => console.error(`❌ ${msg}`),
  warn: (msg) => console.warn(`⚠️  ${msg}`),
  debug: (msg) => CONFIG.verbose && console.log(`🔧 ${msg}`),
};

// ─── ARGS PARSING ────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const inputFile = args[0];
const category = args[1] || 'travel';
const userTemplateNum = args[2];
const noDelete = args.includes('--no-delete');

if (!inputFile) {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║   HTML to Template Converter v2.0                          ║
╚════════════════════════════════════════════════════════════╝

Usage:
  node html-to-template-v2.js <input> [category] [number] [--no-delete]

Examples:
  node html-to-template-v2.js ./template-folder
  node html-to-template-v2.js ./index.html travel 01
  node html-to-template-v2.js ./template travel 02 --no-delete

Options:
  --no-delete    Keep source files (don't delete after conversion)
  `);
  process.exit(1);
}

// ─── VALIDATE INPUT ──────────────────────────────────────────────────────
if (!fs.existsSync(inputFile)) {
  log.error(`File or folder not found: ${inputFile}`);
  process.exit(1);
}

const stats = fs.statSync(inputFile);
let mainHtmlPath = inputFile;
let baseDir = path.dirname(inputFile);

// Handle directory input
if (stats.isDirectory()) {
  baseDir = inputFile;
  const files = fs.readdirSync(inputFile);
  const htmlFile = files.find(f => f.toLowerCase() === 'index.html') ||
    files.find(f => f.toLowerCase().endsWith('.html'));

  if (!htmlFile) {
    log.error(`No HTML file found in: ${inputFile}`);
    log.info(`Files found: ${files.join(', ')}`);
    process.exit(1);
  }
  mainHtmlPath = path.join(inputFile, htmlFile);
  log.debug(`Found HTML: ${htmlFile}`);
}

log.info(`Starting conversion for: ${mainHtmlPath}`);
log.debug(`Base directory: ${baseDir}`);
log.debug(`Category: ${category}`);

// ─── AUTO-NUMBERING ──────────────────────────────────────────────────────
let templateNum = userTemplateNum;
const outputDir = path.join(CONFIG.outputRoot, category);

if (!templateNum) {
  log.info(`No template number provided. Auto-detecting...`);
  if (fs.existsSync(outputDir)) {
    const existingFiles = fs.readdirSync(outputDir).filter(f => f.match(/templates\d+\.ts$/));

    if (existingFiles.length > 0) {
      const numbers = existingFiles.map(f => {
        const match = f.match(/templates(\d+)\.ts/);
        return match ? parseInt(match[1]) : 0;
      });
      const maxNum = Math.max(...numbers);
      templateNum = maxNum + 1;
      log.debug(`Found existing templates: ${existingFiles.join(', ')}`);
    } else {
      templateNum = 1;
    }
  } else {
    templateNum = 1;
    log.debug(`New category, starting with 1`);
  }
  log.success(`Auto-detected template number: ${templateNum}`);
}

const paddedNum = templateNum.toString().padStart(2, '0');

// ─── READ FILES ───────────────────────────────────────────────────────────
log.info(`Reading HTML file...`);
let rawHtml = fs.readFileSync(mainHtmlPath, 'utf-8');

let css = '';
let headElements = '';

// Try to read external CSS file first
const cssFiles = fs.readdirSync(baseDir).filter(f => f.endsWith('.css'));
if (cssFiles.length > 0) {
  log.debug(`Found CSS files: ${cssFiles.join(', ')}`);
  cssFiles.forEach(cssFile => {
    const cssPath = path.join(baseDir, cssFile);
    try {
      css += fs.readFileSync(cssPath, 'utf-8') + '\n';
      log.debug(`Loaded: ${cssFile}`);
    } catch (e) {
      log.warn(`Could not read ${cssFile}: ${e.message}`);
    }
  });
}

// ─── EXTRACT HEAD ELEMENTS ────────────────────────────────────────────────
log.info(`Extracting head elements...`);

// Auto-detect icon fonts
if (rawHtml.includes('material-symbols-outlined')) {
  headElements += '<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />\n';
  log.debug(`Auto-detected Material Symbols`);
}
if (rawHtml.includes('material-icons')) {
  headElements += '<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />\n';
  log.debug(`Auto-detected Material Icons`);
}
if (rawHtml.includes('fa-') || rawHtml.includes('fontawesome')) {
  headElements += '<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" rel="stylesheet" />\n';
  log.debug(`Auto-detected FontAwesome`);
}

// Extract inline styles
const styleMatches = [...rawHtml.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)];
if (styleMatches.length > 0) {
  log.debug(`Found ${styleMatches.length} inline style tags`);
  styleMatches.forEach(match => {
    css += match[1] + '\n';
  });
  // Remove from HTML
  rawHtml = rawHtml.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
}

// Extract external links
const headLinks = rawHtml.match(/<link[^>]*>/gi) || [];
log.debug(`Processing ${headLinks.length} link tags...`);

headLinks.forEach(link => {
  // External CDN links
  if (link.includes('fonts.googleapis.com') || link.includes('cdnjs.cloudflare.com') ||
    link.includes('unpkg.com') || link.includes('fonts.gstatic.com')) {
    if (!headElements.includes(link.substring(0, 50))) {
      headElements += link + '\n';
      log.debug(`Added CDN link: ${link.substring(0, 50)}...`);
    }
  }
  // Local CSS files
  else if (link.includes('stylesheet')) {
    const hrefMatch = link.match(/href=["']([^"']+)["']/i);
    if (hrefMatch) {
      const href = hrefMatch[1];
      if (!href.startsWith('http') && !href.startsWith('//')) {
        const cssPath = path.join(baseDir, href);
        try {
          if (fs.existsSync(cssPath)) {
            const localCss = fs.readFileSync(cssPath, 'utf-8');
            css += localCss + '\n';
            log.success(`Loaded local CSS: ${href}`);
          }
        } catch (e) {
          log.warn(`Could not load CSS: ${href} - ${e.message}`);
        }
      }
    }
  }
});

// ─── EXTRACT BODY ─────────────────────────────────────────────────────────
log.info(`Extracting body content...`);
const bodyMatch = rawHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
let bodyHtml = bodyMatch ? bodyMatch[1].trim() : rawHtml.trim();

// Remove local scripts
const removedScripts = (bodyHtml.match(/<script[^>]*src=["'](?!https?:\/\/|data:)([^"']+)["'][^>]*><\/script>/gi) || []).length;
bodyHtml = bodyHtml.replace(/<script[^>]*src=["'](?!https?:\/\/|data:)([^"']+)["'][^>]*><\/script>/gi, '');
if (removedScripts > 0) {
  log.debug(`Removed ${removedScripts} local script tags`);
}

// ─── HANDLE IMAGES ────────────────────────────────────────────────────────
log.info(`Processing images...`);
const publicImgDir = path.join(CONFIG.publicRoot, category, `templates${paddedNum}`);
const imgBaseUrl = `/assets/templates/${category}/templates${paddedNum}`;

try {
  fs.mkdirSync(publicImgDir, { recursive: true });
} catch (e) {
  log.warn(`Could not create image directory: ${e.message}`);
}

// Copy images recursively
let copiedCount = 0;
function copyImagesRecursively(dir) {
  if (!fs.existsSync(dir)) return;
  try {
    const items = fs.readdirSync(dir);
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        copyImagesRecursively(fullPath);
      } else if (/\.(png|jpg|jpeg|gif|webp|svg)$/i.test(item)) {
        try {
          fs.copyFileSync(fullPath, path.join(publicImgDir, item));
          copiedCount++;
          log.debug(`Copied: ${item}`);
        } catch (e) {
          log.warn(`Could not copy ${item}: ${e.message}`);
        }
      }
    });
  } catch (e) {
    log.warn(`Error reading directory ${dir}: ${e.message}`);
  }
}

copyImagesRecursively(baseDir);
log.success(`Copied ${copiedCount} images`);

// ─── UPDATE IMAGE PATHS ───────────────────────────────────────────────────
log.info(`Updating image paths in HTML and CSS...`);

const imgRegex = /src=["'](?!https?:\/\/|data:)([^"']+\.(?:png|jpg|jpeg|gif|webp|svg))["']/gi;
let srcReplacements = 0;
bodyHtml = bodyHtml.replace(imgRegex, (match, src) => {
  srcReplacements++;
  const filename = path.basename(src);
  return `src="${imgBaseUrl}/${filename}"`;
});
log.debug(`Updated ${srcReplacements} src attributes`);

const urlRegex = /url\(["']?(?!https?:\/\/|data:)([^"'\)]+\.(?:png|jpg|jpeg|gif|webp|svg))["']?\)/gi;
let urlReplacements = 0;
css = css.replace(urlRegex, (match, src) => {
  urlReplacements++;
  const filename = path.basename(src);
  return `url("${imgBaseUrl}/${filename}")`;
});
log.debug(`Updated ${urlReplacements} url() references`);

// ─── AUTO-REPLACE PATTERNS ────────────────────────────────────────────────
log.info(`Auto-replacing brand patterns...`);

// Logo/Brand replacement
const brandKeywords = ['site-name', 'navbar-brand', 'footer-logo', 'company-name'];
let brandReplacements = 0;

brandKeywords.forEach(kw => {
  const kwRegex = new RegExp(`(<[^>]*?(?:class|id)="[^"]*?${kw}[^"]*?"[^>]*?>)([\\s\\S]*?)(<\\/[^>]+?>)`, 'gi');
  const before = bodyHtml.length;
  bodyHtml = bodyHtml.replace(kwRegex, (match, open, content, close) => {
    if (content.includes('<img') || content.includes('src=')) return match;
    brandReplacements++;
    return `${open}LOGO_PLACEHOLDER${close}`;
  });
});

// Title-based brand detection
const titleMatch = rawHtml.match(/<title>([\s\S]*?)<\/title>/i);
if (titleMatch) {
  const title = titleMatch[1].split('—')[0].split('|')[0].split('-')[0].trim();
  if (title && title.length > 2 && !title.includes('http')) {
    log.success(`Found brand in title: "${title}"`);
    const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const brandRegex = new RegExp(`>\\s*${escapedTitle}\\s*<`, 'gi');
    bodyHtml = bodyHtml.replace(brandRegex, '>LOGO_PLACEHOLDER<');
    brandReplacements++;
  }
}
log.debug(`Made ${brandReplacements} brand replacements`);

// ─── COLOR DETECTION & REPLACEMENT ────────────────────────────────────────
log.info(`Detecting primary colors...`);

const neutralColors = new Set([
  'ffffff', 'fff', '000000', '000',
  'f8f8f8', 'fafafa', 'eeeeee', 'eee', 'cccccc', 'ccc',
  '333333', '333', '666666', '666', '999999', '999',
  '1a1a1a', '212529', 'f5f5f5', '111827', '1f2937',
  '374151', '4b5563', '6b7280', '9ca3af', 'd1d5db',
  'e5e7eb', 'f3f4f6', 'f9fafb', '141d23', '0b0f12',
  '121212', '222222', '444444', '555555', '777777',
  '888888', 'aaaaaa', 'bbbbbb', 'dddddd'
]);

const colorRegex = /#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})\b/g;
const colorCounts = {};

[...css.matchAll(colorRegex)].forEach(m => {
  const c = m[1].toLowerCase();
  if (!neutralColors.has(c)) {
    colorCounts[c] = (colorCounts[c] || 0) + 1;
  }
});

const sortedColors = Object.entries(colorCounts).sort((a, b) => b[1] - a[1]);

if (sortedColors.length > 0) {
  const topColor = sortedColors[0];
  const primaryHex = '#' + topColor[0];
  log.success(`Primary color: ${primaryHex} (used ${topColor[1]} times)`);

  // Replace primary color
  let colorReplacements = 0;

  // Hex replacement
  const hexRegex = new RegExp(primaryHex.replace(/#/, '\\#'), 'gi');
  colorReplacements += (css.match(hexRegex) || []).length;
  css = css.replace(hexRegex, 'PRIMARY_COLOR_PLACEHOLDER');

  colorReplacements += (bodyHtml.match(hexRegex) || []).length;
  bodyHtml = bodyHtml.replace(hexRegex, 'PRIMARY_COLOR_PLACEHOLDER');

  // RGB replacement (if hex is 7 chars)
  if (primaryHex.length === 7) {
    const r = parseInt(primaryHex.substring(1, 3), 16);
    const g = parseInt(primaryHex.substring(3, 5), 16);
    const b = parseInt(primaryHex.substring(5, 7), 16);
    const rgbRegex = new RegExp(`rgba?\\(\\s*${r},\\s*${g},\\s*${b}[^\\)]*\\)`, 'gi');

    colorReplacements += (css.match(rgbRegex) || []).length;
    css = css.replace(rgbRegex, 'PRIMARY_COLOR_PLACEHOLDER');

    colorReplacements += (bodyHtml.match(rgbRegex) || []).length;
    bodyHtml = bodyHtml.replace(rgbRegex, 'PRIMARY_COLOR_PLACEHOLDER');
  }

  log.debug(`Made ${colorReplacements} color replacements`);
} else {
  log.warn(`No primary color detected`);
}

// ─── PROJECT NAME REPLACEMENT ─────────────────────────────────────────────
const projectMatch = bodyHtml.match(/(©\s*\d{4}\s*)([A-Za-z][^<.]{2,40})([\.<])/);
if (projectMatch) {
  log.success(`Found project/company: "${projectMatch[2]}"`);
  bodyHtml = bodyHtml.replace(
    /(©\s*\d{4}\s*)([A-Za-z][^<.]{2,40})([\.<])/g,
    (match, copy, name, end) => `${copy}PROJECT_NAME_PLACEHOLDER${end}`
  );
}

// ─── ADD RESPONSIVE CSS ───────────────────────────────────────────────────
log.info(`Adding responsive CSS...`);

css += `
/* UNIVERSAL RESPONSIVE CSS - Added by converter */
.material-symbols-outlined, .material-icons {
  font-display: swap;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
}

@media (max-width: 900px) {
  .container { max-width: 100%; padding: 0 1.5rem; }
  [class*="grid"], .grid { grid-template-columns: 1fr !important; gap: 1rem !important; }
  [class*="flex"]:not(nav), .flex:not(nav) { flex-wrap: wrap; }
  form { width: 100%; }
}

@media (max-width: 600px) {
  [class*="grid"], .grid { grid-template-columns: 1fr !important; }
  h1 { font-size: 2.5rem !important; line-height: 1.1 !important; }
  h2 { font-size: 2rem !important; }
  .nav nav, .links { display: none !important; }
}
`;

// ─── ESCAPE BACKTICKS ─────────────────────────────────────────────────────
css = css.replace(/`/g, '\\`');
bodyHtml = bodyHtml.replace(/`/g, '\\`');

// ─── CREATE TYPESCRIPT OUTPUT ──────────────────────────────────────────────
const catCamel = category.replace(/-([a-z])/g, g => g[1].toUpperCase());
const stylesVar = `${catCamel}${paddedNum}Styles`;
const htmlVar = `${catCamel}${paddedNum}Html`;

const tsOutput = `// Auto-generated ULTRA-DYNAMIC template — ${category} templates${paddedNum}
// Generated: ${new Date().toISOString()}

export const ${stylesVar} = \`
${css.trim()}
\`;

export const ${htmlVar} = \`
${headElements.trim()}
${bodyHtml.trim()}
\`;
`;

// ─── WRITE OUTPUT ──────────────────────────────────────────────────────────
log.info(`Creating output directory...`);
try {
  fs.mkdirSync(outputDir, { recursive: true });
} catch (e) {
  log.error(`Could not create output directory: ${e.message}`);
  process.exit(1);
}

const outputFile = path.join(outputDir, `templates${paddedNum}.ts`);
log.info(`Writing template file...`);

try {
  fs.writeFileSync(outputFile, tsOutput, 'utf-8');
  log.success(`Template saved: ${outputFile}`);
} catch (e) {
  log.error(`Could not write template: ${e.message}`);
  process.exit(1);
}

// ─── DELETE SOURCE (OPTIONAL) ──────────────────────────────────────────────
if (!noDelete && !CONFIG.keepSource) {
  log.info(`Cleaning up source files...`);
  try {
    if (stats.isDirectory()) {
      fs.rmSync(inputFile, { recursive: true, force: true });
      log.success(`Deleted source folder: ${inputFile}`);
    } else {
      fs.unlinkSync(inputFile);
      log.success(`Deleted source file: ${inputFile}`);
    }
  } catch (err) {
    log.warn(`Could not delete source: ${err.message}`);
  }
} else if (CONFIG.keepSource) {
  log.info(`Source files preserved (CONFIG.keepSource = true)`);
} else {
  log.info(`Source files preserved (--no-delete flag used)`);
}

// ─── SUMMARY ───────────────────────────────────────────────────────────────
console.log(`
╔════════════════════════════════════════════════════════════╗
║           ✅ CONVERSION SUCCESSFUL!                        ║
╚════════════════════════════════════════════════════════════╝

📦 Template Package Created:
   ├─ Category: ${category}
   ├─ Template: templates${paddedNum}
   ├─ Output: ${outputDir}
   └─ Images: ${publicImgDir}

📊 Statistics:
   ├─ Images copied: ${copiedCount}
   ├─ Image paths updated: ${srcReplacements + urlReplacements}
   ├─ Brand replacements: ${brandReplacements}
   └─ File size: ${(tsOutput.length / 1024).toFixed(2)} KB

🎨 Placeholders Added:
   ├─ LOGO_PLACEHOLDER (brand name)
   ├─ PRIMARY_COLOR_PLACEHOLDER (primary color)
   └─ PROJECT_NAME_PLACEHOLDER (company name)

📝 TypeScript Exports:
   ├─ export const ${stylesVar}
   └─ export const ${htmlVar}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Ready to use! Import and customize in your project.
`);