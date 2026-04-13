const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const dropIndex = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai-landing-page');
    console.log('Connected to MongoDB');

    const collection = mongoose.connection.collection('pages');
    const indexes = await collection.indexes();
    console.log('Current indexes:', indexes.map(idx => idx.name));

    if (indexes.some(idx => idx.name === 'domain_1')) {
      await collection.dropIndex('domain_1');
      console.log('Successfully dropped domain_1 index');
    } else {
      console.log('domain_1 index not found');
    }

    await mongoose.disconnect();
    console.log('Disconnected');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

dropIndex();
