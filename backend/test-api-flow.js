const BASE_URL = 'http://localhost:5000';
const TEST_EMAIL = `testuser_${Date.now()}@example.com`;
const TEST_PASSWORD = 'Password123!';
const TEST_NAME = 'Test User';

let authToken = '';
let pageId = '';
let apiToken = '';

const runTest = async () => {
    try {
        console.log('🚀 Starting API Flow Test...');

        // 1. Signup
        console.log('\n--- Step 1: Signup ---');
        const signupRes = await fetch(`${BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: TEST_NAME, email: TEST_EMAIL, password: TEST_PASSWORD })
        });
        const signupData = await signupRes.json();
        if (signupRes.status !== 201) throw new Error(JSON.stringify(signupData));
        console.log('✅ Signup Success:', signupData.status);
        authToken = signupData.token;

        // 2. Login
        console.log('\n--- Step 2: Login ---');
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD })
        });
        const loginData = await loginRes.json();
        if (loginRes.status !== 200) throw new Error(JSON.stringify(loginData));
        console.log('✅ Login Success:', loginData.status);
        authToken = loginData.token;

        // 3. Create Page
        console.log('\n--- Step 3: Create Page ---');
        const createPageRes = await fetch(`${BASE_URL}/pages`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                title: 'My Test AI Page',
                slug: `test-page-${Date.now()}`,
                content: { hero: 'Hello World' }
            })
        });
        const createPageData = await createPageRes.json();
        if (createPageRes.status !== 201) throw new Error(JSON.stringify(createPageData));
        console.log('✅ Page Created:', createPageData.data.page._id);
        pageId = createPageData.data.page._id;

        // 4. Publish Page
        console.log('\n--- Step 4: Publish Page ---');
        const publishRes = await fetch(`${BASE_URL}/pages/${pageId}/publish`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ domain: 'my-wordpress-site.test' })
        });
        const publishData = await publishRes.json();
        if (publishRes.status !== 200) throw new Error(JSON.stringify(publishData));
        console.log('✅ Page Published:', publishData.message);
        apiToken = publishData.data.apiToken;
        console.log('🔑 API Token:', apiToken);

        // 5. Plugin Verification
        console.log('\n--- Step 5: Plugin Verification ---');
        const verifyRes = await fetch(`${BASE_URL}/plugin/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Host': 'my-wordpress-site.test',
                'User-Agent': 'WordPress/6.4.3; http://my-wordpress-site.test'
            },
            body: JSON.stringify({ api_key: apiToken })
        });
        const verifyData = await verifyRes.json();
        if (verifyRes.status !== 200) throw new Error(JSON.stringify(verifyData));
        console.log('✅ Plugin Verified Status:', verifyData.status);
        console.log('📍 Target URL (Base):', verifyData.target_url);

        console.log('\n✨ ALL TESTS PASSED! ✨');
    } catch (err) {
        console.error('❌ Test Failed!');
        console.error('Error Details:', err.message);
        process.exit(1);
    }
};

runTest();
