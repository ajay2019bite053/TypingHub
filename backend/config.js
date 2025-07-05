// Backend Configuration
// Automatically sets configuration based on NODE_ENV

const config = {
  development: {
    PORT: 5000,
    DB_URL: 'mongodb+srv://ajay2019bite052:M4kpyBYvd9VD867D@cluster0.t4rkhdc.mongodb.net/TypingRDx?retryWrites=true&w=majority&appName=Cluster0',
    ACCESS_TOKEN_SECRET: 'c1831e0d1a86fe5a26dd2c0a3fded9461e0c4a7db16b6d095f6d6d7c9cf359f7',
    REFRESH_TOKEN_SECRET: '9af4021b5d650842f0e108a2d4048f4fbd5ff6f3885a5a90cbda97b1abf5aab0',
    JWT_SECRET: '74c0b7d43f3c6bde85a0dc1f6f8e219c4e5b1d19cfa23a714c2e8b997a6c087f',
    NODE_ENV: 'development',
    DEFAULT_ADMIN_EMAIL: 'Contact@typinghub.in',
    DEFAULT_ADMIN_PASSWORD: 'Simranbatwal@11102001',
    CORS_ORIGIN: ['http://localhost:3000', 'http://127.0.0.1:3000']
  },
  production: {
    PORT: process.env.PORT || 5000,
    DB_URL: 'mongodb+srv://ajay2019bite052:M4kpyBYvd9VD867D@cluster0.t4rkhdc.mongodb.net/TypingRDx?retryWrites=true&w=majority&appName=Cluster0',
    ACCESS_TOKEN_SECRET: 'c1831e0d1a86fe5a26dd2c0a3fded9461e0c4a7db16b6d095f6d6d7c9cf359f7',
    REFRESH_TOKEN_SECRET: '9af4021b5d650842f0e108a2d4048f4fbd5ff6f3885a5a90cbda97b1abf5aab0',
    JWT_SECRET: '74c0b7d43f3c6bde85a0dc1f6f8e219c4e5b1d19cfa23a714c2e8b997a6c087f',
    NODE_ENV: 'production',
    DEFAULT_ADMIN_EMAIL: 'Contact@typinghub.in',
    DEFAULT_ADMIN_PASSWORD: 'Simranbatwal@11102001',
    CORS_ORIGIN: ['https://typinghub.in', 'https://www.typinghub.in']
  }
};

// Get current environment
const env = process.env.NODE_ENV || 'development';

// Export configuration for current environment
const currentConfig = config[env];

// Validate required fields
const requiredFields = ['PORT', 'DB_URL', 'ACCESS_TOKEN_SECRET', 'REFRESH_TOKEN_SECRET', 'JWT_SECRET'];
requiredFields.forEach(field => {
  if (!currentConfig[field]) {
    throw new Error(`Missing required configuration field: ${field}`);
  }
});

module.exports = currentConfig; 