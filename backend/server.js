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
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "blob:"],
        connectSrc: ["'self'", "http://localhost:3000", "http://localhost:9500"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
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
    origin: ['http://localhost:3000'],
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
    const PORT = config.PORT;
    const server = app.listen(PORT, () => {
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

    // Handle server errors
    server.on('error', (error) => {
      console.error('Server error:', error);
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
        process.exit(1);
      }
    });

    // Handle process errors
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      // Give the server a chance to finish handling existing connections
      server.close(() => {
        process.exit(1);
      });
    });

    process.on('unhandledRejection', (error) => {
      console.error('Unhandled Rejection:', error);
      // Give the server a chance to finish handling existing connections
      server.close(() => {
        process.exit(1);
      });
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        console.log('Server closed');
        mongoose.connection.close(false, () => {
          console.log('MongoDB connection closed');
          process.exit(0);
        });
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT received. Shutting down gracefully...');
      server.close(() => {
        console.log('Server closed');
        mongoose.connection.close(false, () => {
          console.log('MongoDB connection closed');
          process.exit(0);
        });
      });
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();