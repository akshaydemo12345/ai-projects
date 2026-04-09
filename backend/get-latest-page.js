const { MongoClient } = require('mongodb');

async function main() {
  const uri = "mongodb://127.0.0.1:27017/ai_landing_builder";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('ai_landing_builder');
    const pages = database.collection('pages');

    const result = await pages.find().sort({ createdAt: -1 }).limit(1).toArray();
    
    if(result.length > 0) {
      const p = result[0];
      console.log("Found Latest Page:");
      console.log("_id:", p._id);
      console.log("title:", p.title);
      console.log("content type:", typeof p.content);
      
      if (typeof p.content === 'string') {
        console.log("Content is a string:");
        console.log("Length:", p.content.length);
        console.log("Starts with:\n" + p.content.substring(0, 300));
      } else {
        console.log("Content is an object:");
        console.log(JSON.stringify(p.content).substring(0, 300));
      }
    } else {
      console.log("No pages.");
    }

  } finally {
    await client.close();
  }
}
main().catch(console.error);
