const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/ai-landing-pages');
const Page = mongoose.model('Page', new mongoose.Schema({}, { strict: false }));
Page.find().select('slug title _id').limit(10).then(pages => {
  console.log("Pages:");
  pages.forEach(p => console.log(p.slug, p.title, p._id));
  process.exit(0);
});
