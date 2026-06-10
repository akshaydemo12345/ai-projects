const mongoose = require('mongoose');
require('dotenv').config();
const Page = require('./src/models/Page');
const fs = require('fs');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const page = await Page.findById('6a27f52ea250361f5ca3c916');
    fs.writeFileSync('test_page.html', page.landingPageContent);
    process.exit(0);
  });
