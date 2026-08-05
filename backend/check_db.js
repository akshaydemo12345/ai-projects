const mongoose = require('mongoose');
const Page = require('./src/models/Page');
const Project = require('./src/models/Project');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const page = await Page.findOne().sort({ createdAt: -1 });
    console.log("PAGE logoUrl:", page?.logoUrl);
    
    if (page && page.projectId) {
      const proj = await Project.findById(page.projectId);
      console.log("PROJ logoUrl:", proj?.logoUrl);
      console.log("PROJ websiteProfile logo:", proj?.websiteProfile?.identity?.logoUrl);
    }

    const html = page?.content && (typeof page.content === 'string' ? page.content : page.content.fullHtml) || "";
    const imgMatch = html.match(/<img[^>]*src="([^"]+)"[^>]*>/ig);
    console.log("HTML img tags:", imgMatch);
    console.log("HTML has actual text Logo:", html.includes('>Logo<') || html.includes('Logo left'));
    
    process.exit(0);
  });
