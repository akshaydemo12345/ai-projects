#!/usr/bin/env node

/**
 * 🏥 ADVANCED HTML to Healthcare Template Converter PRO v4.0
 * 
 * ✨ Features:
 * - किसी भी HTML/CSS को healthcare format में convert करे
 * - सभी animations preserve करे
 * - सभी styles maintain करे
 * - Images + Assets को copy करे
 * - Google Fonts/CDN links रखे
 * - Color detection + replacement
 * - Brand detection + replacement
 * 
 * Usage:
 * node converter-pro.js /home/user/Downloads/education-03 education 03
 * node converter-pro.js ./my-site
 * node converter-pro.js /full/path/to/folder category number
 */

const fs = require('fs');
const path = require('path');

// ═══════════════════════════════════════════════════════════════════════════
// 🔧 CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const CONFIG = {
  outputRoot: path.join(__dirname, '../frontend/src/templates'),
  publicRoot: path.join(__dirname, '../frontend/public/assets/templates'),
  backendPublicRoot: path.join(__dirname, '../backend/public/assets/templates'),
  keepSource: true,
  verbose: true,
  preserveAnimations: true,
  preserveInteractions: true,
  deepCopy: true // Recursively copy all assets
};

// ═══════════════════════════════════════════════════════════════════════════
// 📝 LOGGER
// ═══════════════════════════════════════════════════════════════════════════

class Logger {
  constructor(verbose = true) {
    this.verbose = verbose;
  }

  info(msg) {
    console.log(`\x1b[36mℹ️  ${msg}\x1b[0m`);
  }

  success(msg) {
    console.log(`\x1b[32m✅ ${msg}\x1b[0m`);
  }

  error(msg) {
    console.error(`\x1b[31m❌ ${msg}\x1b[0m`);
  }

  warn(msg) {
    console.warn(`\x1b[33m⚠️  ${msg}\x1b[0m`);
  }

  debug(msg) {
    if (this.verbose) console.log(`\x1b[90m🔧 ${msg}\x1b[0m`);
  }

  header(msg) {
    console.log(`\x1b[35m\n╔════════════════════════════════════════╗\x1b[0m`);
    console.log(`\x1b[35m║ ${msg.padEnd(38)} ║\x1b[0m`);
    console.log(`\x1b[35m╚════════════════════════════════════════╝\x1b[0m\n`);
  }
}

const log = new Logger(CONFIG.verbose);

// ═══════════════════════════════════════════════════════════════════════════
// 🎯 FILE FINDER - सभी files को recursively ढूंडे
// ═══════════════════════════════════════════════════════════════════════════

class FileFinder {
  static findAllFiles(dir, extensions = null) {
    let results = [];

    try {
      const items = fs.readdirSync(dir);

      items.forEach((item) => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          // Ignore node_modules, .git, etc.
          if (!['node_modules', '.git', '.next', 'dist', 'build', '__pycache__'].includes(item)) {
            results = results.concat(FileFinder.findAllFiles(fullPath, extensions));
          }
        } else if (stat.isFile()) {
          if (!extensions || extensions.includes(path.extname(fullPath).toLowerCase())) {
            results.push(fullPath);
          }
        }
      });
    } catch (e) {
      log.warn(`Could not read directory: ${dir}`);
    }

    return results;
  }

  static findMainHtml(dir) {
    const files = fs.readdirSync(dir);
    return (
      files.find((f) => f.toLowerCase() === 'index.html') ||
      files.find((f) => f.toLowerCase().endsWith('.html'))
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 🎨 CSS COLLECTOR - सभी CSS को collect करे
// ═══════════════════════════════════════════════════════════════════════════

class CSSCollector {
  static collectCSS(htmlContent, baseDir) {
    let css = '';
    let sources = [];

    log.info('Collecting CSS from multiple sources...');

    // 1️⃣ External CSS files से
    const cssFiles = FileFinder.findAllFiles(baseDir, ['.css']);
    log.debug(`Found ${cssFiles.length} CSS files`);

    cssFiles.forEach((file) => {
      try {
        const content = fs.readFileSync(file, 'utf-8');
        css += `/* ════════════════════════════════════════ */\n`;
        css += `/* Source: ${path.relative(baseDir, file)} */\n`;
        css += `/* ════════════════════════════════════════ */\n`;
        css += content + '\n\n';
        sources.push(path.relative(baseDir, file));
        log.debug(`✓ Loaded: ${path.relative(baseDir, file)}`);
      } catch (e) {
        log.warn(`Could not read: ${file}`);
      }
    });

    // 2️⃣ Inline <style> tags से
    const styleMatches = [...htmlContent.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)];
    if (styleMatches.length > 0) {
      log.debug(`Found ${styleMatches.length} inline <style> tags`);
      styleMatches.forEach((match, idx) => {
        css += `/* ════════════════════════════════════════ */\n`;
        css += `/* Inline Style Block #${idx + 1} */\n`;
        css += `/* ════════════════════════════════════════ */\n`;
        css += match[1] + '\n\n';
      });
    }

    // 3️⃣ @import statements से
    const importMatches = [...htmlContent.matchAll(/@import\s+url\(['"]([^'"]+)['"]\)/gi)];
    if (importMatches.length > 0) {
      log.debug(`Found ${importMatches.length} @import statements`);
    }

    log.success(`Collected CSS from ${sources.length} files + ${styleMatches.length} inline blocks`);
    return { css, sources };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 🖼️ ASSET HANDLER - सभी images/assets को handle करे
// ═══════════════════════════════════════════════════════════════════════════

class AssetHandler {
  static copyAllAssets(baseDir, targetDir) {
    const extensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.eot'];
    let copied = 0;
    let failed = 0;

    log.info('Deep copying all assets...');

    const assetFiles = FileFinder.findAllFiles(baseDir, extensions);
    log.debug(`Found ${assetFiles.length} asset files`);

    fs.mkdirSync(targetDir, { recursive: true });

    assetFiles.forEach((file) => {
      try {
        const relative = path.relative(baseDir, file);
        const targetPath = path.join(targetDir, path.basename(file));

        fs.copyFileSync(file, targetPath);
        copied++;
        log.debug(`✓ Copied: ${relative}`);
      } catch (e) {
        failed++;
        log.warn(`✗ Failed: ${path.basename(file)}`);
      }
    });

    log.success(`Copied ${copied} assets (${failed} failed)`);
    return { copied, failed };
  }

  static updateAssetPaths(content, baseUrl) {
    log.info('Updating asset paths in CSS and HTML...');

    let updated = 0;

    // src attributes में
    const srcRegex = /src=["'](?!https?:\/\/|data:|\/[^\/])([^"']+?)["']/gi;
    content.html = content.html.replace(srcRegex, (match, src) => {
      const filename = path.basename(src);
      updated++;
      return `src="${baseUrl}/${filename}"`;
    });

    // data-src attributes में
    const dataSrcRegex = /data-src=["'](?!https?:\/\/|data:)([^"']+?)["']/gi;
    content.html = content.html.replace(dataSrcRegex, (match, src) => {
      const filename = path.basename(src);
      updated++;
      return `data-src="${baseUrl}/${filename}"`;
    });

    // CSS url() में
    const urlRegex = /url\(["']?(?!https?:\/\/|data:)([^"'\)]+?)["']?\)/gi;
    content.css = content.css.replace(urlRegex, (match, src) => {
      const filename = path.basename(src);
      updated++;
      return `url("${baseUrl}/${filename}")`;
    });

    // background-image में
    const bgRegex = /background-image\s*:\s*url\(["']?(?!https?:\/\/)([^"'\)]+)["']?\)/gi;
    content.css = content.css.replace(bgRegex, (match, src) => {
      const filename = path.basename(src);
      updated++;
      return `background-image: url("${baseUrl}/${filename}")`;
    });

    log.success(`Updated ${updated} asset paths`);
    return content;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 🎯 PLACEHOLDER REPLACER
// ═══════════════════════════════════════════════════════════════════════════

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

class PlaceholderReplacer {
  static replaceBrand(content, baseDir) {
    log.info('Detecting and replacing brand names...');

    let replacements = 0;

    // Title से detect करो
    const titleMatch = content.rawHtml.match(/<title>([\s\S]*?)<\/title>/i);
    if (titleMatch) {
      const title = titleMatch[1]
        .split('—')[0]
        .split('|')[0]
        .split('-')[0]
        .trim()
        .substring(0, 50);

      if (title && title.length > 2) {
        const escaped = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`>\\s*${escaped}\\s*<`, 'gi');

        const beforeCount = (content.html.match(regex) || []).length;
        content.html = content.html.replace(regex, '>LOGO_PLACEHOLDER<');
        if (beforeCount > 0) {
          replacements++;
          log.success(`Found brand: "${title}"`);
        }
      }
    }

    // Package.json से detect करो
    const packagePath = path.join(baseDir, 'package.json');
    if (fs.existsSync(packagePath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
        if (pkg.name) {
          const name = pkg.name.replace(/-/g, ' ').toUpperCase();
          const regex = new RegExp(`\\b${name}\\b`, 'gi');
          content.html = content.html.replace(regex, 'LOGO_PLACEHOLDER');
          replacements++;
          log.debug(`Found from package.json: ${name}`);
        }
      } catch (e) {
        log.debug(`Could not parse package.json`);
      }
    }

    // Copyright से detect करो
    content.html = content.html.replace(
      /(©\s*(?:\d{4}[-–])?(?:\d{4}|\d{1,3})?\s*)([A-Za-z][^<.]{2,40})([\.<])/g,
      '$1PROJECT_NAME_PLACEHOLDER$3'
    );
    replacements++;

    log.success(`Made ${replacements} brand replacements`);
    return content;
  }

  static addEditorAttributes(html) {
    log.info('Adding data-editable attributes for editor support...');

    // Elements to make editable
    const tags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'button', 'a', 'strong', 'li', 'td'];

    let updatedHtml = html;

    // Inject data-editable into tags
    tags.forEach(tag => {
      const regex = new RegExp(`<${tag}\\b(?![^>]*data-editable)([^>]*)>`, 'gi');
      updatedHtml = updatedHtml.replace(regex, `<${tag} data-editable="true"$1>`);
    });

    // Inject data-editable-img into images
    updatedHtml = updatedHtml.replace(/<img(?![^>]*data-editable-img)([^>]*)>/gi, '<img data-editable-img="true"$1>');

    // Inject data-editable-bg into elements with background images in style
    updatedHtml = updatedHtml.replace(/<([a-z0-9]+)(?![^>]*data-editable-bg)([^>]*style=[^>]*background-image[^>]*)>/gi, '<$1 data-editable-bg="true"$2>');

    return updatedHtml;
  }

  static replaceColors(content) {
    log.info('Detecting and replacing brand colors...');

    const neutralColors = new Set([
      // Greyscale / Neutrals
      'ffffff', 'fff', '000000', '000', 'f8f8f8', 'fafafa', 'eeeeee', 'eee',
      'cccccc', 'ccc', '333333', '333', '666666', '666', '999999', '999',
      '1a1a1a', '212529', 'f5f5f5', '111827', '1f2937', '374151', '4b5563',
      '6b7280', '9ca3af', 'd1d5db', 'e5e7eb', 'f3f4f6', 'f9fafb', '141d23',
      '0b0f12', '121212', '222222', '444444', '555555', '777777', '888888',
      'aaaaaa', 'bbbbbb', 'dddddd', 'ffffff80', 'ffffffcc', 'ffffff99',
      // Common Slate/Gray shades
      'f8fafc', 'f1f5f9', 'e2e8f0', 'cbd5e1', '94a3b8', '64748b', '475569', '334155', '1e293b', '0f172a', '020617',
      'fafafa', 'f5f5f5', 'e5e5e5', 'd4d4d4', 'a3a3a3', '737373', '525252', '404040', '262626', '171717', '0a0a0a',
      'fafaf9', 'f5f5f4', 'e7e5e4', 'd6d3d1', 'a8a29e', '78716c', '57534e', '44403c', '292524', '1c1917', '0c0a09'
    ]);

    const colorCounts = {};
    const cssText = content.css + content.html;

    const hexRegex = /#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})\b/g;
    const matches = [...cssText.matchAll(hexRegex)];

    matches.forEach((m) => {
      const c = m[1].toLowerCase();
      if (!neutralColors.has(c)) {
        colorCounts[c] = (colorCounts[c] || 0) + 1;
      }
    });

    const sorted = Object.entries(colorCounts).sort((a, b) => b[1] - a[1]);

    const isBrandColor = (hex) => {
      const h = hex.length === 4 ? hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3] : hex.substring(1);
      const r = parseInt(h.substring(0, 2), 16);
      const g = parseInt(h.substring(2, 4), 16);
      const b = parseInt(h.substring(4, 6), 16);

      const max = Math.max(r, g, b) / 255;
      const min = Math.min(r, g, b) / 255;
      const delta = max - min;
      const saturation = max === 0 ? 0 : delta / max;
      const brightness = max;

      if (brightness < 0.25) return false;
      if (brightness > 0.95 && saturation < 0.1) return false;
      if (saturation < 0.20) return false;

      return true;
    };

    if (sorted.length > 0) {
      let primaryAssigned = false;
      let secondaryAssigned = false;

      for (let i = 0; i < sorted.length && (!primaryAssigned || !secondaryAssigned); i++) {
        const hex = '#' + sorted[i][0];

        // Relax brand color check slightly to include dark accents
        const h = sorted[i][0].length === 3 ? sorted[i][0][0] + sorted[i][0][0] + sorted[i][0][1] + sorted[i][0][1] + sorted[i][0][2] + sorted[i][0][2] : sorted[i][0];
        const r = parseInt(h.substring(0, 2), 16);
        const g = parseInt(h.substring(2, 4), 16);
        const b = parseInt(h.substring(4, 6), 16);
        const max = Math.max(r, g, b) / 255;
        const min = Math.min(r, g, b) / 255;
        const delta = max - min;
        const brightness = max;

        if (delta < 0.15) continue; // Skip neutral/near-neutral grays
        if (brightness < 0.3) continue; // Skip very dark colors (likely text/headers)

        let varName, placeholder, rgbPlaceholder;
        if (!primaryAssigned) {
          varName = '--tp-primary';
          placeholder = 'PRIMARY_COLOR_PLACEHOLDER';
          rgbPlaceholder = 'PRIMARY_RGB_PLACEHOLDER';
          primaryAssigned = true;
        } else if (!secondaryAssigned) {
          varName = '--tp-secondary';
          placeholder = 'SECONDARY_COLOR_PLACEHOLDER';
          rgbPlaceholder = 'SECONDARY_RGB_PLACEHOLDER';
          secondaryAssigned = true;
        } else {
          break;
        }

        log.success(`Mapping ${hex} to ${varName}`);

        const rRegex = new RegExp(hex.replace('#', '\\#'), 'gi');
        content.css = content.css.replace(rRegex, placeholder);
        content.html = content.html.replace(rRegex, placeholder);

        // Handle RGB/RGBA versions like "11, 51, 36" or "11,51,36"
        const rgb = hexToRgb(hex);
        if (rgb) {
          const rgbPattern = `${rgb.r},\\s*${rgb.g},\\s*${rgb.b}`;
          const rgbRegex = new RegExp(rgbPattern, 'gi');
          content.css = content.css.replace(rgbRegex, rgbPlaceholder);
          content.html = content.html.replace(rgbRegex, rgbPlaceholder);
        }
      }

      return content;
    } else {
      log.warn(`No non-neutral colors detected`);
      return content;
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 📱 HEAD EXTRACTOR - सभी head links को preserve करे
// ═══════════════════════════════════════════════════════════════════════════

class HeadExtractor {
  static extractHeadContent(htmlContent) {
    log.info('Extracting head content...');

    let headContent = '';

    // Meta tags
    const metaTags = htmlContent.match(/<meta[^>]*>/gi) || [];
    metaTags.forEach((tag) => {
      if (!tag.includes('http-equiv="refresh"')) {
        headContent += tag + '\n';
      }
    });

    // Link tags (fonts, icons, etc.)
    const linkTags = htmlContent.match(/<link[^>]*>/gi) || [];
    linkTags.forEach((tag) => {
      // Skip stylesheets जो बाद में add करेंगे
      if (!tag.includes('stylesheet') || tag.includes('fonts.googleapis') || tag.includes('google.com/css')) {
        headContent += tag + '\n';
      }
    });

    // Font imports
    if (htmlContent.includes('fonts.googleapis.com')) {
      headContent += `<link rel="preconnect" href="https://fonts.googleapis.com">\n`;
      headContent += `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n`;
    }

    // Auto-detect font services
    const fontServices = {
      'material-symbols-outlined': '<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />',
      'material-icons': '<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />',
      'fa-': '<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" rel="stylesheet" />',
      'fontawesome': '<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" rel="stylesheet" />'
    };

    Object.entries(fontServices).forEach(([key, tag]) => {
      if (htmlContent.includes(key) && !headContent.includes(tag)) {
        headContent += tag + '\n';
        log.debug(`Added: ${key}`);
      }
    });

    log.success(`Extracted ${metaTags.length} meta + ${linkTags.length} link tags`);
    return headContent;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 🏗️ HTML CLEANER - HTML को proper format में करे
// ═══════════════════════════════════════════════════════════════════════════

class HTMLCleaner {
  static clean(htmlContent) {
    log.info('Cleaning and optimizing HTML...');

    let cleaned = htmlContent;

    // 1⃣ Remove <html>, <head>, <body> tags
    cleaned = cleaned.replace(/<\/?html[^>]*>/gi, '');
    cleaned = cleaned.replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '');
    cleaned = cleaned.replace(/<body[^>]*>/gi, '');
    cleaned = cleaned.replace(/<\/body>/gi, '');

    // 2⃣ Remove DOCTYPE and xml declarations
    cleaned = cleaned.replace(/<!DOCTYPE[^>]*>/gi, '');
    cleaned = cleaned.replace(/<\?xml[^>]*>/gi, '');

    // 3⃣ Remove <style> tags (CSS already collected by CSSCollector)
    cleaned = cleaned.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

    // 4⃣ ONLY remove scripts that point to LOCAL relative file paths
    //    e.g. <script src="js/app.js"> — these files don't exist in the template system
    //    We detect these by: src= exists AND does NOT start with http/https/// or /
    const localScripts = cleaned.match(/<script[^>]*\bsrc=["'](?!https?:\/\/|\/\/|\/)([^"']+)["'][^>]*><\/script>/gi) || [];
    log.debug(`Removing ${localScripts.length} local file scripts (e.g. src="./app.js")`);
    cleaned = cleaned.replace(/<script[^>]*\bsrc=["'](?!https?:\/\/|\/\/|\/)([^"']+)["'][^>]*><\/script>/gi, '');

    // 5⃣ Keep CDN scripts (https://cdn.tailwindcss.com, etc.)
    const cdnScripts = cleaned.match(/<script[^>]*src=["']https?:\/\/[^"']+["'][^>]*><\/script>/gi) || [];
    log.debug(`Keeping ${cdnScripts.length} CDN scripts`);

    // ✅ 6⃣ CRITICAL: Extract and preserve ALL inline <script>...</script> blocks (no src attribute)
    //    These include: FAQ accordion, counter animations, marquee/ticker,
    //    nav toggle, sticky bar, scroll reveal, form validation, modal close, etc.
    //    We extract them from their original spots and append them to the bottom (under the footer).
    const inlineScripts = [];
    cleaned = cleaned.replace(/<script(?![^>]*\bsrc\b)[^>]*>([\s\S]*?)<\/script>/gi, (match) => {
      inlineScripts.push(match.trim());
      return ''; // Remove from original position
    });
    log.info(`Extracted ${inlineScripts.length} inline scripts`);

    // 7⃣ Normalize whitespace
    cleaned = cleaned.replace(/\n\s*\n\s*\n/g, '\n\n');
    cleaned = cleaned.trim();

    // 8⃣ Append all extracted inline scripts at the very bottom (under the footer)
    if (inlineScripts.length > 0) {
      cleaned += '\n\n' + inlineScripts.join('\n\n') + '\n';
    }

    log.success(`Cleaned HTML: removed ${localScripts.length} local file scripts | kept & moved ${inlineScripts.length} inline scripts under footer`);
    return cleaned;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 🎬 ANIMATION PRESERVER - सभी animations को preserve करे
// ═══════════════════════════════════════════════════════════════════════════

class AnimationPreserver {
  static preserveAnimations(css) {
    log.info('Analyzing animations and transitions...');

    let animations = {
      keyframes: [],
      transitions: [],
      transforms: [],
      count: 0
    };

    // @keyframes खोजो
    const keyframesRegex = /@keyframes\s+[\w-]+\s*\{[\s\S]*?\}/gi;
    const keyframesMatches = css.match(keyframesRegex) || [];
    animations.keyframes = keyframesMatches.length;
    log.debug(`Found ${keyframesMatches.length} @keyframes`);

    // transition खोजो
    const transitionRegex = /transition\s*:\s*[^;]+;/gi;
    const transitionMatches = css.match(transitionRegex) || [];
    animations.transitions = transitionMatches.length;
    log.debug(`Found ${transitionMatches.length} transitions`);

    // transform खोजो
    const transformRegex = /transform\s*:\s*[^;]+;/gi;
    const transformMatches = css.match(transformRegex) || [];
    animations.transforms = transformMatches.length;
    log.debug(`Found ${transformMatches.length} transforms`);

    animations.count = keyframesMatches.length + transitionMatches.length + transformMatches.length;
    log.success(`Preserved ${animations.count} animation properties`);

    return animations;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 🚀 MAIN CONVERTER
// ═══════════════════════════════════════════════════════════════════════════

class HealthcareTemplateConverter {
  constructor(inputPath, category = 'healthcare', templateNum = null) {
    this.inputPath = path.resolve(inputPath);
    this.category = category;
    this.templateNum = templateNum;
    this.stats = {
      cssFiles: 0,
      imagesCopied: 0,
      animationsPreserved: 0,
      placeholdersAdded: 0
    };
  }

  async convert() {
    try {
      log.header(`🏥 Healthcare Template Converter v4.0`);

      // ───────────────────────────────────────────────────────────────
      // Step 1: Input validation
      // ───────────────────────────────────────────────────────────────
      log.info(`Input path: ${this.inputPath}`);

      if (!fs.existsSync(this.inputPath)) {
        log.error(`Path not found: ${this.inputPath}`);
        process.exit(1);
      }

      const stats = fs.statSync(this.inputPath);
      let baseDir = this.inputPath;
      let htmlPath = this.inputPath;

      if (stats.isDirectory()) {
        baseDir = this.inputPath;
        const mainHtml = FileFinder.findMainHtml(baseDir);

        if (!mainHtml) {
          log.error(`No HTML file found in: ${baseDir}`);
          const files = fs.readdirSync(baseDir).slice(0, 10);
          log.info(`Files found: ${files.join(', ')}`);
          process.exit(1);
        }

        htmlPath = path.join(baseDir, mainHtml);
        log.success(`Found HTML: ${mainHtml}`);
      }

      // ───────────────────────────────────────────────────────────────
      // Step 2: Auto-numbering
      // ───────────────────────────────────────────────────────────────
      if (!this.templateNum) {
        this.autoNumber();
      }

      const paddedNum = String(this.templateNum).padStart(2, '0');
      const catCamel = this.category.charAt(0).toUpperCase() +
        this.category.slice(1).replace(/-([a-z])/g, (g) => g[1].toUpperCase());

      // ───────────────────────────────────────────────────────────────
      // Step 3: Read main HTML
      // ───────────────────────────────────────────────────────────────
      log.info(`Reading HTML from: ${htmlPath}`);
      const rawHtml = fs.readFileSync(htmlPath, 'utf-8');

      // ───────────────────────────────────────────────────────────────
      // Step 4: Collect CSS
      // ───────────────────────────────────────────────────────────────
      const { css: collectedCss, sources } = CSSCollector.collectCSS(rawHtml, baseDir);
      this.stats.cssFiles = sources.length;

      // ───────────────────────────────────────────────────────────────
      // Step 5: Extract head content
      // ───────────────────────────────────────────────────────────────
      const headContent = HeadExtractor.extractHeadContent(rawHtml);

      // ───────────────────────────────────────────────────────────────
      // Step 6: Clean HTML
      // ───────────────────────────────────────────────────────────────
      let cleanedHtml = HTMLCleaner.clean(rawHtml);

      // ───────────────────────────────────────────────────────────────
      // Step 7: Copy assets
      // ───────────────────────────────────────────────────────────────
      const imgBaseUrl = `/assets/templates/${this.category}/templates${paddedNum}`;
      const publicImgDir = path.join(CONFIG.publicRoot, this.category, `templates${paddedNum}`);
      const backendImgDir = path.join(CONFIG.backendPublicRoot, this.category, `templates${paddedNum}`);

      const assetStats = AssetHandler.copyAllAssets(baseDir, publicImgDir);

      // Also copy to backend
      try {
        AssetHandler.copyAllAssets(baseDir, backendImgDir);
      } catch (e) {
        log.warn('Could not copy assets to backend public folder. Skip.');
      }

      this.stats.imagesCopied = assetStats.copied;

      // ───────────────────────────────────────────────────────────────
      // Step 8: Update asset paths
      // ───────────────────────────────────────────────────────────────
      let content = {
        css: collectedCss,
        html: cleanedHtml,
        rawHtml: rawHtml
      };

      content = AssetHandler.updateAssetPaths(content, imgBaseUrl);

      // ───────────────────────────────────────────────────────────────
      // Step 9: Replace placeholders
      // ───────────────────────────────────────────────────────────────
      content = PlaceholderReplacer.replaceBrand(content, baseDir);
      content = PlaceholderReplacer.replaceColors(content);

      // Step 9.5: Add Editor Attributes
      content.html = PlaceholderReplacer.addEditorAttributes(content.html);

      this.stats.placeholdersAdded = 3; // LOGO, COLOR, PROJECT_NAME

      // ───────────────────────────────────────────────────────────────
      // Step 10: Preserve animations
      // ───────────────────────────────────────────────────────────────
      const animations = AnimationPreserver.preserveAnimations(content.css);
      this.stats.animationsPreserved = animations.count;

      // ───────────────────────────────────────────────────────────────
      // Step 11: Escape backticks and template string syntax (${})
      // ───────────────────────────────────────────────────────────────
      content.css = content.css.replace(/`/g, '\\`').replace(/\${/g, '\\${');
      content.html = content.html.replace(/`/g, '\\`').replace(/\${/g, '\\${');

      // ───────────────────────────────────────────────────────────────
      // Step 12: Generate TypeScript
      // ───────────────────────────────────────────────────────────────
      const stylesVar = `${catCamel}${paddedNum}Styles`;
      const htmlVar = `${catCamel}${paddedNum}Html`;

      const lowerCatCamel = catCamel.charAt(0).toLowerCase() + catCamel.slice(1);
      const lowerStylesVar = `${lowerCatCamel}${paddedNum}Styles`;
      const lowerHtmlVar = `${lowerCatCamel}${paddedNum}Html`;

      const tsOutput = `// Auto-generated ULTRA-DYNAMIC template — ${this.category} templates${paddedNum}
// Generated: ${new Date().toISOString()}
// ════════════════════════════════════════════════════════════════════════════
// This template was auto-converted with full preservation of:
// ✓ Animations & Keyframes
// ✓ Transitions & Transforms
// ✓ All original styling
// ✓ Google Fonts & CDN resources
// ✓ Images & Assets
// ════════════════════════════════════════════════════════════════════════════

export const ${stylesVar} = \`
${content.css.trim()}
\`;

export const ${htmlVar} = \`
${headContent.trim()}
${content.html.trim()}
\`;

export const ${lowerStylesVar} = ${stylesVar};
export const ${lowerHtmlVar} = ${htmlVar};
`;

      // ───────────────────────────────────────────────────────────────
      // Step 13: Write output
      // ───────────────────────────────────────────────────────────────
      const outputDir = path.join(CONFIG.outputRoot, this.category);
      fs.mkdirSync(outputDir, { recursive: true });

      const outputFile = path.join(outputDir, `templates${paddedNum}.ts`);
      fs.writeFileSync(outputFile, tsOutput, 'utf-8');
      log.success(`Template saved: ${outputFile}`);

      // ───────────────────────────────────────────────────────────────
      // Summary
      // ───────────────────────────────────────────────────────────────
      this.printSummary(catCamel, paddedNum, outputFile, publicImgDir, tsOutput);

      return {
        success: true,
        outputFile,
        imageDir: publicImgDir,
        stats: this.stats,
        vars: { stylesVar, htmlVar }
      };
    } catch (error) {
      log.error(`Conversion failed: ${error.message}`);
      console.error(error);
      process.exit(1);
    }
  }

  autoNumber() {
    const outputDir = path.join(CONFIG.outputRoot, this.category);

    if (fs.existsSync(outputDir)) {
      const existing = fs.readdirSync(outputDir)
        .filter((f) => f.match(/templates\d+\.ts$/))
        .map((f) => parseInt(f.match(/\d+/)[0]) || 0);

      this.templateNum = existing.length > 0 ? Math.max(...existing) + 1 : 1;
    } else {
      this.templateNum = 1;
    }

    log.success(`Auto-detected template number: ${this.templateNum}`);
  }

  printSummary(catCamel, paddedNum, outputFile, imageDir, tsOutput) {
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║              ✅ CONVERSION SUCCESSFUL!                        ║
╚════════════════════════════════════════════════════════════════╝

📦 Template Created:
   ├─ Category: ${this.category}
   ├─ Template: templates${paddedNum}
   ├─ Output: ${outputFile}
   └─ Images: ${imageDir}

📊 Statistics:
   ├─ CSS Files: ${this.stats.cssFiles}
   ├─ Images Copied: ${this.stats.imagesCopied}
   ├─ Animation Properties: ${this.stats.animationsPreserved}
   ├─ Placeholders Added: ${this.stats.placeholdersAdded}
   └─ File Size: ${(tsOutput.length / 1024).toFixed(2)} KB

🎨 TypeScript Exports:
   ├─ export const ${catCamel}${paddedNum}Styles
   └─ export const ${catCamel}${paddedNum}Html

🔄 Replaceable Placeholders:
   ├─ PRIMARY_COLOR_PLACEHOLDER (main brand color)
   ├─ LOGO_PLACEHOLDER (company/brand name)
   └─ PROJECT_NAME_PLACEHOLDER (project name)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Ready to use! Import and customize in your project.
    `);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 📋 CLI
// ═══════════════════════════════════════════════════════════════════════════

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║  🏥 HTML to Healthcare Template Converter PRO v4.0             ║
║  Full preservation of animations, styles, and all assets      ║
╚════════════════════════════════════════════════════════════════╝

Usage:
  node converter-pro.js <input_path> [category] [template_number]

Examples:
  node converter-pro.js /home/user/Downloads/education-03
  node converter-pro.js ./my-website healthcare
  node converter-pro.js /full/path/to/site education 03
  node converter-pro.js ./lovable-export travel 01

Supported Input:
  ✓ Folder paths: /home/user/Downloads/my-site
  ✓ Relative paths: ./website
  ✓ Absolute paths: /usr/local/projects/site
  ✓ Single HTML: ./index.html

Auto-Detection:
  ✓ Finds index.html automatically
  ✓ Collects all CSS files (external + inline)
  ✓ Copies all images/assets recursively
  ✓ Detects primary colors
  ✓ Finds brand names
  ✓ Preserves all animations & transitions

Output Location:
  Templates: frontend/src/templates/{category}/templates{number}.ts
  Images: frontend/public/assets/templates/{category}/templates{number}/

    `);
    process.exit(0);
  }

  const inputPath = args[0];
  const category = args[1] || 'healthcare';
  const templateNum = args[2] ? parseInt(args[2]) : null;

  const converter = new HealthcareTemplateConverter(inputPath, category, templateNum);
  await converter.convert();
}

main().catch((error) => {
  log.error(`Fatal error: ${error.message}`);
  process.exit(1);
});