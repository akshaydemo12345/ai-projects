const mongoose = require('mongoose');
require('dotenv').config();
const Page = require('./src/models/Page');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const page = await Page.findById('6a27f52ea250361f5ca3c916');
    if (!page) {
      console.log('Page not found');
    } else {
      console.log('Page Name:', page.title);
      console.log('\n--- FAQ SECTION HTML ---');
      const html = page.content?.fullHtml || '';
      const parts = html.split('cursor-pointer');
      if (parts.length > 1) {
         console.log("FOUND cursor-pointer! Context:");
         console.log(html.substring(html.indexOf('cursor-pointer') - 200, html.indexOf('cursor-pointer') + 600));
      } else {
         console.log('No cursor-pointer found.');
         const details = html.match(/<details[\s\S]*?<\/details>/gi);
         if (details) console.log('Found details tag:', details[0]);
      }
    }
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
