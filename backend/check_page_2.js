const mongoose = require('mongoose');
require('dotenv').config();
const Page = require('./src/models/Page');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const page = await Page.findById('6a27f52ea250361f5ca3c916');
    if (!page) {
      console.log('Page not found');
      process.exit(0);
    }
    const html = page.content?.fullHtml || '';
    
    // Look for anything that resembles a FAQ or question/answer
    const matches = html.match(/class="[^"]*(faq|accordion|question|answer|toggle|hidden)[^"]*"/gi);
    console.log("Found classes containing faq/accordion/question/answer/toggle/hidden:");
    console.log([...new Set(matches)]);
    
    process.exit(0);
  });
