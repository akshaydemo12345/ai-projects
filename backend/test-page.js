require('dotenv').config();
const mongoose = require('mongoose');
const Page = require('./src/models/Page');

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai_landing_builder');

async function test() {
  const pages = await Page.find().sort({ createdAt: -1 }).limit(1);
  if (pages.length === 0) {
    console.log("No pages found");
  } else {
    const p = pages[0];
    console.log("Latest page:", p._id);
    console.log("Content type:", typeof p.content);
    if (typeof p.content === 'object') {
       console.log("Has fullHtml?", !!p.content.fullHtml);
       console.log("fullHtml length:", p.content.fullHtml ? p.content.fullHtml.length : 0);
       console.log("Snippet:", p.content.fullHtml ? p.content.fullHtml.substring(0, 200) : '');
       
       console.log("Regex match body:");
       const bodyMatch = p.content.fullHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
       console.log("extracted body length:", bodyMatch ? bodyMatch[1].length : 0);
    } else if (typeof p.content === 'string') {
       console.log("Content length:", p.content.length);
       console.log("Snippet:", p.content.substring(0, 200));
       
       console.log("Regex match body:");
       const bodyMatch = p.content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
       console.log("extracted body length:", bodyMatch ? bodyMatch[1].length : 0);
       
       console.log("Regex match styles:");
       let extractedCss = '';
       const styleMatches = p.content.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
       if (styleMatches) {
          styleMatches.forEach(tag => {
            const m = tag.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
            if (m) extractedCss += m[1] + '\n';
          });
       }
       console.log("extracted CSS length:", extractedCss.length);
    }
  }
  process.exit(0);
}

test();
