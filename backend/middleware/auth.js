const jwt = require('jsonwebtoken');
const User = require('../models/User');

const userAuthMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    // Verify token using ACCESS_TOKEN_SECRET
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Support tokens signed with either { id } or { userId }
    const decodedUserId = decoded.id || decoded.userId;
    if (!decodedUserId) {
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    // Check if user exists
    const user = await User.findById(decodedUserId).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = userAuthMiddleware;