const mongoose = require('mongoose');

const liveExamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  isLive: { type: Boolean, default: false },
  joinLink: { type: String, required: true },
  passage: { type: String, required: true },
  timeLimit: { type: Number, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('LiveExam', liveExamSchema); 