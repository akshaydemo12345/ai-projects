const mongoose = require('mongoose');
const Page = require('./backend/src/models/Page');
const Project = require('./backend/src/models/Project');

mongoose.connect('mongodb://localhost:27017/pagecraft', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const page = await Page.findOne().sort({ createdAt: -1 });
    console.log("PAGE logoUrl:", page.logoUrl);
    
    if (page.projectId) {
      const proj = await Project.findById(page.projectId);
      console.log("PROJ logoUrl:", proj.logoUrl);
      console.log("PROJ websiteProfile logo:", proj.websiteProfile?.identity?.logoUrl);
    }

    const html = page.content && (typeof page.content === 'string' ? page.content : page.content.fullHtml) || "";
    console.log("HTML has img src=", html.match(/<img[^>]*src="([^"]+)"[^>]*alt="Logo"[^>]*>/i)?.[1]);
    console.log("HTML has actual text Logo:", html.includes('>Logo<'));
    
    process.exit(0);
  });
