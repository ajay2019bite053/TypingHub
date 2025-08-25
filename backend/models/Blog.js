const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: { type: String, required: true }, // Can be userId or name/email
  text: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: null
  },
  category: {
    type: String,
    default: 'typing-tips',
    enum: ['typing-tips', 'exam-prep', 'success-stories', 'speed-techniques', 'practice-exercises']
  },
  tags: [{
    type: String,
    trim: true
  }],
  readTime: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0,
    min: 0
  },
  likes: {
    type: Number,
    default: 0,
    min: 0
  },
  author: {
    type: String,
    default: 'TypingHub'
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  }
}, {
  timestamps: true
});

// Index for efficient queries
blogSchema.index({ category: 1, createdAt: -1 });
blogSchema.index({ views: -1 });
blogSchema.index({ likes: -1 });
blogSchema.index({ status: 1 });

// Virtual for reading time calculation
blogSchema.virtual('calculatedReadTime').get(function() {
  if (this.readTime > 0) return this.readTime;
  
  const words = this.content.split(' ').length;
  return Math.ceil(words / 200); // 200 words per minute
});

// Pre-save middleware to calculate read time if not provided
blogSchema.pre('save', function(next) {
  if (!this.readTime || this.readTime === 0) {
    this.readTime = this.calculatedReadTime;
  }
  next();
});

module.exports = mongoose.model('Blog', blogSchema); 