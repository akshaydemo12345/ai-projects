const fs = require('fs');
const path = require('path');

const layoutsDir = '/var/www/html/ai-projects-main-monday-12pm-working-new/ai-projects-main-monday-12pm-working/ai-projects-main/backend/src/thank-you-layouts';

fs.readdirSync(layoutsDir).forEach(file => {
  const fullPath = path.join(layoutsDir, file);
  if (fs.statSync(fullPath).isDirectory()) {
    const templatePath = path.join(fullPath, 'template.html');
    if (fs.existsSync(templatePath)) {
      let content = fs.readFileSync(templatePath, 'utf8');
      
      // Target: .hero-section style block specifically
      const regex = /(\.hero-section\s*\{[\s\S]*?)overflow:\s*hidden\s*;([\s\S]*?\})/g;
      if (regex.test(content)) {
        content = content.replace(regex, '$1overflow: visible;$2');
        fs.writeFileSync(templatePath, content, 'utf8');
        console.log(`✅ Fixed overflow scroll constraint in template: ${file}`);
      } else {
        console.log(`ℹ️ No un-fixed overflow rule found in template: ${file}`);
      }
    }
  }
});
