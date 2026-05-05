
const mongoose = require('mongoose');
require('dotenv').config();

async function checkProjects() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-landing-page';
  console.log('Connecting to:', uri);
  
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
    
    const Project = mongoose.model('Project', new mongoose.Schema({
      name: String,
      apiToken: String,
      isDeleted: Boolean
    }));
    
    const projects = await Project.find({ isDeleted: { $ne: true } });
    console.log('\n--- ACTIVE PROJECTS ---');
    projects.forEach(p => {
      console.log(`Name: ${p.name}`);
      console.log(`Token: ${p.apiToken}`);
      console.log('-----------------------');
    });
    
    if (projects.length === 0) {
      console.log('No active projects found.');
    }
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

checkProjects();
