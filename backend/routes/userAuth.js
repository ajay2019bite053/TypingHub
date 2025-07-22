const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  forgotPassword, 
  resetPassword,
  logout,
  checkAuth,
  refreshToken,
  verifyResetToken,
  requestOtp,
  verifyOtp,
  resetPasswordWithOtp
} = require('../controllers/userAuthController');
const userAuthMiddleware = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);

// OTP-based password reset
router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password-otp', resetPasswordWithOtp);

// Protected routes
router.post('/logout', userAuthMiddleware, logout);
router.get('/check-auth', userAuthMiddleware, checkAuth);

module.exports = router; 