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
  verifyResetToken
} = require('../controllers/userAuthController');
const userAuthMiddleware = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/verify-reset-token/:token', verifyResetToken);

// Protected routes
router.post('/logout', userAuthMiddleware, logout);
router.get('/check-auth', userAuthMiddleware, checkAuth);

module.exports = router; 