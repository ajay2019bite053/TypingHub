### Environment Variables

Backend reads from `backend/.env` via `backend/config.js`.

#### Required (backend)
- `NODE_ENV` = development | production
- `PORT` = e.g. 9501 (dev default)
- `MONGO_URI` = your MongoDB connection string
- `ACCESS_TOKEN_SECRET` = JWT secret for access tokens
- `REFRESH_TOKEN_SECRET` = JWT secret for refresh tokens
- `JWT_SECRET` = general JWT secret
- `DEFAULT_ADMIN_EMAIL` = bootstrap admin email
- `DEFAULT_ADMIN_PASSWORD` = bootstrap admin password
- `FRONTEND_URL` = allowed frontend origin (comma-separated supported via `CORS_ORIGIN`)
- `CORS_ORIGIN` = comma-separated origins, e.g. `http://localhost:3000,https://typinghub.in`
- `OPENROUTER_API_KEY` = if AI features used
- `RAZORPAY_KEY_ID` = Razorpay server key id
- `RAZORPAY_KEY_SECRET` = Razorpay server key secret
- `EMAIL_USER` = SMTP username/email (for password reset/OTP emails)
- `EMAIL_PASS` = SMTP app password

#### Optional (frontend `react-frontend/.env`)
- `REACT_APP_API_URL` = override backend base URL
- `REACT_APP_RAZORPAY_KEY_ID` = Razorpay public key (used by checkout script)

### Example backend `.env`
```
NODE_ENV=development
PORT=9501
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/rdx
ACCESS_TOKEN_SECRET=change-me-access
REFRESH_TOKEN_SECRET=change-me-refresh
JWT_SECRET=change-me-jwt
DEFAULT_ADMIN_EMAIL=admin@example.com
DEFAULT_ADMIN_PASSWORD=StrongPass!234
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
OPENROUTER_API_KEY=
RAZORPAY_KEY_ID=rzp_test_123
RAZORPAY_KEY_SECRET=secret_123
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=app-password
```

### CORS
- Backend builds the `cors` origins array from `CORS_ORIGIN` (comma-separated). In production defaults include `https://typinghub.in` and `https://www.typinghub.in` if not set.
