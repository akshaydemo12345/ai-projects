const fs = require('fs');
const content = fs.readFileSync('node_modules/grapesjs/dist/grapes.min.js', 'utf8');
console.log(content.includes('upValue') ? 'Has upValue' : 'No upValue');
