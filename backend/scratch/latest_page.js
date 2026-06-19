const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/ai-landing-pages');
const Page = mongoose.model('Page', new mongoose.Schema({
  updatedAt: Date
}, { strict: false }));
Page.find().sort({ updatedAt: -1 }).limit(1).then(pages => {
  if (!pages.length) process.exit(0);
  const p = pages[0];
  console.log("Slug:", p.get('slug'));
  console.log("Updated:", p.get('updatedAt'));
  console.log("Has Swiper:", (p.get('landingPageContent')||'').includes('swiper'));
  console.log("Has script js:", (p.get('landingPageContent')||'').includes('doInit'));
  process.exit(0);
});
