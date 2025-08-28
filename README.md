# 🚀 TypingHub - Complete Fullstack Project

A modern React + Node.js typing test platform for government exam practice. This guide covers everything you need for local development and production deployment (e.g., typinghub.in) with minimal hassle.

---

## 📋 Project Description

TypingHub is a comprehensive typing practice platform designed for government exam preparation, featuring live typing tests, product recommendations, and educational content. The platform includes both frontend (React/TypeScript) and backend (Node.js/Express) components with a focus on security and performance.

---

## 🚀 Features
- **Automatic environment detection** (no code change needed for deployment)
- **Dynamic API URLs** (auto-detects localhost vs production)
- **Admin management** (super admin creation and management)
- **User authentication** (JWT-based with refresh tokens)
- **Typing tests** (multiple test types and passages)
- **Responsive design** (works on all devices)
- **Security**: CORS, Helmet, rate limiting, sanitization, XSS protection
- **SEO Optimization**: Meta tags, structured data, sitemap
- **Product Management**: Typing tools and accessories
- **Live Competitions**: Typing competitions with rankings
- **Blog System**: Educational content and tips

---

## 🏗️ Architecture Overview

### Frontend (React + TypeScript)
- **Location**: `react-frontend/`
- **Framework**: React 18 with TypeScript
- **Styling**: CSS with responsive design
- **State Management**: React Context API
- **Routing**: React Router v6
- **SEO**: React Helmet Async for meta tags
- **Build Tool**: Create React App with custom config

### Backend (Node.js + Express)
- **Location**: `backend/`
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with refresh mechanism
- **File Uploads**: Multer with secure handling
- **Process Management**: PM2 ecosystem

---

## 🔐 Security Features

### Authentication & Authorization
- **JWT Tokens**: Access and refresh token system
- **Password Hashing**: bcrypt with salt rounds
- **Role-Based Access**: Super admin and sub-admin roles
- **Token Versioning**: Prevents token reuse after logout

### Data Protection
- **Environment Variables**: All sensitive data stored in `.env`
- **Input Validation**: Comprehensive validation for all user inputs
- **CORS Protection**: Configurable cross-origin resource sharing
- **Secure Headers**: HTTP security headers implementation

### File Upload Security
- **Secure Directory**: Sensitive files stored in `backend/secure-uploads/`
- **File Type Validation**: Restricted to specific formats
- **Size Limits**: Configurable file size restrictions
- **Access Control**: Admin-only access to sensitive files

---

## 🚨 Critical Security Notes

### ⚠️ IMPORTANT: Aadhar Card Images
- **Location**: `backend/secure-uploads/`
- **Access**: Admin only
- **Never commit**: These files are in `.gitignore`
- **Storage**: Consider moving to secure cloud storage (AWS S3) for production

### Environment Variables Required
```bash
# Database
MONGO_URI=mongodb://localhost:27017/typinghub

# JWT Secrets (generate strong random strings)
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
JWT_SECRET=your_jwt_secret

# Admin Defaults
DEFAULT_ADMIN_EMAIL=admin@typinghub.in
DEFAULT_ADMIN_PASSWORD=secure_password_here

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# AI API
OPENROUTER_API_KEY=your_openrouter_api_key

# Payment Gateway (if using)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

---

## 🚦 Prerequisites
- Node.js (v16 or higher recommended)
- MongoDB Atlas account
- Git
- (For production) VPS/server with Nginx & SSL (Let's Encrypt recommended)

---

## 📁 Folder Structure
```
RDx/
├── backend/                 # Node.js + Express API
│   ├── .env                # Your secrets (never commit!)
│   ├── config.js           # Loads config from .env
│   ├── server.js           # Main server file
│   ├── ecosystem.config.js # PM2 process config
│   ├── controllers/        # Route handlers
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API endpoints
│   ├── middleware/        # Custom middleware
│   ├── utils/             # Utility functions
│   ├── secure-uploads/    # Sensitive files (NEVER commit)
│   └── uploads/           # Public uploads
├── react-frontend/         # React app
│   ├── src/
│   ├── build/             # Production build output
│   └── ...
├── docs/                  # Documentation files
└── README.md
```

---

## 🛠️ Local Development Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd RDx
```

### 2. Backend Setup
   ```bash
   cd backend
   npm install
cp .env.example .env   # Fill in your real secrets in .env
```

#### Example `.env` file for development:
```env
PORT=9501
MONGO_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
JWT_SECRET=your_jwt_secret
NODE_ENV=development
DEFAULT_ADMIN_EMAIL=your_admin_email@example.com
DEFAULT_ADMIN_PASSWORD=your_secure_password
CORS_ORIGIN=http://localhost:3000
   ```

### 3. Frontend Setup
   ```bash
cd ../react-frontend
   npm install
   ```

---

## 👨‍💻 Running Locally (Development)

### Start Backend (Port 9501)
```bash
cd backend
npm run dev
# OR
npm start
```

### Start Frontend (Port 3000)
```bash
cd react-frontend
npm start
```

- Frontend: http://localhost:3000
- Backend: http://localhost:9501

---

## 👨‍💼 Admin Setup

Create a super admin (run once):
   ```bash
   cd backend
npm run create-admin
```
- Email: Set in your `.env` file
- Password: Set in your `.env` file

---

## 🔧 Key Features

### Admin Panel
- **Product Management**: CRUD operations for typing tools
- **Admin Requests**: Approve/reject new admin registrations
- **Content Management**: Blog and competition management
- **User Management**: View and manage user accounts

### User Features
- **Live Typing Tests**: Real-time typing practice
- **Product Recommendations**: Curated typing tools
- **Competitions**: Typing competitions with rankings
- **Blog System**: Educational content and tips

### SEO & Performance
- **Meta Tags**: Comprehensive SEO optimization
- **Structured Data**: JSON-LD for search engines
- **Lazy Loading**: Component-level code splitting
- **Image Optimization**: Responsive images with lazy loading

---

## 🚀 Production Deployment (typinghub.in)

### 1. **Clone the Repository on Your Server**
   ```bash
git clone <repository-url>
cd RDx
```

### 2. **Backend Setup**
   ```bash
cd backend
npm install
cp .env.example .env   # Create .env and fill with production secrets
```

#### Production `.env` file:
```env
PORT=9501
MONGO_URI=your_production_mongodb_url
ACCESS_TOKEN_SECRET=your_production_access_token_secret
REFRESH_TOKEN_SECRET=your_production_refresh_token_secret
JWT_SECRET=your_production_jwt_secret
NODE_ENV=production
DEFAULT_ADMIN_EMAIL=your_admin_email@example.com
DEFAULT_ADMIN_PASSWORD=your_secure_password
CORS_ORIGIN=https://typinghub.in,https://www.typinghub.in
   ```

### 3. **Frontend Setup & Build**
   ```bash
cd ../react-frontend
npm install
   npm run build:prod
   ```
- This creates the `build/` folder for static hosting.

### 4. **Start Backend with PM2**
```bash
cd ../backend
npm install -g pm2   # Only if PM2 is not installed
npm run pm2:start
pm2 save             # Save PM2 process list for restart on reboot
pm2 startup          # Show command to enable PM2 on boot, run the command it outputs
```

#### PM2 Commands:
```bash
npm run pm2:start    # Start the application
npm run pm2:stop     # Stop the application
npm run pm2:restart  # Restart the application
npm run pm2:logs     # View logs
npm run pm2:delete   # Delete the PM2 process
```

### 5. **Nginx Configuration**

Create Nginx config file: `/etc/nginx/sites-available/typinghub`

#### Frontend (typinghub.in):
```nginx
server {
    listen 80;
    server_name typinghub.in www.typinghub.in;
    
    root /path/to/RDx/react-frontend/build;
    index index.html;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    location / {
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
    }
}

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
```

#### Backend API (api.typinghub.in):
```nginx
server {
    listen 80;
    server_name api.typinghub.in;
    
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req zone=api burst=20 nodelay;
    
    location / {
        proxy_pass http://localhost:9501;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
}
```

#### Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/typinghub /etc/nginx/sites-enabled/
sudo nginx -t   # Test config
sudo systemctl reload nginx
```

### 6. **Set Up SSL (HTTPS) with Let's Encrypt**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d typinghub.in -d www.typinghub.in -d api.typinghub.in
```
- Follow prompts to enable HTTPS for all domains.
- Certbot will automatically update your Nginx config.

### 7. **MongoDB Atlas Security**
- Go to MongoDB Atlas dashboard.
- Add your server's public IP to the IP whitelist.
- Remove `0.0.0.0/0` if present for security.

### 8. **Health Check**
- Test backend: `curl https://api.typinghub.in/api/health` (should return `{ "status": "ok" }`)
- Test frontend: Visit `https://typinghub.in` in your browser.

### 9. **Enable Automatic PM2 Restart on Reboot**
   ```bash
pm2 startup   # Follow the command it outputs
pm2 save
```

---

## 🔄 API URL Auto-Detection (No Code Change Needed!)
- Frontend auto-detects backend URL based on domain:
  - On `localhost` → uses `http://localhost:9501`
  - On `typinghub.in` → uses `https://api.typinghub.in`
- No need to change API URLs in code for deployment!

---

## 🩺 Health Check Endpoint
- Check backend status: `GET /api/health` (returns `{ "status": "ok" }`)

---

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Admin registration
- `POST /api/auth/login` - Admin login
- `POST /api/auth/refresh` - Token refresh
- `POST /api/auth/logout` - Logout

### Product Endpoints
- `GET /api/products` - List products
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### User Endpoints
- `GET /api/users/profile` - User profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/register` - User registration

---

## 🔒 Security Best Practices

### Code Security
- ✅ Input validation and sanitization
- ✅ SQL injection prevention (MongoDB)
- ✅ XSS protection
- ✅ CSRF protection
- ✅ Rate limiting (implement if needed)

### Infrastructure Security
- ✅ Environment variable usage
- ✅ Secure file uploads
- ✅ JWT token security
- ✅ CORS configuration
- ✅ HTTPS enforcement (production)

### Monitoring & Logging
- ✅ Error logging (production)
- ✅ Authentication attempts
- ✅ File access logs
- ✅ Performance monitoring

---

## 📈 Performance Optimization

### Frontend
- **Code Splitting**: Lazy loading of components
- **Image Optimization**: WebP format with fallbacks
- **Bundle Analysis**: Webpack bundle analyzer
- **Caching**: Service worker implementation

### Backend
- **Database Indexing**: Optimized MongoDB queries
- **Caching**: Redis implementation (if needed)
- **Compression**: Gzip compression
- **Connection Pooling**: MongoDB connection optimization

---

## 🧪 Testing

### Test Coverage
- **Unit Tests**: Component and function testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: User workflow testing
- **Security Tests**: Vulnerability scanning

### Testing Commands
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd react-frontend
npm test

# E2E tests
npm run test:e2e
```

---

## 📊 Analytics & Monitoring

### Google Analytics
- **User Behavior**: Page views and user flow
- **Performance**: Core Web Vitals
- **Conversion**: Goal tracking and funnels

### Application Monitoring
- **Error Tracking**: Sentry or similar
- **Performance**: Response time monitoring
- **Uptime**: Health check endpoints

---

## 🔄 Maintenance

### Regular Tasks
- [ ] Update dependencies monthly
- [ ] Review security logs weekly
- [ ] Backup database daily
- [ ] Monitor error rates
- [ ] Update SSL certificates

### Backup Strategy
- **Database**: MongoDB Atlas backups
- **Files**: Cloud storage replication
- **Code**: Git repository with tags
- **Configuration**: Environment variable backups

---

## 🐛 Troubleshooting

### Common Issues:

#### **CORS Errors:**
- Check `CORS_ORIGIN` in `.env` and Nginx config
- Ensure frontend domain is in the allowed origins list

#### **DB Connection:**
- Check `MONGO_URI` and MongoDB Atlas IP whitelist
- Verify network connectivity to MongoDB Atlas

#### **Port Conflicts:**
- Make sure 3000 (frontend) and 9501 (backend) are free
- Check if other services are using these ports

#### **Build Errors:**
```bash
cd react-frontend
rm -rf node_modules package-lock.json
npm install
npm run build:prod
```

#### **PM2 Issues:**
```bash
# Check PM2 status
pm2 status

# View logs
npm run pm2:logs

# Restart if needed
npm run pm2:restart

# Delete and restart
npm run pm2:delete
npm run pm2:start
```

#### **Nginx Issues:**
```bash
# Test Nginx config
sudo nginx -t

# Check Nginx status
sudo systemctl status nginx

# Reload Nginx
sudo systemctl reload nginx
```

#### **SSL Issues:**
```bash
# Check SSL certificate
sudo certbot certificates

# Renew SSL certificate
sudo certbot renew --dry-run
```

### **Logs Location:**
- Backend logs: `pm2 logs typinghub-backend`
- Nginx logs: `/var/log/nginx/error.log` and `/var/log/nginx/access.log`
- PM2 logs: `~/.pm2/logs/`

---

## 📞 Support & Contact
- Email: Contact@typinghub.in
- Create an issue in the repository

---

## 🔒 Security Checklist
- [x] All secrets in `.env` (never in code)
- [x] `.env` in `.gitignore`
- [x] CORS only allows your frontend domain in production
- [x] Helmet, rate limiting, and sanitization middleware enabled
- [x] MongoDB Atlas IP whitelist set to your server's IP
- [x] SSL/HTTPS enabled in production
- [x] Nginx security headers configured
- [x] Rate limiting enabled on API
- [x] PM2 process management with auto-restart
- [x] Sensitive files in secure-uploads directory
- [x] Input validation middleware implemented

---

## ⚠️ Security Reminder

**NEVER commit sensitive files or environment variables to version control!**

- Sensitive files are in `backend/secure-uploads/`
- Environment variables are in `.env` files
- All sensitive data is properly excluded via `.gitignore`

---

## 📄 License
This project is proprietary software. All rights reserved. 

---

*Last Updated: December 2024*
*Version: 1.0.0* 