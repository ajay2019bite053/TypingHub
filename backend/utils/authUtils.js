const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const config = require('../config');

// Token management
const generateTokens = (id, role, tokenVersion = 0) => {
  const accessToken = jwt.sign(
    { id, role, tokenVersion },
    config.ACCESS_TOKEN_SECRET,
    { expiresIn: '7d' } // Increased from '1h' to '7d' for dev convenience
  );

  const refreshToken = jwt.sign(
    { id, role, tokenVersion },
    config.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

// Password management
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password.toString(), salt);
};

const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

// Email management
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.EMAIL_USER || 'your-email@gmail.com',
    pass: config.EMAIL_PASS || 'your-app-password'
  }
});

const sendResetEmail = async (email, resetToken, role) => {
  const resetUrl = `${config.FRONTEND_URL || 'http://localhost:3000'}/${role}/reset-password/${resetToken}`;
  
  const mailOptions = {
    from: config.EMAIL_USER || 'your-email@gmail.com',
    to: email,
    subject: 'Password Reset Request',
    html: `
      <h1>Password Reset Request</h1>
      <p>You requested to reset your password. Click the link below to reset it:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

// Token management
const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Cookie management
const setCookies = (res, refreshToken) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// Response formatters
const formatAuthResponse = (user, accessToken, role) => {
  return {
    success: true,
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role
    }
  };
};

const formatErrorResponse = (message, statusCode = 400) => {
  return {
    success: false,
    message,
    statusCode
  };
};

module.exports = {
  generateTokens,
  hashPassword,
  comparePassword,
  sendResetEmail,
  generateResetToken,
  setCookies,
  formatAuthResponse,
  formatErrorResponse
}; 