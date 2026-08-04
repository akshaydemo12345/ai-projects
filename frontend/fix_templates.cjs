const fs = require('fs');
const path = require('path');

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
  
  // 2. Replace href="#..." and href="#" with href="javascript:void(0);"
  content = content.replace(/href="#[^"]*"/g, 'href="javascript:void(0);"');
  
  // 3. Make sure logo images have a max-height just in case they don't
  // If the file defines a logo class, check if it has img css.
  
  fs.writeFileSync(file, content);
}
console.log('Fixed ' + files.length + ' templates.');
