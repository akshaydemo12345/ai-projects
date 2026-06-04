require('dotenv').config();
const mongoose = require('mongoose');

const Project = require('./src/models/Project');

// Simulating the checkPageExistsOnExternalWebsite function
async function checkPageExistsOnExternalWebsite(project, slug) {
  if (!project?.websiteUrl || !slug) {
    console.log(`❌ Skipping external check: websiteUrl=${!!project?.websiteUrl}, slug=${!!slug}`);
    return false;
  }

  let baseUrl = project.websiteUrl;
  if (!baseUrl.startsWith('http')) {
    baseUrl = 'https://' + baseUrl;
  }
  baseUrl = baseUrl.replace(/\/+$|\s+/g, '');
  const checkUrl = `${baseUrl}/${slug}`;

  console.log(`\n🔍 Checking if page exists: ${checkUrl}`);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const checkResponse = await fetch(checkUrl, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    console.log(`   Response status: ${checkResponse.status}`);

    if (checkResponse.status === 200) {
      const randomUrl = `${baseUrl}/pagecraft-test-404-${Date.now()}`;
      console.log(`   Testing catch-all routing: ${randomUrl}`);

      const catchAllController = new AbortController();
      const catchAllTimeout = setTimeout(() => catchAllController.abort(), 5000);
      const catchAllResponse = await fetch(randomUrl, {
        method: 'GET',
        signal: catchAllController.signal,
      }).catch(() => null);
      clearTimeout(catchAllTimeout);

      console.log(`   Catch-all test status: ${catchAllResponse?.status}`);

      if (!catchAllResponse || catchAllResponse.status !== 200) {
        console.log(`✅ Page "${slug}" EXISTS on website`);
        return true;
      }
      console.log(`⚠️  Site has catch-all routing (random URL also returned 200)`);
    } else {
      console.log(`✅ Page "${slug}" does NOT exist on website (returned ${checkResponse.status})`);
    }
  } catch (err) {
    console.log(`⚠️  Could not verify: ${err.message}`);
  }

  return false;
}

const testVerification = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-landing-page');
    console.log('✓ Connected to MongoDB\n');

    // Test with purplle.com project
    const project = await Project.findById('6a1e921296b39bdb04357f7c');
    if (!project) {
      console.log('❌ Project not found');
      process.exit(1);
    }

    console.log(`📌 Testing project: ${project.name}`);
    console.log(`   Website: ${project.websiteUrl}\n`);

    // Test 1: Random slug that shouldn't exist
    console.log('TEST 1: Random slug (should not exist)');
    await checkPageExistsOnExternalWebsite(project, 'asda');

    // Test 2: Common page name
    console.log('\n' + '='.repeat(60));
    console.log('TEST 2: Common page name');
    await checkPageExistsOnExternalWebsite(project, 'about');

    // Test 3: Another slug
    console.log('\n' + '='.repeat(60));
    console.log('TEST 3: Home page');
    await checkPageExistsOnExternalWebsite(project, 'home');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

testVerification();
