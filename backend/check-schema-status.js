
const mongoose = require('mongoose');
require('dotenv').config();

const Page = require('./src/models/Page');
const FormSchema = require('./src/models/FormSchema');

async function checkSchemas() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ai-landing-pages');
  
  const pages = await Page.find({}).limit(10).sort('-createdAt');
  console.log(`Found ${pages.length} total pages.`);
  
  for (const page of pages) {
    const schema = await FormSchema.findOne({ page_id: page._id });
    console.log(`Page: ${page.title} (${page._id}) [Method: ${page.generationMethod}] - Schema: ${schema ? 'FOUND (' + schema.fields.length + ' fields)' : 'MISSING'}`);
  }
  
  process.exit(0);
}

checkSchemas();
