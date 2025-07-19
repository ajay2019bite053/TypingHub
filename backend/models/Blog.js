const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: { type: String, required: true }, // Can be userId or name/email
  text: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String }, // Optional image URL or path
  likes: { type: Number, default: 0 },
  comments: [commentSchema],
  shareCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema); 