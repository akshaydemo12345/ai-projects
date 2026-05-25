const mongoose = require('mongoose');
require('dotenv').config();
const Page = require('./src/models/Page');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ai_landing_pages', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const page = await Page.findOne({ slug: 'testing-plugin-changes' });
    if(page) {
        console.log(JSON.stringify(page.thankYouPageContent, null, 2));
    }
    process.exit(0);
  });
