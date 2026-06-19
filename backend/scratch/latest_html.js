const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/ai-landing-pages');
const Page = mongoose.model('Page', new mongoose.Schema({ updatedAt: Date }, { strict: false }));
Page.find().sort({ updatedAt: -1 }).limit(1).then(pages => {
  const html = pages[0].get('landingPageContent') || '';
  const fs = require('fs');
  fs.writeFileSync('scratch/latest.html', html);
  console.log("Saved to scratch/latest.html");
  process.exit(0);
});
