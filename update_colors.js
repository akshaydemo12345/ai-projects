const fs = require('fs');
const glob = require('glob');

const files = glob.sync('/var/www/html/ai-projects-main-monday-12pm-working-new/ai-projects-main-monday-12pm-working/ai-projects-main/backend/src/thank-you-layouts/*/template.html');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  // Find .cta-button block and ensure color is white !important
  content = content.replace(/\.cta-button\s*\{[^}]+\}/g, (match) => {
    return match.replace(/color:\s*white;/g, 'color: #ffffff !important;');
  });
  
  // also replace any text-primary or similar on the a tag if it exists
  
  fs.writeFileSync(file, content);
  console.log('Updated ' + file);
});
