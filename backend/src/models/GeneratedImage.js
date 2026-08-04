const mongoose = require('mongoose');

const generatedImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  prompt: {
    type: String,
    required: false,
  },
  base64: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('GeneratedImage', generatedImageSchema);
