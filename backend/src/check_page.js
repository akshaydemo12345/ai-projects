const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Page = require('./models/Page');
const Project = require('./models/Project');

async function checkPage() {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('MONGO_URI not found in .env');
      return;
    }
    console.log(`Connecting to: ${mongoUri.replace(/:([^:@]+)@/, ':****@')}`);
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    const slug = 'seo-marketing';
    const pages = await Page.find({ slug, isDeleted: { $ne: true } });
    
    console.log(`\nFound ${pages.length} pages with slug "${slug}":`);
    for (const page of pages) {
      const project = await Project.findById(page.projectId);
      console.log(`- Page ID: ${page._id}`);
      console.log(`  Project ID: ${page.projectId}`);
      console.log(`  Project Name: ${project?.name || 'N/A'}`);
      console.log(`  Project Pre-Slug: "${project?.preSlug || ''}"`);
      console.log(`  Status: ${page.status}`);
      console.log(`  Website URL: ${project?.websiteUrl || 'N/A'}`);
    }

    if (pages.length === 0) {
      console.log('No pages found with that exact slug. Checking partial matches...');
      const partialPages = await Page.find({ slug: new RegExp(slug, 'i'), isDeleted: { $ne: true } });
      console.log(`Found ${partialPages.length} partial matches:`);
      for (const page of partialPages) {
        console.log(`- ${page.slug} (ID: ${page._id})`);
      }
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

checkPage();
