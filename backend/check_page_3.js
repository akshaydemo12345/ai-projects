const mongoose = require('mongoose');
require('dotenv').config();
const Page = require('./src/models/Page');
const fs = require('fs');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const page = await Page.findById('6a27f52ea250361f5ca3c916');
    if (!page) {
      console.log('Page not found');
      process.exit(0);
    }
    const html = page.content?.fullHtml || '';
    fs.writeFileSync('test_page.html', html);
    console.log('Wrote to test_page.html');
    process.exit(0);
  });
