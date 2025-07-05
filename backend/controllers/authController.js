const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const {
  hashPassword,
  comparePassword,
  generateTokens,
  setCookies,
  formatAuthResponse,
  formatErrorResponse,
  sendResetEmail,
  generateResetToken
} = require('../utils/authUtils');

// Token blacklist (in-memory for now, should be moved to Redis in production)
const tokenBlacklist = new Set();

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Register a new admin
const register = async (req, res) => {
  try {
    const { name, email, phone, address, aadharNumber, password } = req.body;
    const aadharImage = req.file;

    // Validate required fields
    if (!name || !email || !phone || !address || !aadharNumber || !password) {
      return res.status(400).json(formatErrorResponse('All fields are required'));
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json(formatErrorResponse('Invalid email format'));
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json(formatErrorResponse('Password must be at least 6 characters long'));
    }

    // Validate phone number
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json(formatErrorResponse('Invalid phone number format'));
    }

    // Validate Aadhar number
    if (!/^\d{12}$/.test(aadharNumber)) {
      return res.status(400).json(formatErrorResponse('Aadhar number must be 12 digits'));
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      $or: [{ email }, { aadharNumber }]
    });

    if (existingAdmin) {
      return res.status(400).json(formatErrorResponse(
        existingAdmin.email === email ? 
        'Admin with this email already exists' : 
        'Admin with this Aadhar number already exists'
      ));
    }

    // Validate Aadhar image
    if (!aadharImage) {
      return res.status(400).json(formatErrorResponse('Aadhar card image is required'));
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new admin
    const newAdmin = new Admin({
      name,
      email,
      phone,
      address,
      aadharNumber,
      aadharImage: aadharImage.filename,
      password: hashedPassword,
      isApproved: false,
      registrationDate: new Date()
    });

    await newAdmin.save();

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please wait for admin approval.',
      admin: {
        name: newAdmin.name,
        email: newAdmin.email,
        phone: newAdmin.phone,
        address: newAdmin.address,
        aadharNumber: newAdmin.aadharNumber,
        registrationDate: newAdmin.registrationDate,
        isApproved: newAdmin.isApproved
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json(formatErrorResponse('Server error', 500));
  }
};

// Login admin
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json(formatErrorResponse('All fields are required'));
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json(formatErrorResponse('Invalid credentials', 401));
    }

    if (!admin.isApproved) {
      return res.status(403).json(formatErrorResponse('Your account is pending approval', 403));
    }

    const isMatch = await comparePassword(password, admin.password);
    if (!isMatch) {
      return res.status(401).json(formatErrorResponse('Invalid credentials', 401));
    }

    // Determine role based on isDefaultAdmin field
    const role = admin.isDefaultAdmin ? 'super_admin' : 'user_admin';

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(admin._id, role, admin.tokenVersion);

    // Set refresh token cookie
    setCookies(res, refreshToken);

    // Send response
    res.status(200).json(formatAuthResponse(admin, accessToken, role));
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json(formatErrorResponse('Server error', 500));
  }
};

// Refresh token
const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json(formatErrorResponse('Refresh token required', 401));
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const admin = await Admin.findById(decoded.id);

    if (!admin || admin.tokenVersion !== decoded.tokenVersion) {
      return res.status(401).json(formatErrorResponse('Invalid refresh token', 401));
    }

    // Determine role based on isDefaultAdmin field
    const role = admin.isDefaultAdmin ? 'super_admin' : 'user_admin';

    const tokens = generateTokens(admin._id, role, admin.tokenVersion);
    setCookies(res, tokens.refreshToken);

    res.json({
      success: true,
      accessToken: tokens.accessToken
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json(formatErrorResponse('Invalid refresh token', 401));
  }
};

// Logout
const logout = async (req, res) => {
  try {
    res.clearCookie('refreshToken');
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json(formatErrorResponse('Server error', 500));
  }
};

// Check authentication
const checkAuth = async (req, res) => {
  try {
    // For admin routes, user info is in req.admin
    const userId = req.admin?._id || req.user?._id;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    console.log('Checking authentication for user:', userId);
    
    // Check if it's an admin route
    if (req.admin) {
      const admin = await Admin.findById(userId).select('-password');
      if (!admin) {
        console.log('Admin not found during auth check');
        return res.status(404).json({ message: 'Admin not found' });
      }
      res.status(200).json({ 
        success: true,
        message: 'Authenticated', 
        user: admin 
      });
    } else {
      // It's a user route
      const user = await User.findById(userId).select('-password');
      if (!user) {
        console.log('User not found during auth check');
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ 
        success: true,
        message: 'Authenticated', 
        user 
      });
    }
  } catch (error) {
    console.error('Auth check error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login controller with remember me functionality
const loginUser = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    // Find user by email or mobile
    const user = await User.findOne({
      $or: [
        { email: email },
        { mobile: email }
      ]
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: rememberMe ? '30d' : '1d' }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: rememberMe ? '60d' : '7d' }
    );

    // Set cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: rememberMe ? 60 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile
      },
      accessToken
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Forgot password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json(formatErrorResponse('Please provide an email'));
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json(formatErrorResponse('Admin not found'));
    }

    const resetToken = generateResetToken();
    admin.resetPasswordToken = resetToken;
    admin.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await admin.save();

    await sendResetEmail(email, resetToken, 'admin');

    res.status(200).json({
      success: true,
      message: 'Password reset email sent'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json(formatErrorResponse('Server error', 500));
  }
};

// Verify reset token
const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    res.json({ message: 'Valid reset token' });
  } catch (error) {
    console.error('Verify reset token error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json(formatErrorResponse('Please provide a new password'));
    }

    const admin = await Admin.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!admin) {
      return res.status(400).json(formatErrorResponse('Invalid or expired reset token'));
    }

    admin.password = await hashPassword(password);
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpires = undefined;
    admin.tokenVersion = (admin.tokenVersion || 0) + 1;
    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Password has been reset'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json(formatErrorResponse('Server error', 500));
  }
};

// Google OAuth
const googleAuth = (req, res) => {
  // Placeholder for Google OAuth
  res.status(501).json({ message: 'Google OAuth not implemented yet' });
};

const googleCallback = (req, res) => {
  // Placeholder for Google OAuth callback
  res.status(501).json({ message: 'Google OAuth callback not implemented yet' });
};

// GitHub OAuth
const githubAuth = (req, res) => {
  // Placeholder for GitHub OAuth
  res.status(501).json({ message: 'GitHub OAuth not implemented yet' });
};

const githubCallback = (req, res) => {
  // Placeholder for GitHub OAuth callback
  res.status(501).json({ message: 'GitHub OAuth callback not implemented yet' });
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  checkAuth,
  loginUser,
  forgotPassword,
  verifyResetToken,
  resetPassword,
  googleAuth,
  googleCallback,
  githubAuth,
  githubCallback
};