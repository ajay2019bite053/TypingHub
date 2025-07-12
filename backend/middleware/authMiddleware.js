const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const config = require('../config');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, config.ACCESS_TOKEN_SECRET);
    console.log('Decoded token:', decoded);
    
    const admin = await Admin.findById(decoded.id); // Fix: use 'id' instead of 'userId'
    if (!admin) {
      return res.status(401).json({ message: 'Invalid token.' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports = authMiddleware; 