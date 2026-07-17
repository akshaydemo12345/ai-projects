const fs = require("fs");
let content = fs.readFileSync("src/lib/industryPrompts.ts", "utf-8");

// Remove "price" from Real Estate featured listings
content = content.replace(/image, price, key details/g, "image, key details, location");

// Let us modify the layout rules for Real Estate templates
const reStart = content.indexOf("\"Real Estate\": {");
const endOfPlumber = content.indexOf("\"Plumber\": {");

let reContent = content.substring(reStart, endOfPlumber);

const layouts = [
`IMPORTANT LAYOUT RULE: Arrange sections in this EXACT order:
1. Hero (full-width — MUST include an embedded inline lead capture form on the right or below the headline)
2. Trust/Stats Bar
3. Services / Features
4. About / Our Story
5. Featured Listings
6. How It Works / Process
7. Testimonials
8. FAQ (accordion)
9. Final CTA
10. Footer`,
`IMPORTANT LAYOUT RULE: Arrange sections in this EXACT order:
1. Hero (full-width, bold headline + CTA)
2. Featured Listings
3. Stats / Social Proof numbers
4. Services / Features
5. How It Works / Process
6. Lead Capture Form (mid-page, inline, compelling)
7. About / Our Story
8. Team / Experts
9. Testimonials
10. Footer`,
`IMPORTANT LAYOUT RULE: Arrange sections in this EXACT order:
1. Hero (minimal, bold)
2. Lead Capture Form (prominent, centered right below hero)
3. About / Our Story
4. Services / Features
5. Testimonials (prominent, large quotes)
6. Featured Listings
7. Stats / Social Proof
8. FAQ (accordion)
9. Final CTA
10. Footer`,
`IMPORTANT LAYOUT RULE: Arrange sections in this EXACT order:
1. Hero (split layout)
2. About / Our Story (right after hero)
3. How It Works / Process
4. Lead Capture Form (inline, elegant)
5. Featured Listings
6. Services / Features
7. Team / Experts
8. Testimonials
9. FAQ (accordion)
10. Footer`
];

let currentIndex = 0;
reContent = reContent.replace(/IMPORTANT LAYOUT RULE: Arrange sections in this EXACT order:[\s\S]*?10\. Footer/g, () => {
    const replacement = layouts[currentIndex];
    currentIndex++;
    return replacement || "";
});

content = content.substring(0, reStart) + reContent + content.substring(endOfPlumber);
fs.writeFileSync("src/lib/industryPrompts.ts", content);
console.log("Updated industryPrompts.ts successfully.");
