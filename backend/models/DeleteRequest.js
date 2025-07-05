const mongoose = require('mongoose');

const deleteRequestSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['passage', 'test', 'question'],
    required: true
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'type'
  },
  itemName: {
    type: String,
    required: true
  },
  requestedBy: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DeleteRequest', deleteRequestSchema); 