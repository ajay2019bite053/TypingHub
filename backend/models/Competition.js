const mongoose = require('mongoose');

const competitionSchema = new mongoose.Schema({
  // Competition Configuration
  isRegistrationActive: {
    type: Boolean,
    default: false
  },
  isCompetitionActive: {
    type: Boolean,
    default: false
  },
  entryFee: {
    type: Number,
    default: 10,
    min: 0
  },
  maxSlots: {
    type: Number,
    default: 100,
    min: 1
  },
  minSlots: {
    type: Number,
    default: 10,
    min: 1
  },
  prizes: {
    first: {
      type: Number,
      default: 100,
      min: 0
    },
    second: {
      type: Number,
      default: 50,
      min: 0
    },
    third: {
      type: Number,
      default: 25,
      min: 0
    }
  },
  
  // Competition Details
  title: {
    type: String,
    default: 'TypingHub Weekly Competition'
  },
  description: {
    type: String,
    default: 'Weekly typing competition for all users'
  },
  passage: {
    type: String,
    default: 'Welcome to TypingHub Weekly Competition! This is a test passage for the typing competition. Participants will be tested on their typing speed and accuracy using this text. The competition aims to improve typing skills and provide a platform for users to showcase their abilities. Good luck to all participants!'
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  
  // Competition Status
  status: {
    type: String,
    enum: ['upcoming', 'registration', 'live', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  resultsPublished: {
    type: Boolean,
    default: false
  },
  
  // Results
  results: [{
    secretId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    mobile: {
      type: String,
      required: true
    },
    // Raw Metrics
    grossSpeed: {
      type: Number,
      required: true
    },
    netSpeed: {
      type: Number,
      required: true
    },
    accuracy: {
      type: Number,
      required: true
    },
    wordAccuracy: {
      type: Number,
      required: true
    },
    mistakes: {
      type: Number,
      default: 0
    },
    backspaces: {
      type: Number,
      default: 0
    },
    totalWords: {
      type: Number,
      default: 0
    },
    correctWords: {
      type: Number,
      default: 0
    },
    incorrectWords: {
      type: Number,
      default: 0
    },
    timeTaken: {
      type: Number,
      required: true
    },
    // Calculated Scores
    speedScore: {
      type: Number,
      default: 0
    },
    accuracyScore: {
      type: Number,
      default: 0
    },
    efficiencyScore: {
      type: Number,
      default: 0
    },
    completionScore: {
      type: Number,
      default: 0
    },
    finalScore: {
      type: Number,
      default: 0
    },
    // Legacy field for backward compatibility
    speed: {
      type: Number,
      required: true
    },
    rank: {
      type: Number
    },
    prize: {
      type: Number,
      default: 0
    },
    submittedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Statistics
  totalRegistrations: {
    type: Number,
    default: 0
  },
  totalParticipants: {
    type: Number,
    default: 0
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
competitionSchema.index({ status: 1, startDate: 1 });
competitionSchema.index({ 'results.secretId': 1 });

const Competition = mongoose.model('Competition', competitionSchema);

module.exports = Competition;

