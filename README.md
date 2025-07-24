# TypingHub - Government Exam Typing Practice Platform

A comprehensive typing test platform built with React and Node.js, specifically designed for government exam preparation. Features include SSC, RRB, and other exam-specific typing tests with real-time analysis.

[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB.svg)](https://reactjs.org/)
[![Node.js Version](https://img.shields.io/badge/Node.js-16%2B-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

---

## ✨ Features

### 🎯 For Users
- **Exam-Specific Tests**: SSC-CGL, SSC-CHSL, RRB-NTPC, and more
- **Dual Language Support**: Hindi & English typing practice
- **Real-time Analysis**: Instant speed and accuracy feedback
- **Progress Tracking**: Detailed performance analytics
- **Free Certification**: Completion certificates available
- **Mobile Responsive**: Practice on any device

### 💻 Technical Features
- Modern React with TypeScript
- Node.js & Express backend
- MongoDB database
- JWT authentication
- Real-time typing analysis
- Responsive design
- SEO optimized
- Security best practices

---

## 🛠️ Tech Stack

### Frontend
- React 18
- TypeScript
- React Router v6
- Context API for state management
- CSS Modules & Modern CSS

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Express Rate Limit
- Helmet Security

---

## 📁 Project Structure
```
RDx/
├── backend/           # Node.js + Express API
│   ├── config/       # Configuration files
│   ├── controllers/  # Route controllers
│   ├── middleware/   # Custom middleware
│   ├── models/       # Mongoose models
│   ├── routes/       # API routes
│   └── utils/        # Utility functions
├── react-frontend/   # React application
│   ├── public/      # Static files
│   └── src/
│       ├── admin/   # Admin components
│       ├── components/
│       ├── contexts/
│       ├── hooks/
│       ├── pages/
│       ├── services/
│       ├── types/
│       └── utils/
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Git

### Local Development Setup

1. **Clone the Repository**
```bash
git clone <repository-url>
cd RDx
```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env   # Create and configure your .env file
   ```

3. **Frontend Setup**
   ```bash
cd ../react-frontend
   npm install
   ```

4. **Environment Configuration**
   Create `.env` files in both backend and frontend directories. See `.env.example` for required variables.

5. **Start Development Servers**
```bash
   # Terminal 1 - Backend
cd backend
npm run dev

   # Terminal 2 - Frontend
cd react-frontend
npm start
```

---

## 🔒 Security Features

- CORS protection
- Rate limiting
- XSS prevention
- SQL injection protection
- CSRF protection
- Security headers (Helmet)
- Input sanitization
- JWT with refresh tokens
- Password hashing
- Request validation

---

## 📱 Responsive Design

- Mobile-first approach
- Tablet & desktop optimized
- Touch-friendly interface
- Flexible layouts
- Optimized images
- Responsive typography

---

## 🌐 SEO Optimization

- Server-side rendering ready
- Meta tags optimization
- Structured data
- Sitemap generation
- robots.txt configuration
- Semantic HTML
- Performance optimization

---

## 🚀 Deployment

### Production Requirements
- VPS/Cloud server
- Nginx
- PM2
- SSL certificate
- MongoDB Atlas (recommended)

### Basic Deployment Steps
1. Set up server with Node.js, Nginx
2. Configure SSL with Let's Encrypt
3. Set up PM2 for process management
4. Configure Nginx as reverse proxy
5. Set up MongoDB Atlas
6. Deploy using provided scripts

Detailed deployment guide available in `DEPLOYMENT.md`

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

## 📝 License

This project is proprietary software. All rights reserved.

---

## 🌟 Support

For support, email us or create an issue in the repository. 