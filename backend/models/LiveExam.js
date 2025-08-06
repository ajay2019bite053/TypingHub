const mongoose = require('mongoose');

const liveExamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  isLive: { type: Boolean, default: false },
  joinLink: { type: String, required: true }, // Required again
  passage: { type: String, required: true },
  timeLimit: { type: Number, required: true },
  startTime: { type: String, required: false }, // e.g., '07:00'
  endTime: { type: String, required: false }    // e.g., '22:00'
}, {
  timestamps: true
});

module.exports = mongoose.model('LiveExam', liveExamSchema); 