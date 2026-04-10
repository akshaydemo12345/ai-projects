const dbContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Test</title>
    <style>
      body { color: red; }
    </style>
</head>
<body>
    <div id="wrapper">
        <h1>Hello</h1>
    </div>
</body>
</html>`;

        let extractedHtml = dbContent;
        let extractedCss = '';
        
        const bodyMatch = dbContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        if (bodyMatch) {
          extractedHtml = bodyMatch[1];
        }

        const styleMatches = dbContent.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
        if (styleMatches) {
          extractedCss = '';
          styleMatches.forEach(tag => {
            const m = tag.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
            if (m) extractedCss += m[1] + '\n';
          });
        }

console.log("HTML:", extractedHtml);
console.log("CSS:", extractedCss);
