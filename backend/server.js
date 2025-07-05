const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');

// Import configuration
const config = require('./config');

// Import routes
const authRoutes = require('./routes/auth');
const userAuthRoutes = require('./routes/userAuth');
const passageRoutes = require('./routes/passages');
const adminRequestsRoutes = require('./routes/adminRequests');
const deleteRequestRoutes = require('./routes/deleteRequestRoutes');
const userRoutes = require('./routes/userRoutes');

// Import middleware and utils
const authMiddleware = require('./middleware/authMiddleware');
const createDefaultAdmin = require('./utils/createDefaultAdmin');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandlers');

// Initialize express app
const app = express();

// Security Configurations
const securityConfig = {
  helmet: {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: { policy: "same-site" },
  dnsPrefetchControl: true,
  frameguard: { action: "deny" },
  hidePoweredBy: true,
  hsts: true,
  ieNoOpen: true,
  noSniff: true,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  xssFilter: true,
  },
  cors: {
    origin: config.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 600
  },
  rateLimits: {
    auth: {
      windowMs: 15 * 60 * 1000,
      max: 5,
      message: 'Too many login attempts, please try again after 15 minutes'
    },
    api: {
      windowMs: 15 * 60 * 1000,
      max: 100
    }
  }
};

// Apply security middleware
app.use(helmet(securityConfig.helmet));
app.use(cors(securityConfig.cors));
// Temporarily disable rate limiting for development
// app.use('/api/auth', rateLimit(securityConfig.rateLimits.auth));
app.use('/api', rateLimit(securityConfig.rateLimits.api));
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(compression());

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9]/g, '-');
    cb(null, `${Date.now()}-${sanitizedFilename}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.match(/^image\/(jpeg|png|gif)$/)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1
  },
  fileFilter
});

// Basic middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Static file serving
app.use('/uploads', express.static('uploads'));
app.use('/api/uploads', express.static('uploads')); // Workaround for frontend adding /api prefix

// API Routes
app.use('/api/admin/auth', authRoutes);
app.use('/api/auth', userAuthRoutes);
app.use('/api/passages', passageRoutes);
app.use('/api/admin', adminRequestsRoutes);
app.use('/api/delete-requests', deleteRequestRoutes);
app.use('/api/users', userRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(config.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB Atlas');
    await createDefaultAdmin();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  try {
    await connectDB();
    const PORT = config.PORT;
app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} in ${config.NODE_ENV} mode`);
      if (config.NODE_ENV === 'development') {
        console.log('Configuration loaded:', {
          PORT: config.PORT,
          DB_URL: config.DB_URL ? 'Set' : 'Not Set',
          ACCESS_TOKEN_SECRET: config.ACCESS_TOKEN_SECRET ? 'Set' : 'Not Set',
          REFRESH_TOKEN_SECRET: config.REFRESH_TOKEN_SECRET ? 'Set' : 'Not Set',
          CORS_ORIGIN: config.CORS_ORIGIN
  });
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();