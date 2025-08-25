const mongoose = require('mongoose');

const blogViewSchema = new mongoose.Schema({
  blogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
    required: true
  },
  identifier: {
    type: String,
    required: true,
    index: true
  },
  userAgent: {
    type: String,
    required: true
  },
  referrer: {
    type: String,
    default: ''
  },
  ipAddress: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
blogViewSchema.index({ identifier: 1, createdAt: 1 });

// TTL index to automatically delete old views (after 30 days)
blogViewSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

module.exports = mongoose.model('BlogView', blogViewSchema);

