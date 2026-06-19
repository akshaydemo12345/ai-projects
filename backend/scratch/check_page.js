const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/ai-landing-pages');
const Page = mongoose.model('Page', new mongoose.Schema({}, { strict: false }));
Page.findOne({ slug: 'qwsqwsq' }).then(page => {
  if (!page) { console.log('not found'); process.exit(0); }
  const html = page.get('landingPageContent') || page.get('content') || '';
  console.log(html.substring(0, 1000));
  process.exit(0);
});
