const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { 
  register, 
  login, 
  refreshToken, 
  logout, 
  checkAuth, 
  forgotPassword, 
  resetPassword, 
  verifyResetToken,
  googleAuth,
  googleCallback,
  githubAuth,
  githubCallback
} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `aadhar-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1
  }
});

// Public routes
router.post('/register', upload.single('aadharImage'), register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Protected routes
router.post('/logout', authMiddleware, logout);

// Routes
router.get('/check-auth', authMiddleware, checkAuth);
router.post('/verify-reset-token/:token', verifyResetToken);

// Social auth routes
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);
router.get('/github', githubAuth);
router.get('/github/callback', githubCallback);

module.exports = router;