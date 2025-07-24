const errorHandler = (err, req, res, next) => {
  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', {
      message: err.message,
      stack: err.stack,
      status: err.status || 500,
      path: req.path,
      method: req.method,
      body: req.body,
      query: req.query,
      params: req.params
    });
  }

  // Handle specific types of errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'error',
      message: 'Validation Error',
      errors: Object.values(err.errors).map(error => error.message)
    });
  }

  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid ID format'
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      status: 'error',
      message: 'Duplicate field value entered',
      field: field,
      value: err.keyValue[field]
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token. Please log in again.'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 'error',
      message: 'Your token has expired. Please log in again.'
    });
  }

  if (err.name === 'MongoServerError') {
    if (err.code === 8000) {
      return res.status(503).json({
        status: 'error',
        message: 'Database connection error. Please try again later.'
      });
    }
    return res.status(500).json({
      status: 'error',
      message: 'Database error. Please try again later.'
    });
  }

  if (err.name === 'MongooseServerSelectionError') {
    return res.status(503).json({
      status: 'error',
      message: 'Unable to connect to database. Please try again later.'
    });
  }

  // Default error response
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    status: 'error',
    message: statusCode === 500 ? 'Internal server error' : err.message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      path: req.path,
      method: req.method
    })
  });
};

const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

module.exports = {
  errorHandler,
  notFoundHandler
}; 