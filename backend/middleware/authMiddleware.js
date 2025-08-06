const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const config = require('../config');

const authMiddleware = async (req, res, next) => {
  try {
    console.log('Auth middleware called for:', req.path);
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Token provided:', !!token);
    
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, config.ACCESS_TOKEN_SECRET);
    console.log('Token decoded successfully');
    const admin = await Admin.findById(decoded.id);
    console.log('Admin found:', !!admin);
    
    if (!admin) {
      console.log('Admin not found for token');
      return res.status(401).json({ message: 'Invalid token.' });
    }

    console.log('Admin authenticated:', admin.email);
    req.admin = admin;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports = authMiddleware; 