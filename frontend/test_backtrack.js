const escapedColor = "#123456";
const regex = new RegExp(`(?<!--primary\\s*:\\s*)(?<!--primary-dark\\s*:\\s*)(?<!--p3-primary\\s*:\\s*)(?<!--p3-primary-mid\\s*:\\s*)(?<!--primary-container\\s*:\\s*)(?<!--primary-temp\\s*:\\s*)${escapedColor}`, 'gi');
let css = "body { background: #123456; } ".repeat(50000);
console.time("regex");
css.replace(regex, 'var(--primary)');
console.timeEnd("regex");
