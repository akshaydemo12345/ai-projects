const mongoose = require('mongoose');
require('dotenv').config();
const Page = require('./src/models/Page');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const page = await Page.findById('6a27f52ea250361f5ca3c916').lean();
    if (!page) {
      console.log('Page not found');
      process.exit(0);
    }
    console.log(Object.keys(page));
    console.log('landingPageContent type:', typeof page.landingPageContent, 'length:', page.landingPageContent?.length);
    console.log('content type:', typeof page.content, 'is array?', Array.isArray(page.content));
    if (typeof page.content === 'object' && page.content !== null) {
       console.log('content keys:', Object.keys(page.content));
    }
    process.exit(0);
  });
