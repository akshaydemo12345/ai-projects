const mongoose = require('mongoose');
const Page = require('./src/models/Page');
require('dotenv').config();

async function checkPages() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ai-landing-page');
  const pages = await Page.find({});
  console.log('Total Pages:', pages.length);
  pages.forEach(p => {
    console.log(`ID: ${p._id}, Title: ${p.title}, Status: ${p.status}, apiToken: ${p.apiToken}`);
    console.log(`Content:`, JSON.stringify(p.content, null, 2));
    console.log('---');
  });
  process.exit();
}

checkPages();
