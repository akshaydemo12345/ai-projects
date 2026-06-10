require('dotenv').config();
const API_KEY = process.env.GETIMG_API_KEY || '3eN1TZwy915cfl344JDr5FKOQGtrRTV8MsKS519K9nqhWakXqh5bU9BU6iwebRIorqNuMYF7hxK3V85jZ1F3ZKAxBbqZq3wQ';

async function test() {
  const actualKey = API_KEY.startsWith('key-') ? API_KEY : `key-${API_KEY}`;
  const response = await fetch('https://api.getimg.ai/v1/flux-schnell/text-to-image', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${actualKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      prompt: "a cat",
      width: 512,
      height: 512,
      steps: 4,
      output_format: 'jpeg',
      response_format: 'b64'
    })
  });
  
  const text = await response.text();
  if (response.ok) {
    const data = JSON.parse(text);
    console.log('Success! Keys:', Object.keys(data));
    console.log('Is base64 string?', typeof data.image === 'string');
  } else {
    console.log('Error:', response.status, text);
  }
}
test();
