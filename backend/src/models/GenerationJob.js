const mongoose = require('mongoose');

// ═══════════════════════════════════════════════════════════
//  GenerationJob
//  Tracks a standalone AI landing-page generation request that
//  isn't tied to a Page/Project (i.e. POST /ai/generate without
//  a pageId). Generation runs in the background; the client polls
//  GET /ai/generate/status/:jobId instead of holding the original
//  HTTP request open for the full multi-pass generation time.
//  Documents auto-expire 1 hour after creation (TTL index) since
//  they're only needed long enough for the client to pick up the
//  result.
// ═══════════════════════════════════════════════════════════
const generationJobSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['generating', 'completed', 'failed'],
    default: 'generating',
  },
  progress: {
    type: Number,
    default: 5,
  },
  result: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  error: {
    type: String,
    default: null,
  },
  creditsRemaining: {
    type: Number,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600, // TTL: auto-delete 1 hour after creation
  },
});

module.exports = mongoose.model('GenerationJob', generationJobSchema);