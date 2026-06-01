require('dotenv').config({path: './backend/.env'});
const fetch = require('node-fetch');

async function test(model) {
  const actualKey = process.env.GETIMG_API_KEY.startsWith('key-') ? process.env.GETIMG_API_KEY : `key-${process.env.GETIMG_API_KEY}`;
  console.log(`Testing model: ${model}`);
  const res = await fetch(`https://api.getimg.ai/v1/${model}/text-to-image`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${actualKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      prompt: "test",
      width: 512,
      height: 512,
      steps: 4,
      response_format: 'url'
    })
  });
  console.log("Status:", res.status);
  console.log("Response:", await res.text());
}

async function run() {
  await test('flux-schnell');
  await test('essential');
}
run();
