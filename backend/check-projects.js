require('dotenv').config();
const mongoose = require('mongoose');

const Project = require('./src/models/Project');

const checkProjects = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-landing-page');
    console.log('✓ Connected to MongoDB');

    const projects = await Project.find().select('_id name business.contacts.website createdAt');
    
    if (projects.length === 0) {
      console.log('\n❌ No projects found in database');
      process.exit(1);
    }

    console.log(`\n📋 Found ${projects.length} project(s):\n`);
    projects.forEach((project, idx) => {
      const websiteUrl = project.business?.contacts?.website;
      console.log(`${idx + 1}. Project Name: ${project.name}`);
      console.log(`   Project ID: ${project._id}`);
      console.log(`   Website URL: ${websiteUrl || '❌ NOT SET'}`);
      console.log(`   Created: ${project.createdAt}`);
      console.log('');
    });

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

checkProjects();
