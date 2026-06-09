const fs = require('fs');
let code = fs.readFileSync('src/components/editor/GrapesEditor.tsx', 'utf8');

// We need to strip Tailwind CDN from dbContent
// Find where configHTML is prepended
const searchStr = "const configHTML = `";
const replacementStr = `// Strip Tailwind CDN and config scripts from dbContent to prevent infinite loops in GrapesJS canvas
      dbContent = dbContent.replace(/<script\\b[^>]*>([\\s\\S]*?)<\\/script>/gi, (match) => {
        if (match.includes('cdn.tailwindcss.com') || match.includes('tailwind.config')) {
          return '';
        }
        return match;
      });

      const configHTML = \``;

if (code.includes(searchStr)) {
    code = code.replace(searchStr, replacementStr);
    fs.writeFileSync('src/components/editor/GrapesEditor.tsx', code);
    console.log("Success");
} else {
    console.log("Failed to find injection point");
}
