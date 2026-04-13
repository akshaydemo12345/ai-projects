require('dotenv').config();
const https = require('https');

const apiKey = process.env.ANTHROPIC_API_KEY;
console.log('Testing key:', apiKey ? apiKey.substring(0, 15) + '...' : 'MISSING');

const body = JSON.stringify({
  model: 'claude-instant-1.2',
  max_tokens: 100,
  messages: [{ role: 'user', content: 'test' }]
});

const options = {
  hostname: 'api.anthropic.com',
  path: '/v1/messages',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': apiKey,
    'anthropic-version': '2023-06-01',
    'Content-Length': Buffer.byteLength(body)
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('\n--- API RESPONSE ---');
    console.log('Status Code:', res.statusCode);
    try {
      console.log('Body:', JSON.stringify(JSON.parse(data), null, 2));
    } catch (e) {
      console.log('Raw Body:', data);
    }
  });
});

req.on('error', (e) => console.error('Request Error:', e.message));
req.write(body);
req.end();
