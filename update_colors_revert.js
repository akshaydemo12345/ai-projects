const fs = require('fs');
const glob = require('glob');

const files = glob.sync('/var/www/html/ai-projects-main-monday-12pm-working-new/ai-projects-main-monday-12pm-working/ai-projects-main/backend/src/thank-you-layouts/*/template.html');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/color:\s*#ffffff\s*!important;/g, 'color: #ffffff;');
  fs.writeFileSync(file, content);
  console.log('Reverted ' + file);
});
