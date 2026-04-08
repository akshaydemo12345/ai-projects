const mongoose = require('mongoose');

const update = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/ai-landing-page');
    console.log('Connected to MongoDB');

    const page = await mongoose.connection.collection('pages').findOne({ slug: 'my-landing-page' });

    if (!page) {
      console.log('Page not found.');
      process.exit(1);
    }

    const result = await mongoose.connection.collection('pages').updateOne(
      { slug: 'my-landing-page' },
      {
        $set: {
          title: 'Updated AI Landing Page',
          content: {
            hero: {
              headline: 'Welcome to your AI-Optimized Page!',
              subheadline: 'Automatic flush is now working!',
              cta: 'Click Me'
            },
            features: [
              { title: 'akshay testing', description: 'Zero-latency content delivery.' },
              { title: 'AI Driven', description: 'Automatically optimized headings.' }
            ]
          },
          updatedAt: new Date()
        }
      }
    );

    console.log(`Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);

    // Trigger Remote Flush
    if (page.domain && page.apiToken) {
      console.log(`🔄 Notifying WordPress (${page.domain})...`);

      const http = require('http');
      const parts = page.domain.split(':');
      const host = parts[0];
      const port = parts[1] || 80;

      const options = {
        hostname: host,
        port: port,
        path: '/wp-json/domain-mapper/v1/flush',
        method: 'POST',
        headers: {
          'X-DM-API-Key': page.apiToken,
          'Content-Length': 0
        },
        timeout: 5000
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (c) => data += c);
        res.on('end', () => {
          console.log(`✅ Remote flush success: ${res.statusCode} ${data}`);
          mongoose.disconnect().then(() => process.exit(0));
        });
      });

      req.on('error', (e) => {
        console.log(`❌ Remote flush failed: ${e.message}`);
        mongoose.disconnect().then(() => process.exit(1));
      });

      req.end();
    } else {
      await mongoose.disconnect();
      process.exit(0);
    }
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

update();
