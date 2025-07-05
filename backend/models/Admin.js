const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  aadharNumber: { type: String, required: true, unique: true },
  aadharImage: { type: String, required: true }, // This will store the image URL/path
  isApproved: { type: Boolean, default: false },
  registrationDate: { type: Date, default: Date.now },
  isDefaultAdmin: { type: Boolean, required: true, default: false },
  role: { 
    type: String, 
    enum: ['super_admin', 'sub_admin'],
    default: 'sub_admin'
  },
  tokenVersion: {
    type: Number,
    default: 0
  },
  lastLogin: {
    type: Date
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  }
});

// Add method to increment failed login attempts
adminSchema.methods.incrementLoginAttempts = async function() {
  // Reset if lock has expired
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: {
        loginAttempts: 1
      },
      $unset: {
        lockUntil: 1
      }
    });
  }

  // Otherwise increment
  const updates = { $inc: { loginAttempts: 1 } };
  
  // Lock the account if we've reached max attempts and haven't locked it yet
  if (this.loginAttempts + 1 >= 5 && !this.lockUntil) {
    updates.$set = {
      lockUntil: Date.now() + 15 * 60 * 1000 // 15 minutes
    };
  }
  
  return this.updateOne(updates);
};

// Reset login attempts
adminSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $set: { loginAttempts: 0 },
    $unset: { lockUntil: 1 }
  });
};

module.exports = mongoose.model('Admin', adminSchema);