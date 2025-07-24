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
- (For production) VPS/server with Nginx & SSL (Let’s Encrypt recommended)

---

## 📁 Folder Structure
```
RDx/
├── backend/           # Node.js + Express API
│   ├── .env           # Your secrets (never commit!)
│   ├── config.js      # Loads config from .env
│   ├── server.js      # Main server file
│   ├── ecosystem.config.js # PM2 process config
│   ├── ...
├── react-frontend/    # React app
│   ├── src/
│   ├── build/         # Production build output
│   └── ...
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

#### Example `.env` file:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
JWT_SECRET=your_jwt_secret
NODE_ENV=development
DEFAULT_ADMIN_EMAIL=Contact@typinghub.in
DEFAULT_ADMIN_PASSWORD=Simranbatwal@11102001
CORS_ORIGIN=http://localhost:3000
   ```

### 3. Frontend Setup
   ```bash
cd ../react-frontend
   npm install
   ```

---

## 👨‍💻 Running Locally (Development)

### Start Backend (Port 5000)
```bash
cd backend
npm run dev
```

### Start Frontend (Port 3000)
```bash
cd react-frontend
npm start
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

---

## 👨‍💼 Admin Setup

Create a super admin (run once):
   ```bash
   cd backend
npm run create-admin
```
- Email: `Contact@typinghub.in`
- Password: `Simranbatwal@11102001`

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
# Edit .env and set:
#   - NODE_ENV=production
#   - MONGO_URI=your_production_mongodb_url
#   - CORS_ORIGIN=https://typinghub.in,https://www.typinghub.in
#   - All other secrets (tokens, admin email/password, etc.)
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
pm2 start ecosystem.config.js
pm2 save             # Save PM2 process list for restart on reboot
pm2 startup          # Show command to enable PM2 on boot, run the command it outputs
```
- To check logs: `pm2 logs typinghub-backend`
- To restart: `pm2 restart typinghub-backend`

### 5. **Nginx Configuration**
Edit your Nginx config (usually in `/etc/nginx/sites-available/`):
```
# Frontend (typinghub.in)
server {
    listen 80;
    server_name typinghub.in www.typinghub.in;
    root /path/to/RDx/react-frontend/build;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Backend API (api.typinghub.in)
server {
    listen 80;
    server_name api.typinghub.in;
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
- Reload Nginx:
```bash
sudo nginx -t   # Test config
sudo systemctl reload nginx
```

### 6. **Set Up SSL (HTTPS) with Let’s Encrypt**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d typinghub.in -d www.typinghub.in -d api.typinghub.in
```
- Follow prompts to enable HTTPS for all domains.

### 7. **MongoDB Atlas Security**
- Go to MongoDB Atlas dashboard.
- Add your server’s public IP to the IP whitelist.
- Remove `0.0.0.0/0` if present for security.

### 8. **Health Check**
- Test backend: `curl https://api.typinghub.in/api/health` (should return `{ "status": "ok" }`)
- Test frontend: Visit `https://typinghub.in` in your browser.

### 9. **(Optional) Enable Automatic PM2 Restart on Reboot**
   ```bash
pm2 startup   # Follow the command it outputs
pm2 save
```

---

## 🔄 API URL Auto-Detection (No Code Change Needed!)
- Frontend auto-detects backend URL based on domain:
  - On `localhost` → uses `http://localhost:5000`
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
- [x] MongoDB Atlas IP whitelist set to your server’s IP
- [x] SSL/HTTPS enabled in production

---

## 🐛 Troubleshooting
- **CORS Errors:** Check `CORS_ORIGIN` in `.env` and Nginx config
- **DB Connection:** Check `MONGO_URI` and MongoDB Atlas IP whitelist
- **Port Conflicts:** Make sure 3000 (frontend) and 5000 (backend) are free
- **Build Errors:** Try `rm -rf node_modules package-lock.json` then `npm install`
- **Logs:**
  - Backend: Check terminal or `pm2 logs`
  - Frontend: Check browser console

---

## 📞 Support
- Email: Contact@typinghub.in
- Create an issue in the repository

---

## 📄 License
This project is proprietary software. All rights reserved. 