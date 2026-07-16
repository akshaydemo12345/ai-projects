const fs = require('fs');
const file = '/var/www/html/ai-projects-main-monday-12pm-working-new/ai-projects-main-monday-12pm-working/ai-projects-main/frontend/src/templates/healthcare/templates06.ts';
let content = fs.readFileSync(file, 'utf8');

// Replace :root
const rootReplacement = `:root {
  --primary: PRIMARY_COLOR_PLACEHOLDER;
  --secondary: SECONDARY_COLOR_PLACEHOLDER;
  --primary-rgb: PRIMARY_RGB_PLACEHOLDER;
  --secondary-rgb: SECONDARY_RGB_PLACEHOLDER;
  --bg-light: #fdfdfd;
  --text-dark: #1f1f1f;
  --text-muted: #64748b;
  --border-light: #f1f5f9;
  --spacing-section-padding: 80px;
  --spacing-gutter: 24px;
}`;

content = content.replace(/:root\s*\{[^}]+\}/m, rootReplacement);

// Add @import for material symbols
if (!content.includes('@import url')) {
  content = content.replace('export const healthcare06Styles = `\n', 'export const healthcare06Styles = `\n@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0");\n');
}

// Replace all usages of old vars
content = content.replace(/var\(--brand-navy\)/g, 'var(--primary)');
content = content.replace(/var\(--brand-emerald\)/g, 'var(--secondary)');
content = content.replace(/var\(--brand-dark\)/g, 'var(--primary)');
content = content.replace(/var\(--surface-container-lowest\)/g, 'var(--primary)');
content = content.replace(/var\(--gray-50\)/g, 'var(--bg-light)');
content = content.replace(/var\(--gray-200\)/g, 'var(--border-light)');
content = content.replace(/var\(--gray-300\)/g, 'var(--border-light)');
content = content.replace(/var\(--gray-400\)/g, 'var(--text-muted)');
content = content.replace(/var\(--gray-500\)/g, 'var(--text-muted)');
content = content.replace(/var\(--gray-600\)/g, 'var(--text-dark)');
content = content.replace(/var\(--on-primary\)/g, '#ffffff');
content = content.replace(/var\(--on-primary-fixed\)/g, '#ffffff');

// Also the user mentioned LOGO
// 'img logo ki jaga apna logo project se jo aaya'
// That means use LOGO_PLACEHOLDER
content = content.replace(/<img[^>]*class="logo-image"[^>]*>/i, 'LOGO_PLACEHOLDER');
content = content.replace(/<span class="logo-title">[^<]*<\/span>/i, 'LOGO_PLACEHOLDER');

fs.writeFileSync(file, content);
console.log('Fixed healthcare06.ts');
