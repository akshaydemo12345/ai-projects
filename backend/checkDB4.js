const mongoose = require('mongoose');
const Page = require('./src/models/Page.js');
async function run() {
  await mongoose.connect('mongodb://127.0.0.1:27017/ai-landing-pages');
  const pages = await Page.find({}).sort({ createdAt: -1 }).limit(10);
  for (const page of pages) {
    console.log(`Page: ${page.title} | Method: ${page.generationMethod} | Tokens: ${page.aiUsage?.totalTokens} | ContentLength: ${page.landingPageContent ? page.landingPageContent.length : 0}`);
  }
  process.exit(0);
}
run();
