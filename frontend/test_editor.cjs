const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    
    // Capture console messages
    page.on('console', msg => {
        console.log(`[Browser Console ${msg.type().toUpperCase()}]:`, msg.text());
    });
    // Capture uncaught exceptions
    page.on('pageerror', error => {
        console.log(`[Browser Page Error]:`, error.message);
    });
    // Capture failed requests
    page.on('requestfailed', request => {
        console.log(`[Browser Request Failed]: ${request.url()} - ${request.failure().errorText}`);
    });

    console.log("Navigating to login...");
    await page.goto('http://localhost:8080/login');
    
    // Attempt basic login to establish session, if dummy credentials work
    try {
        await page.waitForSelector('input[type="email"]', { timeout: 3000 });
        await page.type('input[type="email"]', 'test@gmail.com');
        await page.type('input[type="password"]', 'password');
        await page.click('button[type="submit"]');
        await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 5000 }).catch(() => {});
        console.log("Login attempted. Current URL:", page.url());
    } catch(err) {
        console.log("Login error or not needed:", err.message);
    }
    
    console.log("Navigating to dashboard/projects...");
    await page.goto('http://localhost:8080/dashboard');
    await page.waitForTimeout(2000);
    
    // Try to find a project page/editor link
    const html = await page.content();
    const editorMatch = html.match(/\/editor\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+/);
    if(editorMatch) {
       console.log("Found editor URL:", editorMatch[0]);
       await page.goto('http://localhost:8080' + editorMatch[0]);
       await page.waitForTimeout(5000);
       console.log("Editor loaded.");
    } else {
       console.log("No editor URL found in dashboard. Creating dummy IDs to test editor page.");
       // use fake IDs just to see if the page boots or crashes
       await page.goto('http://localhost:8080/editor/dummyProject/dummyPage');
       await page.waitForTimeout(5000);
       console.log("Editor loaded with dummy IDs.");
    }

    await browser.close();
})();
