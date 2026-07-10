const fs = require('fs');
const path = './frontend/src/templates/law/templates01.ts';
let content = fs.readFileSync(path, 'utf8');

let imgCounter = 1;
content = content.replace(/https:\/\/images\.unsplash\.com\/[^"']+/g, () => {
    return `/assets/templates/LawFirm/templates01/image${imgCounter++}.jpg`;
});

fs.writeFileSync(path, content);
console.log('Done replacing ' + (imgCounter - 1) + ' images.');
