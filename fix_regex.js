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

walkDir(templatesDir, (filePath) => {
    if (filePath.endsWith('.ts')) {
        let content = fs.readFileSync(filePath, 'utf8');
        // The broken regex is `/*$/,` which starts a comment.
        // We replace it with `/\\*$/,`
        if (content.includes('replace(/*$/,')) {
            content = content.replace('replace(/*$/,', 'replace(/\\\\*$/,');
            fs.writeFileSync(filePath, content);
            console.log('Fixed regex in', filePath);
        }
    }
});
