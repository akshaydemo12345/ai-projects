const fs = require('fs');
let content = fs.readFileSync('frontend/src/templates/law/templates06.ts', 'utf8');

// Revert footer logo
content = content.replace(/<img src="LOGO_URL_PLACEHOLDER"[^>]*>\s*<div class="leading-tight text-white">\s*<div class="font-serif text-xl font-bold text-white">PROJECT_NAME_PLACEHOLDER<\/div>\s*<div class="text-\[10px\] uppercase tracking-\[0\.3em\] text-gold">Attorneys at Law<\/div>\s*<\/div>/g, 'LOGO_PLACEHOLDER');

// Revert header logo
content = content.replace(/<img src="LOGO_URL_PLACEHOLDER"[^>]*>\s*<div class="leading-tight">\s*<div class="font-serif text-xl font-bold tracking-wide">PROJECT_NAME_PLACEHOLDER<\/div>\s*<div class="text-\[10px\] uppercase tracking-\[0\.3em\] text-gold">Attorneys at Law<\/div>\s*<\/div>/g, 'LOGO_PLACEHOLDER');

// Replace CSS variables usage
content = content.replace(/var\(--color-gold\)/g, 'var(--primary)');
content = content.replace(/var\(--color-navy\)/g, 'var(--secondary)');
content = content.replace(/var\(--color-navy-deep\)/g, '#0c1426');
content = content.replace(/var\(--color-navy-soft\)/g, '#243353');
content = content.replace(/var\(--color-gold-bright\)/g, '#e0bf6b');
content = content.replace(/var\(--color-gold-soft\)/g, '#f1e6c8');
content = content.replace(/var\(--color-cream\)/g, '#f7f3ea');
content = content.replace(/var\(--color-gray-200\)/g, '#e5e7eb');
content = content.replace(/var\(--color-gray-500\)/g, '#6b7280');
content = content.replace(/var\(--color-gray-600\)/g, '#4b5563');
content = content.replace(/var\(--color-gray-700\)/g, '#374151');

// Remove extraneous root variables
content = content.replace(/\s*--color-[^:]+:\s*[^;]+;/g, '');

fs.writeFileSync('frontend/src/templates/law/templates06.ts', content);
console.log("Replaced successfully!");
