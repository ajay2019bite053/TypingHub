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
const liveExamsRoutes = require('./routes/liveExams');
const cardRoutes = require('./routes/cardRoutes');
const certificateRoutes = require('./routes/certificates');
const blogRoutes = require('./routes/blogs');
const aiRoutes = require('./routes/ai');
const competitionRoutes = require('./routes/competition');
const paymentRoutes = require('./routes/payment');

// Import middleware and utils
const authMiddleware = require('./middleware/authMiddleware');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandlers');

// Initialize express app
const app = express();

// Security Configurations
const securityConfig = {
  helmet: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          'https://checkout.razorpay.com'
        ],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: [
          "'self'",
          'data:',
          'blob:',
          'https://*.razorpay.com'
        ],
        connectSrc: [
          "'self'",
          ...config.CORS_ORIGIN,
          'https://api.razorpay.com',
          'https://checkout.razorpay.com'
        ],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: [
          "'self'",
          'https://*.razorpay.com',
          'https://checkout.razorpay.com'
        ],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
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
    origin: config.CORS_ORIGIN || ['http://localhost:3000', 'https://typinghub.in'],
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
app.use('/api', rateLimit(securityConfig.rateLimits.api));

// Basic middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
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

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/admin/auth', authRoutes);
app.use('/api/auth', userAuthRoutes);
app.use('/api/passages', passageRoutes);
app.use('/api/admin/requests', adminRequestsRoutes);
app.use('/api/delete-requests', deleteRequestRoutes);
app.use('/api/users', userRoutes);
app.use('/api/live-exams', liveExamsRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/competition', competitionRoutes);
app.use('/api/payment', paymentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Database connection with retry mechanism
const connectDB = async (retries = 5, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(config.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Connected to MongoDB Atlas');
      return;
    } catch (error) {
      console.error(`MongoDB connection attempt ${i + 1} failed:`, error.message);
      if (i < retries - 1) {
        console.log(`Retrying in ${delay / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  throw new Error('Failed to connect to MongoDB after multiple attempts');
};

// Start server with error handling
const startServer = async () => {
  try {
    await connectDB();
    
    const PORT = config.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${config.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Start the server
startServer();