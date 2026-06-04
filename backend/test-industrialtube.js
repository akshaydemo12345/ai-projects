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

  console.log(`   🌐 Checking: ${checkUrl}`);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const checkResponse = await fetch(checkUrl, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    console.log(`   📊 Response: ${checkResponse.status}`);

    if (checkResponse.status === 200) {
      const randomUrl = `${baseUrl}/test-${Date.now()}-xyz`;
      console.log(`   🔧 Testing catch-all routing...`);

      const catchAllController = new AbortController();
      const catchAllTimeout = setTimeout(() => catchAllController.abort(), 5000);
      const catchAllResponse = await fetch(randomUrl, {
        method: 'GET',
        signal: catchAllController.signal,
      }).catch(() => null);
      clearTimeout(catchAllTimeout);

      console.log(`   🔧 Random URL returned: ${catchAllResponse?.status || 'timeout/error'}`);

      if (!catchAllResponse || catchAllResponse.status !== 200) {
        console.log(`   ✅ Page "${slug}" EXISTS on website (real page detected)`);
        return true;
      }
      console.log(`   ⚠️  Site has catch-all routing (allows any URL)`);
    } else {
      console.log(`   ✅ Page "${slug}" does NOT exist (returned ${checkResponse.status})`);
    }
  } catch (err) {
    console.log(`   ⚠️  Error: ${err.message}`);
  }

  return false;
}

const testVerification = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-landing-page');
    console.log('✓ Connected to MongoDB\n');

    // Get the industrialtubecorp project
    const project = await Project.findById('6a1ec710757caa73a2e5aa51');
    if (!project) {
      console.log('❌ Project not found');
      process.exit(1);
    }

    console.log(`📌 Project: ${project.name}`);
    console.log(`🌐 Website: ${project.websiteUrl}\n`);
    console.log('Testing various slugs:\n');

    const slugsToTest = [
      'asda',           // Random non-existent
      'random-xyz',     // Random non-existent
      'about',          // Common page
      'contact',        // Common page
      'services',       // Common page
      'products',       // Common page
      'home',           // Common page
      'blog',           // Common blog page
    ];

    for (const slug of slugsToTest) {
      process.stdout.write(`Testing "${slug}"... `);
      const exists = await checkPageExistsOnExternalWebsite(project, slug);
      console.log(`\n   Result: ${exists ? '⛔ EXISTS' : '✅ AVAILABLE'}\n`);
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

testVerification();
