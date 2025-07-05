# TypingHub - Fullstack Project

A React + Node.js typing test application with automatic environment detection.

## 🚀 Features

- **Automatic Environment Detection**: No .env files needed!
- **Dynamic API URLs**: Automatically detects localhost vs production
- **Environment-based Configuration**: Uses NODE_ENV for different settings
- **Admin Management**: Super admin creation and management
- **User Authentication**: JWT-based auth with refresh tokens
- **Typing Tests**: Multiple test types and passages
- **Responsive Design**: Works on all devices

## 📁 Project Structure

```
RDx/
├── backend/                 # Node.js + Express API
│   ├── config.js           # Environment-based configuration
│   ├── server.js           # Main server file
│   ├── scripts/            # Database scripts
│   ├── controllers/        # API controllers
│   ├── middleware/         # Express middleware
│   ├── models/             # MongoDB models
│   └── routes/             # API routes
├── react-frontend/         # React TypeScript app
│   ├── src/
│   │   ├── utils/api.js    # Dynamic API utility
│   │   ├── config/api.ts   # API configuration
│   │   ├── services/       # API services
│   │   └── components/     # React components
│   └── package.json
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd RDx
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Frontend Setup
```bash
cd react-frontend
npm install
```

## 🚀 Running the Application

### Development Mode

#### Backend (Port 5000)
```bash
cd backend
npm run dev          # Development with nodemon
# OR
npm run start:dev    # Development without nodemon
```

#### Frontend (Port 3000)
```bash
cd react-frontend
npm start            # Development server
```

### Production Mode

#### Backend
```bash
cd backend
npm run start        # Production mode
# OR
npm run start:prod   # Explicit production
```

#### Frontend
```bash
cd react-frontend
npm run build        # Build for production
npm run build:prod   # Build without source maps
```

## 🔧 Configuration

### Automatic Environment Detection

The application automatically detects the environment:

- **Localhost**: Uses `http://localhost:5000` for API
- **Production**: Uses `https://api.typinghub.in` for API
- **Other domains**: Uses `https://api.{hostname}` pattern

### Backend Configuration

The `backend/config.js` file contains all environment-specific settings:

```javascript
// Development
{
  PORT: 5000,
  DB_URL: 'mongodb://...',
  CORS_ORIGIN: ['http://localhost:3000']
}

// Production  
{
  PORT: process.env.PORT || 5000,
  DB_URL: 'mongodb://...',
  CORS_ORIGIN: ['https://typinghub.in']
}
```

### Frontend Configuration

The `react-frontend/src/utils/api.js` automatically detects the backend URL:

```javascript
const getBackendUrl = () => {
  const hostname = window.location.hostname;
  
  if (hostname === 'localhost') {
    return 'http://localhost:5000';
  }
  
  if (hostname === 'typinghub.in') {
    return 'https://api.typinghub.in';
  }
  
  return `https://api.${hostname}`;
};
```

## 👨‍💼 Admin Setup

### Create Super Admin
```bash
cd backend
npm run create-admin
```

This creates a super admin with:
- Email: `Contact@typinghub.in`
- Password: `Simranbatwal@11102001`
- Role: `super_admin`

## 🌐 Deployment

### VPS Deployment

1. **Clone and setup**:
```bash
git clone <repository-url>
cd RDx
```

2. **Install dependencies**:
```bash
cd backend && npm install
cd ../react-frontend && npm install
```

3. **Build frontend**:
```bash
cd react-frontend
npm run build:prod
```

4. **Start backend**:
```bash
cd backend
NODE_ENV=production npm start
```

5. **Setup reverse proxy** (nginx):
```nginx
# Frontend
server {
    listen 80;
    server_name typinghub.in www.typinghub.in;
    root /path/to/react-frontend/build;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Backend API
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

### Environment Variables (Optional)

If you need to override default settings, you can still use environment variables:

```bash
# Backend
NODE_ENV=production
PORT=5000

# Frontend (if needed)
REACT_APP_API_URL=https://api.typinghub.in
```

## 🔒 Security Features

- JWT-based authentication
- Refresh token rotation
- CORS protection
- Rate limiting
- Input sanitization
- XSS protection
- Helmet security headers

## 📱 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/admin/auth/login` - Admin login

### Passages
- `GET /api/passages` - Get all passages
- `GET /api/passages/test/:type` - Get passages by test type

### Admin
- `GET /api/admin/requests` - Get admin requests
- `PUT /api/admin/approve/:id` - Approve admin request

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Check if CORS_ORIGIN in config.js includes your frontend URL
2. **Database Connection**: Verify MongoDB connection string in config.js
3. **Port Conflicts**: Ensure ports 3000 and 5000 are available
4. **Build Errors**: Clear node_modules and reinstall dependencies

### Logs

- **Backend**: Check console output for server logs
- **Frontend**: Check browser console for client-side errors
- **Database**: Check MongoDB Atlas logs

## 📞 Support

For issues or questions:
- Email: Contact@typinghub.in
- Create an issue in the repository

## 📄 License

This project is proprietary software. All rights reserved. 