const { MongoClient } = require('mongodb');
async function run() {
  const client = new MongoClient('mongodb://testing-db-user:c81a2b00cd0520d1df2473e2d3ac0d10@91.205.230.11:34000/ai-landing-pages?authSource=ai-landing-pages');
  await client.connect();
  const db = client.db('ai-landing-pages');
  const pages = await db.collection('pages').find({}).toArray();
  for (const page of pages) {
    const lenContent = page.landingPageContent ? page.landingPageContent.length : 0;
    const lenStyles = page.landingPageStyles ? page.landingPageStyles.length : 0;
    console.log(`Page ${page._id}: content=${lenContent}, styles=${lenStyles}`);
  }
  await client.close();
}
run();
