const grapesjs = require('grapesjs');
const editor = grapesjs.init({ container: document.createElement('div') });
console.log(Object.keys(editor.StyleManager.getProperty('typography', 'color')));
