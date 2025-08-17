### Frontend Overview

- **Stack**: React 18 (CRA), TypeScript, React Router, Context API
- **Entry**: `react-frontend/src/index.tsx`, `react-frontend/src/App.tsx`
- **API base**: `react-frontend/src/utils/api.js` dynamically derives `API_BASE_URL`
- **Config**: `react-frontend/src/config/api.ts` composes `/api` endpoints

### State/Contexts
- `AuthContext.tsx`: stores `accessToken` and `user` in localStorage; check-auth and refresh-token; role-based admin detection
- `CompetitionContext.tsx`: fetch status, register, join, submit result; admin endpoints for settings/results/registrations and PDF
- `AdminContext.tsx`: passages pagination and editing state
- `TypingContext.tsx`: typing stats and selected passage state
- `DeleteRequestContext.tsx`: create/approve/reject/fetch delete-requests
- `CertificateContext.tsx`: generate, download, verify, list certificates

### Services
- `services/api.ts`: thin wrapper over `utils/api.js`; helpers for passages, admin requests, delete-requests; refresh-token helper
- `services/paymentService.ts`: Razorpay flow (create order, open checkout, verify, status)
 - `services/certificateService.ts`: certificate endpoints (generate, download, verify by verificationCode, user/:userId, all)

### Pages/components
- Admin panels under `src/admin/components`
- User flows under `src/pages` and `src/components`

### Running locally
- Install: `cd react-frontend && npm install`
- Dev: `npm start` (proxy to `http://localhost:9501`)
- Build: `npm run build`

### Environment
- `REACT_APP_API_URL` (optional override of backend URL)
- `REACT_APP_RAZORPAY_KEY_ID` (Razorpay public key)
