const fs = require('fs');
let content = fs.readFileSync('frontend/src/lib/industryPrompts.ts', 'utf8');

// We want to ensure the 4 templates are visibly different for every category.
// Each category has 4 templates that look exactly the same right now because of the failed replace.

const variants = [
  "", // Base
  "\nStyle\nUltra-modern dark mode aesthetic\nDeep black (#050505) background with glowing neon accents\n", // Dark mode
  "\nStyle\nCreative, asymmetrical, brutalist aesthetic\nHigh contrast, bold typography, broken grid layouts\n", // Brutalist
  "\nStyle\nMinimalist, elegant, high-end aesthetic\nMonochrome palette with lots of whitespace and delicate serif typography\n" // Minimalist
];

let templateIndex = 0;
content = content.replace(/\(keyword: string\) => `([\s\S]*?)`/g, (match, p1) => {
  let newContent = p1;
  const variantIndex = templateIndex % 4;
  
  // Strip out existing Style blocks to replace them
  newContent = newContent.replace(/Style\n[\s\S]*?Header/, variants[variantIndex] + "Header");
  
  templateIndex++;
  return `(keyword: string) => \`${newContent}\``;
});

fs.writeFileSync('frontend/src/lib/industryPrompts.ts', content);
console.log("Variations applied successfully.");
