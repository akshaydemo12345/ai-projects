const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, 'frontend/src/templates');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const phones = [
  "+1 234 567 890", "+1 (234) 567-890", "1-800-123-4567"
];

const emails = [
  "you@email.com"
];

walkDir(templatesDir, (filePath) => {
  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    emails.forEach(email => {
      const regex = new RegExp(email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      content = content.replace(regex, 'EMAIL_PLACEHOLDER');
    });

    phones.forEach(phone => {
      const regex = new RegExp(phone.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      content = content.replace(regex, 'PHONE_PLACEHOLDER');
    });

    fs.writeFileSync(filePath, content, 'utf-8');
  }
});

console.log('Templates processed!');
