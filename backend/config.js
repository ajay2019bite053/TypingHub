// The backend server will listen on port 9501 by default in both development and production.
// To change the port, set the PORT environment variable in your .env file or server environment.
// Backend Configuration
// Loads configuration from environment variables
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';
let port;
let corsOrigin;

// Always check for CORS_ORIGIN environment variable first
if (process.env.CORS_ORIGIN) {
  corsOrigin = process.env.CORS_ORIGIN.split(',').map(origin => origin.trim());
  // Remove duplicates to prevent CORS header issues
  corsOrigin = [...new Set(corsOrigin)];
} else if (isProduction) {
  corsOrigin = [
    'https://typinghub.in',
    'https://www.typinghub.in'
  ];
} else {
  corsOrigin = ['http://localhost:3000'];
}

// Set port based on environment
port = process.env.PORT || (isProduction ? 80 : 9501);

const config = {
  PORT: port,
  DB_URL: process.env.MONGO_URI,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DEFAULT_ADMIN_EMAIL: process.env.DEFAULT_ADMIN_EMAIL,
  DEFAULT_ADMIN_PASSWORD: process.env.DEFAULT_ADMIN_PASSWORD,
  FRONTEND_URL: process.env.FRONTEND_URL,
  CORS_ORIGIN: corsOrigin,
  // OpenRouter API Key - Load from environment variable
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
  // Email Configuration
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS
};

// Validate required fields
const requiredFields = ['PORT', 'DB_URL', 'ACCESS_TOKEN_SECRET', 'REFRESH_TOKEN_SECRET', 'JWT_SECRET', 'DEFAULT_ADMIN_EMAIL', 'DEFAULT_ADMIN_PASSWORD', 'FRONTEND_URL'];
requiredFields.forEach(field => {
  if (!config[field]) {
    throw new Error(`Missing required configuration field: ${field}`);
  }
});

module.exports = config; 