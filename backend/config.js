// The backend server will listen on port 9501 by default in both development and production.
// To change the port, set the PORT environment variable in your .env file or server environment.
// Backend Configuration
// Loads configuration from environment variables
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';
let port;
let corsOrigin;
if (isProduction) {
  port = process.env.PORT || 80;
  corsOrigin = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : [
    'https://typinghub.in',
    'https://www.typinghub.in'
  ];
} else {
  port = process.env.PORT || 9501;
  corsOrigin = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:3000'];
}

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
  // OpenRouter API Key - Replace with your actual key
  OPENROUTER_API_KEY: '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'
};

// Validate required fields
const requiredFields = ['PORT', 'DB_URL', 'ACCESS_TOKEN_SECRET', 'REFRESH_TOKEN_SECRET', 'JWT_SECRET', 'DEFAULT_ADMIN_EMAIL', 'DEFAULT_ADMIN_PASSWORD', 'FRONTEND_URL'];
requiredFields.forEach(field => {
  if (!config[field]) {
    throw new Error(`Missing required configuration field: ${field}`);
  }
});

module.exports = config; 