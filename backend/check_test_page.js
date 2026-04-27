const mongoose = require('mongoose');
const Page = require('./src/models/Page');
require('dotenv').config();

async function checkPage() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/landing-page-generator');
  const page = await Page.findOne({ slug: 'dxade' });
  console.log('Page:', page ? JSON.stringify(page, null, 2) : 'Not found');
  process.exit();
}

checkPage();
