const mongoose = require('mongoose');
const Page = require('./src/models/Page.js');
async function run() {
  await mongoose.connect('mongodb://127.0.0.1:27017/ai-landing-pages');
  const page = await Page.findOne({ title: 'csacascwcwqcwqfcwq' });
  if (!page) { console.log('No page found with that name'); process.exit(0); }
  
  let content = page.landingPageContent;
  if (!content) {
    if (typeof page.content === 'string') content = page.content;
    else content = page.content?.fullHtml;
  }
  
  console.log("Page Name:", page.title);
  console.log("Method:", page.generationMethod);
  console.log("Tokens:", page.aiUsage?.totalTokens);
  if (!content) console.log("CONTENT IS COMPLETELY EMPTY");
  else {
    console.log("Content Length:", content.length);
    console.log("Starts with:", content.substring(0, 100));
    console.log("Ends with:", content.substring(content.length - 100));
  }
  process.exit(0);
}
run();
