const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });

const Page = require('./backend/src/models/Page');
const Project = require('./backend/src/models/Project');

async function checkPage() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ai-landing-page');
  console.log('Connected to DB');

  const page = await Page.findOne({ slug: 'priti-demo' });
  if (!page) {
    console.log('Page "priti-demo" not found');
    process.exit(0);
  }

  console.log('Page Found:', {
    _id: page._id,
    slug: page.slug,
    projectId: page.projectId,
    status: page.status,
    websiteUrl: page.websiteUrl
  });

  if (page.projectId) {
    const project = await Project.findById(page.projectId);
    if (project) {
      console.log('Project Found:', {
        _id: project._id,
        name: project.name,
        websiteUrl: project.websiteUrl,
        apiToken: project.apiToken
      });
    } else {
      console.log('Project for page not found');
    }
  }

  process.exit(0);
}

checkPage().catch(err => {
  console.error(err);
  process.exit(1);
});
