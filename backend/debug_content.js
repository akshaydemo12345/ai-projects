const mongoose = require('mongoose');
const Page = require('./src/models/Page');

async function check() {
  await mongoose.connect('mongodb://localhost:27017/ai-landing-page');
  const page = await Page.findOne({ slug: 'akshay-testing' });
  console.log('--- CONTENT ---');
  console.log(page.content?.fullHtml ? 'Has HTML' : 'No HTML');
  console.log('--- THANK YOU CONTENT ---');
  console.log(page.thankYouContent ? 'Has TY Content' : 'No TY Content');
  process.exit(0);
}
check();
