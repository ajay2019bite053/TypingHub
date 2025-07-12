const mongoose = require('mongoose');

const deleteRequestSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['passage', 'test', 'question'],
    required: true,
    index: true
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'type'
  },
  itemName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  requestedBy: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
    index: true
  },
  reason: {
    type: String,
    trim: true,
    maxlength: 500
  },
  reviewedBy: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    email: {
      type: String,
      trim: true
    }
  },
  reviewedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Compound index for better query performance
deleteRequestSchema.index({ status: 1, createdAt: -1 });
deleteRequestSchema.index({ type: 1, itemId: 1 }, { unique: true });

module.exports = mongoose.model('DeleteRequest', deleteRequestSchema); 