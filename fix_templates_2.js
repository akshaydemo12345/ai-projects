const fs = require('fs');
const path = require('path');

const targetString = "if (isValid && isInEditor) {";

function traverseDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    let fullPath = path.join(dir, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
       traverseDir(fullPath);
    } else if (fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes(targetString)) {
        content = content.replace(/if \(isValid \&\& isInEditor\) \{/g, 'if (isInEditor) {');
        fs.writeFileSync(fullPath, content);
        console.log('Fixed', fullPath);
      }
    }
  });
}
traverseDir('frontend/src/templates');
