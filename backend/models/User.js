const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email'
    ]
  },
  mobile: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password must be at least 8 characters']
  },
  avatar: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['user', 'premium'],
    default: 'user'
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },
  stats: {
    totalCourses: {
      type: Number,
      default: 0
    },
    purchasedCourses: {
      type: Number,
      default: 0
    },
    typingAccuracy: {
      type: Number,
      default: 0
    },
    mockTestsTaken: {
      type: Number,
      default: 0
    },
    dailyStreak: {
      type: Number,
      default: 0
    }
  },
  achievements: [{
    name: String,
    description: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Card', default: [] }],
  lastLogin: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  typingStats: {
    averageSpeed: {
      type: Number,
      default: 0
    },
    averageAccuracy: {
      type: Number,
      default: 0
    },
    testsCompleted: {
      type: Number,
      default: 0
    },
    bestSpeed: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Update lastLogin before saving
userSchema.pre('save', function(next) {
  if (this.isNew) {
    this.lastLogin = new Date();
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User; 