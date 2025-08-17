### Backend Overview

- **Stack**: Node.js, Express, MongoDB (Mongoose)
- **Entry**: `backend/server.js`
- **Config**: `backend/config.js` (reads `.env`)
- **Security**: helmet, cors, rate-limit, express-mongo-sanitize, xss-clean, hpp, compression
- **Uploads**: multer storing files in `backend/uploads`

### Boot sequence
1. Load env config
2. Apply security/basic middleware
3. Serve static `/uploads`
4. Mount routes under `/api/*`
5. Connect to MongoDB (retries)
6. Start server on `PORT`

### Middleware
- Helmet with CSP that allows Razorpay domains
- CORS using `CORS_ORIGIN`
- Global API rate limit; stricter limits applied to auth in code
- Parsers: JSON (10kb), URL-encoded
- Cookie parser
- mongoSanitize, xss, hpp, compression

### Routes mount map (base → router)
- `/api/admin/auth` → `routes/auth.js` (admin auth)
- `/api/auth` → `routes/userAuth.js` (user auth + OTP reset)
- `/api/passages` → `routes/passages.js`
- `/api/admin/requests` → `routes/adminRequests.js`
- `/api/delete-requests` → `routes/deleteRequestRoutes.js`
- `/api/users` → `routes/userRoutes.js`
- `/api/live-exams` → `routes/liveExams.js`
- `/api/cards` → `routes/cardRoutes.js`
- `/api/certificates` → `routes/certificates.js`
- `/api/blogs` → `routes/blogs.js`
- `/api/ai` → `routes/ai.js`
- `/api/competition` → `routes/competition.js`
- `/api/payment` → `routes/payment.js`
- Health: `/api/health`

### Key models
- `User` (`models/User.js`): profile, role, stats, OTP reset, purchasedCourses; password hashing/compare
- `Passage` (`models/Passage.js`): title, content, testTypes
- `LiveExam` (`models/LiveExam.js`): name, date, isLive, joinLink, passage, time window, timeLimit
- `Competition` (`models/Competition.js`): config, fees, slots, prizes, details, status, results and stats

### Auth flows
- Admin (`/api/admin/auth/*` from `controllers/authController.js`)
  - register, login, refresh-token, logout, forgot/reset password, OAuth (google/github)
  - Admin register expects `aadharImage` file field
- User (`/api/auth/*` from `controllers/userAuthController.js`)
  - register, login, refresh-token, logout, check-auth
  - OTP password reset: request-otp, verify-otp, reset-password-otp
- Protected routes use `middleware/authMiddleware.js` (admin) or `middleware/auth.js` (user)

### Feature routes (high level)
- Passages: public list/get-by-test; admin CRUD, assign/unassign, bulk-import
- Live Exams: public list/filter by time; admin CRUD
- Competition: public status/register/join/submit-result/public-results; admin registrations/results/settings/publish/unpublish/download PDF
- Certificates: generate (auth), download, verify, user certificates
- Blogs: CRUD, like, comment, share; image upload under `/api/blogs/uploads`
- Cards: CRUD
- Payments: Razorpay create-order, verify, competition, status

### Run locally
- Prereqs: Node 18+, MongoDB Atlas URI
- Install: `cd backend && npm install`
- Env: see `../docs/ENV.md`
- Start dev: `npm run dev`
- Start prod: `npm run start:prod`




