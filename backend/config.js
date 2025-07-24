// Backend Configuration
// Loads configuration from environment variables
require('dotenv').config();

const config = {
    PORT: process.env.PORT || 9500,
  DB_URL: process.env.MONGO_URI,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DEFAULT_ADMIN_EMAIL: process.env.DEFAULT_ADMIN_EMAIL,
  DEFAULT_ADMIN_PASSWORD: process.env.DEFAULT_ADMIN_PASSWORD,
  CORS_ORIGIN: (process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:3000'])
};

// Validate required fields
const requiredFields = ['PORT', 'DB_URL', 'ACCESS_TOKEN_SECRET', 'REFRESH_TOKEN_SECRET', 'JWT_SECRET', 'DEFAULT_ADMIN_EMAIL', 'DEFAULT_ADMIN_PASSWORD'];
requiredFields.forEach(field => {
  if (!config[field]) {
    throw new Error(`Missing required configuration field: ${field}`);
  }
});

module.exports = config; 