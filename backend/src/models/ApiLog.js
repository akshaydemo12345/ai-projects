const mongoose = require('mongoose');

const apiLogSchema = new mongoose.Schema({
  user: {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: String,
    email: String
  },
  page: {
    page_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Page'
    },
    page_name: String,
    module: {
      type: String,
      default: 'AI Generation'
    },
    action: String
  },
  api_usage: {
    model: String,
    endpoint: String,
    tokens: {
      input: { type: Number, default: 0 },
      output: { type: Number, default: 0 },
      total: { type: Number, default: 0 }
    },
    cost: { type: Number, default: 0 }
  },
  system_info: {
    ip_address: String,
    browser: String,
    os: String,
    device: String
  },
  status: {
    success: { type: Boolean, default: true },
    error_message: String
  },
  timestamps: {
    request_time: { type: Date, default: Date.now },
    response_time: Date,
    created_at: { type: Date, default: Date.now }
  }
}, {
  timestamps: true
});

// Index for faster queries
apiLogSchema.index({ 'user.user_id': 1, 'timestamps.created_at': -1 });

const ApiLog = mongoose.model('ApiLog', apiLogSchema);

module.exports = ApiLog;
