require('dotenv').config();
const { default: mongoose } = require('mongoose');
const { createPage } = require('./src/controllers/pageController');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const req = {
    user: { id: '654a1f...99' },
    params: { projectId: '654...88' }, // Mock Project ID
    body: {
      name: 'Test Page',
      aiPrompt: 'Make me a great SaaS landing page for an AI chatbot',
      template: 'saas'
    }
  };

  // Override res
  const res = {
    status: (code) => ({
      json: (data) => {
        console.log("STATUS:", code);
        console.log("RESPONSE:", JSON.stringify(data, null, 2));
        process.exit(0);
      }
    })
  };

  // Note: we need to mock Project.findById to succeed.
  const Project = require('./src/models/Project');
  Project.findById = async () => ({ _id: '654...88', userId: { toString: () => '654a1f...99' } });

  await createPage(req, res);
}).catch(console.error);
