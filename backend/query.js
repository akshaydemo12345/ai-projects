const mongoose = require('mongoose');
const Project = require('./src/models/Project');
mongoose.connect('mongodb://localhost:27017/ai_landing_pages')
  .then(async () => {
    const projects = await Project.find({ preSlug: "testing-plugin-changes" });
    projects.forEach(p => console.log("Project preSlug:", p.preSlug));
    process.exit(0);
  });
