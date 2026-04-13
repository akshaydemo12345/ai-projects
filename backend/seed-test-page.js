'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const Page = require('./src/models/Page');
const User = require('./src/models/User');

async function seedTestPage() {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ai-landing-page';
  
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // 1. Find or create a test user
    let user = await User.findOne({ email: 'tester@example.com' });
    if (!user) {
      user = await User.create({
        name: 'Test User',
        email: 'tester@example.com',
        password: 'Password123!', // Note: Model should hash this, but we're just seeding
        credits: 10
      });
      console.log('✅ Created test user');
    }

    // 2. Create a test page
    const apiToken = 'test-api-token-12345';
    const slug = 'test-destination';
    
    // Clear existing test page if any
    await Page.deleteOne({ apiToken });

    const page = await Page.create({
      userId: user._id,
      title: 'Test Landing Page',
      slug: slug,
      content: '<h1>Welcome to the AI Landing Page</h1><p>This is proxied content.</p>',
      status: 'published',
      domain: 'my-wordpress-site.test',
      apiToken: apiToken,
      publishedAt: Date.now()
    });

    console.log('✅ Created test page:');
    console.log(`   - ID: ${page._id}`);
    console.log(`   - Slug: ${page.slug}`);
    console.log(`   - API Token: ${page.apiToken}`);
    console.log(`   - Authorized Domain: ${page.domain}`);

    await mongoose.disconnect();
    console.log('✅ Disconnected');
  } catch (err) {
    console.error('❌ Seeding Failed:', err.message);
    process.exit(1);
  }
}

seedTestPage();
