const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  certificateId: {
    type: String,
    required: true,
    unique: true
  },
  typingSpeed: {
    type: Number,
    required: true
  },
  accuracy: {
    type: Number,
    required: true
  },
  testDate: {
    type: Date,
    default: Date.now
  },
  verificationCode: {
    type: String,
    required: true,
    unique: true
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  certificateUrl: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Generate unique certificate ID
certificateSchema.pre('save', function(next) {
  if (!this.certificateId) {
    this.certificateId = 'CERT-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }
  if (!this.verificationCode) {
    this.verificationCode = 'VC-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Certificate', certificateSchema); 