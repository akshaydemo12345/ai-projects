'use strict';

require('dotenv').config();
const { analyzeWebsite } = require('./src/services/analyzeService');

async function testAnalyze() {
  const testUrl = 'https://openai.com'; // Testing with a well-known site
  console.log(`🚀 Testing analyzeWebsite with URL: ${testUrl}`);
  
  try {
    const result = await analyzeWebsite(testUrl);
    console.log('✅ Analysis Successful!');
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error('❌ Analysis Failed:', err.message);
    if (err.stack) console.error(err.stack);
  }
}

testAnalyze();
