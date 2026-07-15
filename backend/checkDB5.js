const mongoose = require('mongoose');
const Page = require('./src/models/Page.js');
async function run() {
  await mongoose.connect('mongodb://127.0.0.1:27017/ai-landing-pages');
  const page = await Page.findOne({ title: /csacasc/i });
  if (page) {
    console.log(`Page: ${page.title} | Method: ${page.generationMethod} | Tokens: ${page.aiUsage?.totalTokens} | ContentLength: ${page.landingPageContent ? page.landingPageContent.length : (page.content?.fullHtml ? page.content.fullHtml.length : 0)}`);
  } else {
    console.log("Not found");
  }
  process.exit(0);
}
run();
