'use strict';
require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');

async function testAnthropic() {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    console.error('No ANTHROPIC_API_KEY found');
    return;
  }
  
  console.log('Testing Anthropic key...');
  const anthropic = new Anthropic({ apiKey: key });
  
  try {
    const response = await anthropic.messages.create({
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6",
      max_tokens: 10,
      messages: [{ role: 'user', content: 'Hello' }],
    });
    console.log('SUCCESS:', response.content[0].text);
  } catch (err) {
    console.error('FAILED:', err.message);
  }
}

testAnthropic();
