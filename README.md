# TypingHub - Fullstack Project

A modern React + Node.js typing test platform for government exam practice. This guide covers everything you need for local development and production deployment (e.g., typinghub.in) with minimal hassle.

---

## 🚀 Features
- Automatic environment detection (no code change needed for deployment)
- Dynamic API URLs (auto-detects localhost vs production)
- Admin management (super admin creation and management)
- User authentication (JWT-based with refresh tokens)
- Typing tests (multiple test types and passages)
- Responsive design (works on all devices)
- Security: CORS, Helmet, rate limiting, sanitization, XSS protection

---

## 🚦 Prerequisites
- Node.js (v16 or higher recommended)
- MongoDB Atlas account
- Git
- (For production) VPS/server with Nginx & SSL (Let's Encrypt recommended)

---

## 📁 Folder Structure
```
TypingHub.in/
├── backend/           # Node.js + Express API
│   ├── .env           # Your secrets (never commit!)
│   ├── config.js      # Loads config from .env
│   ├── server.js      # Main server file
│   ├── ecosystem.config.js # PM2 process config
│   ├── .../
├── react-frontend/    # React app
│   ├── src/
│   ├── build/         # Production build output
│   └── .../
└── README.md
```

---

## 🛠️ Local Development Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd TypingHub.in
```

### 2. Backend Setup
   ```bash
   cd backend
   npm install
cp .env.example .env   # Fill in your real secrets in .env
```

#### Example `.env` file for development:
```env
PORT=9500
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

### Start Backend (Port 9500)
```bash
cd backend
npm run dev
# OR
npm run start:dev
```

### Start Frontend (Port 3000)
```bash
cd react-frontend
npm start
```

- Frontend: http://localhost:3000
- Backend: http://localhost:9500

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

## 🚀 Production Deployment (typinghub.in)

### 1. **Clone the Repository on Your Server**
   ```bash
git clone <repository-url>
cd TypingHub.in
```

### 2. **Backend Setup**
   ```bash
cd backend
npm install
cp .env.example .env   # Create .env and fill with production secrets
```

#### Production `.env` file:
```env
PORT=9500
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
    
    root /path/to/TypingHub.in/react-frontend/build;
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
        proxy_pass http://localhost:9500;
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
  - On `localhost` → uses `http://localhost:9500`
  - On `typinghub.in` → uses `https://api.typinghub.in`
- No need to change API URLs in code for deployment!

---

## 🩺 Health Check Endpoint
- Check backend status: `GET /api/health` (returns `{ "status": "ok" }`)

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
- Make sure 3000 (frontend) and 9500 (backend) are free
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

## 📞 Support
- Email: Contact@typinghub.in
- Create an issue in the repository

---

## 📄 License
This project is proprietary software. All rights reserved. 