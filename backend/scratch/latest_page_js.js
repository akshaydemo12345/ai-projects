const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/ai-landing-pages');
const Page = mongoose.model('Page', new mongoose.Schema({ updatedAt: Date }, { strict: false }));
Page.find().sort({ updatedAt: -1 }).limit(1).then(pages => {
  const html = pages[0].get('landingPageContent') || '';
  const match = html.match(/<script>([\s\S]*?)<\/script>/g);
  if (match) console.log(match.join('\n\n').substring(0, 500));
  else console.log('no scripts');
  process.exit(0);
});
