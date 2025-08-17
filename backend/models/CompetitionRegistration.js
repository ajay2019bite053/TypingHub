const mongoose = require('mongoose');

const competitionRegistrationSchema = new mongoose.Schema({
  // User Information
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true,
    match: [/^[6-9]\d{9}$/, 'Please provide a valid mobile number']
  },
  
  // Competition Details
  competitionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Competition',
    required: true
  },
  
  // Secret ID for competition entry
  secretId: {
    type: String,
    required: false,
    unique: true
  },
  
  // Payment Information
  paymentId: {
    type: String,
    required: false, // Optional for free competitions
    default: 'FREE_COMPETITION'
  },
  paymentAmount: {
    type: Number,
    required: false, // Optional for free competitions
    default: 0
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded', 'free'],
    default: 'pending'
  },
  
  // Competition Status
  hasAttempted: {
    type: Boolean,
    default: false
  },
  testResult: {
    // Raw Metrics
    grossSpeed: {
      type: Number,
      default: 0
    },
    netSpeed: {
      type: Number,
      default: 0
    },
    accuracy: {
      type: Number,
      default: 0
    },
    wordAccuracy: {
      type: Number,
      default: 0
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
      default: 0
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
      default: 0
    },
    submittedAt: {
      type: Date
    }
  },
  
  // Ranking
  rank: {
    type: Number
  },
  prize: {
    type: Number,
    default: 0
  },
  
  // Timestamps
  registeredAt: {
    type: Date,
    default: Date.now
  },
  attemptedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for better query performance
competitionRegistrationSchema.index({ secretId: 1 });
competitionRegistrationSchema.index({ competitionId: 1, hasAttempted: 1 });
competitionRegistrationSchema.index({ mobile: 1, competitionId: 1 });

// Generate unique Secret ID
competitionRegistrationSchema.pre('save', async function(next) {
  if (this.isNew && !this.secretId) {
    try {
      this.secretId = await generateSecretId();
      console.log('Generated secretId:', this.secretId);
    } catch (error) {
      console.error('Error generating secretId:', error);
      return next(error);
    }
  }
  next();
});

// Function to generate unique Secret ID
async function generateSecretId() {
  const prefix = 'TH';
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 9000) + 1000; // 4-digit number
  const secretId = `${prefix}${year}-${randomNum}`;
  
  // Check if this ID already exists
  const existing = await mongoose.model('CompetitionRegistration').findOne({ secretId });
  if (existing) {
    return generateSecretId(); // Recursive call if ID exists
  }
  
  return secretId;
}

const CompetitionRegistration = mongoose.model('CompetitionRegistration', competitionRegistrationSchema);

module.exports = CompetitionRegistration;



