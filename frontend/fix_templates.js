const fs = require('fs');
const path = require('path');
const glob = require('glob'); // Not available by default, let's use a simple recursive read

function getFiles(dir, files = []) {
  const fileList = fs.readdirSync(dir);
  for (const file of fileList) {
    const name = dir + '/' + file;
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files);
    } else if (name.endsWith('.ts') && !name.includes('index.ts')) {
      files.push(name);
    }
  }
  return files;
}

const templatesDir = path.join(__dirname, 'src/templates');
const files = getFiles(templatesDir);

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // 1. Remove all <nav> blocks
  content = content.replace(/<nav[\s\S]*?<\/nav>/gi, '');
  
  // 2. Replace href="#..." with href="javascript:void(0);"
  content = content.replace(/href="#[^"]*"/g, 'href="javascript:void(0);"');
  
  // 3. Optional: replace hardcoded logos with LOGO_PLACEHOLDER
  // Let's see if we can do this generally or only on specific cases.
  // We'll leave logo fixes for manual if it's too complex, but most use LOGO_PLACEHOLDER.
  
  fs.writeFileSync(file, content);
}
console.log('Fixed ' + files.length + ' templates.');
