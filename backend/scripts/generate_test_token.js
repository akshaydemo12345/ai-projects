const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ai-landing-page';
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

async function generate() {
  try {
    await mongoose.connect(MONGO_URI);
    const User = mongoose.model('User', new mongoose.Schema({ email: String }));
    const user = await User.findOne();
    
    if (!user) {
      console.error('No users found in database');
      process.exit(1);
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    console.log('USER_ID:', user._id);
    console.log('TOKEN:', token);
    process.exit(0);
  } catch (err) {
    console.error('Error generating token:', err.message);
    process.exit(1);
  }
}

generate();
