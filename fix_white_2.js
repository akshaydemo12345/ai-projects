const fs = require('fs');
const glob = require('glob');

const files = glob.sync('/var/www/html/ai-projects-main-monday-12pm-working-new/ai-projects-main-monday-12pm-working/ai-projects-main/backend/src/thank-you-layouts/*/template.html');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Find index of .cta-button {
  let idx = content.indexOf('.cta-button {');
  if (idx !== -1) {
    let before = content.substring(0, idx);
    let after = content.substring(idx);
    
    // find the end of the .cta-button block
    // since it has {{...}} we can't just find first }. Let's find first '}' that is preceded by ';' or similar.
    // Or just do a replace within the next 200 characters
    let endIdx = after.indexOf('padding:');
    if (endIdx !== -1) {
      let block = after.substring(0, endIdx);
      let rest = after.substring(endIdx);
      
      block = block.replace(/color:\s*white;/g, 'color: #ffffff;');
      content = before + block + rest;
    }
  }

  fs.writeFileSync(file, content);
  console.log('Fixed properly ' + file);
});
