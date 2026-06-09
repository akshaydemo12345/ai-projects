const css = "some long css string " + "#123456 ".repeat(10000);
const escapedColor = "#123456";
const regex = new RegExp(`(?<!--primary\\s*:\\s*)${escapedColor}`, 'gi');
console.time("regex");
css.replace(regex, 'var(--primary)');
console.timeEnd("regex");
