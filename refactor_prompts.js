const fs = require('fs');
const content = fs.readFileSync('frontend/src/lib/industryPrompts.ts', 'utf8');

// We will replace `prompts: [...].map(keyword => \`...\`)`
// with `templates: [ (keyword) => \`...\`, (keyword) => \`...\` ]`
// For Agency, we'll duplicate the template 4 times with minor style tweaks to give 4 variants.
// For others, we can just put 1 or 2 templates for now, or 4 duplicated templates so the user can edit them later.

let newContent = content.replace(/prompts: \[[^\]]+\]\.map\(keyword => `([\s\S]*?)`\)/g, (match, templateContent) => {
  // Create 4 variations of the templateContent by slightly modifying the Style section
  const t1 = `(keyword: string) => \`${templateContent}\``;
  const t2 = `(keyword: string) => \`${templateContent.replace('Clean tech aesthetic', 'Dark mode futuristic aesthetic').replace('Light background', 'Dark background').replace('Ivory/off-white', 'Midnight blue').replace('Warm luxury aesthetic', 'Ultra-modern dark aesthetic')}\``;
  const t3 = `(keyword: string) => \`${templateContent.replace('Clean grid layout', 'Asymmetrical creative layout').replace('Pixel-perfect', 'Creative, broken-grid, pixel-perfect')}\``;
  const t4 = `(keyword: string) => \`${templateContent.replace('Soft clinical aesthetic', 'Bold, vibrant aesthetic').replace('calming primary color', 'energetic bright color')}\``;
  
  return `templates: [\n    ${t1},\n    ${t2},\n    ${t3},\n    ${t4}\n  ]`;
});

// Update the type signature
newContent = newContent.replace('Record<string, { chips: string[], prompts: string[] }>', 'Record<string, { chips: string[], templates: ((keyword: string) => string)[] }>');

fs.writeFileSync('frontend/src/lib/industryPrompts.ts', newContent);
console.log('Refactored industryPrompts.ts');
