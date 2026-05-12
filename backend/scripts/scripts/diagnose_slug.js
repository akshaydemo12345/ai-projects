const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Page = require('../src/models/Page');
const Project = require('../src/models/Project');

async function check() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ai-landing-page');
  
const slug = process.argv[2] || 'akshay-testing';
  console.log(`Checking slug: ${slug}`);
  
  const pages = await Page.find({ slug });
  console.log(`Found ${pages.length} pages:`);
  
  for (const page of pages) {
    const project = await Project.findById(page.projectId);
    console.log(`- ID: ${page._id}`);
    console.log(`  Project: ${project?.name} (ID: ${project?._id})`);
    console.log(`  Project PreSlug: "${project?.preSlug}"`);
    console.log(`  Status: ${page.status}`);
    console.log(`  IsDeleted: ${page.isDeleted || false}`);
    console.log(`  MetaTitle: ${page.metaTitle || 'N/A'}`);
    console.log(`  Styles Length: ${page.styles?.length || 0}`);
    console.log(`  LandingPageStyles Length: ${page.landingPageStyles?.length || 0}`);
    console.log(`  Content keys: ${typeof page.content === 'object' ? Object.keys(page.content).join(', ') : 'string'}`);
    console.log(`  Content Length: ${typeof page.content === 'string' ? page.content.length : (page.content?.fullHtml?.length || 0)}`);
  }
  
  // Also check if it's being searched as a part of a full path
  if (slug.includes('/')) {
    const parts = slug.split('/');
    const lastPart = parts[parts.length - 1];
    console.log(`\nDetected nested slug, checking last part: ${lastPart}`);
    const nestedPages = await Page.find({ slug: lastPart });
    console.log(`Found ${nestedPages.length} pages for "${lastPart}":`);
    for (const page of nestedPages) {
       const project = await Project.findById(page.projectId);
       console.log(`- ID: ${page._id}`);
       console.log(`  Project PreSlug: "${project?.preSlug}"`);
    }
  }

  process.exit(0);
}

check();
