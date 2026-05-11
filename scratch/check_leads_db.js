const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

const Lead = require('../backend/src/models/Lead');

async function checkLeads() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-landing-pages';
    console.log('Connecting to:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('Connected to DB');
    
    const latestLeads = await Lead.find().sort({ createdAt: -1 }).limit(5).lean();
    console.log('Latest 5 leads:');
    latestLeads.forEach((l, i) => {
      console.log(`\n--- Lead ${i+1} ---`);
      console.log('ID:', l._id);
      console.log('PageSlug:', l.pageSlug);
      console.log('UTM:', JSON.stringify(l.utm, null, 2));
      console.log('Meta URL:', l.meta?.url);
      console.log('Data Keys:', Object.keys(l.data || {}));
    });
    
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

checkLeads();
