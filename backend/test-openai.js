'use strict';
require('dotenv').config();
const { generateLandingPageContent } = require('./src/services/aiService');

const testAI = async () => {
    console.log('--- OpenAI Connectivity Test ---');
    console.log('Model:', process.env.OPENAI_MODEL || 'gpt-4o-mini');
    console.log('Key Status:', process.env.OPENAI_API_KEY ? 'Present' : 'MISSING');
    
    if(!process.env.OPENAI_API_KEY) {
        console.error('ERROR: No OPENAI_API_KEY found in .env');
        process.exit(1);
    }

    try {
        console.log('Requesting generation for "Lumina AI" test business...');
        const result = await generateLandingPageContent({
            businessName: "Lumina AI Test",
            industry: "Technology",
            pageType: "lead generation",
            targetAudience: "Developers",
            businessDescription: "High-performance AI tools for local development.",
            ctaText: "Start Testing",
            aiPrompt: "Create a simple test JSON structure."
        });

        console.log('SUCCESS! OpenAI Response Received:', JSON.stringify(result, null, 2));
    } catch (err) {
        console.error('FAILED TO CONNECT:', err.message);
        if(err.message.includes('401')) console.error('HINT: Your API Key is likely invalid or unauthorized.');
        if(err.message.includes('Insufficient credits')) console.error('HINT: Your OpenAI account balance is zero.');
        process.exit(1);
    }
};

testAI();
