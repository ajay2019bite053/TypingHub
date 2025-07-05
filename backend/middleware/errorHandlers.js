const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Don't expose stack trace in production
  const stack = process.env.NODE_ENV === 'production' ? '🥞' : err.stack;
  
  // Handle specific types of errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation Error',
      errors: Object.values(err.errors).map(error => error.message)
    });
  }
  
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({
      message: 'Invalid ID format'
    });
  }
  
  if (err.code === 11000) {
    return res.status(400).json({
      message: 'Duplicate field value entered',
      field: Object.keys(err.keyPattern)[0]
    });
  }
  
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Invalid token'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      message: 'Token expired'
    });
  }

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', {
      message: err.message,
      stack: err.stack,
      status: statusCode
    });
  }

  // Send error response
  res.status(statusCode).json({
    message: err.message,
    stack: stack,
    ...(process.env.NODE_ENV === 'development' && { 
      path: req.path,
      method: req.method 
    })
  });
};

module.exports = {
  notFoundHandler,
  errorHandler
}; 