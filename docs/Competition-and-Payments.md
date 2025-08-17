### Competition Flow

#### Status
- GET `/api/competition/status` returns current config and status flags
- Publicly fetchable; used by frontend to render state (registration/live/completed)

#### Registration
- POST `/api/competition/register` body: `{ name, mobile, paymentId?, paymentAmount? }`
- For paid competitions, perform payment first (see payments) and pass `paymentId` and `paymentAmount`

#### Join
- POST `/api/competition/join` body: `{ name, secretId }`
- Validates secretId and returns data to start test

#### Submit Result
- POST `/api/competition/submit-result` body includes raw metrics and computed scores
- Example fields: `grossSpeed, netSpeed, accuracy, wordAccuracy, mistakes, backspaces, totalWords, correctWords, incorrectWords, timeTaken`

#### Admin
- GET `/api/competition/admin/registrations`
- GET `/api/competition/admin/results`
- PUT `/api/competition/admin/settings` update config (registration/live flags, fees, slots, prizes, dates, passage)
- DELETE `/api/competition/admin/registrations`
- DELETE `/api/competition/admin/results`
- POST `/api/competition/admin/publish-results`
- POST `/api/competition/admin/unpublish-results`
- GET `/api/competition/admin/download-results` → returns PDF

### Payments (Razorpay)

#### Frontend sequence
1. Create order via backend
   - POST `/api/payment/create-order` body: `{ amount, currency: 'INR', receipt, notes? }`
   - Response: `{ orderId, amount, currency, receipt }`
2. Load Razorpay SDK: `paymentService.loadRazorpaySDK()`
3. Open checkout with `paymentService.initializeRazorpayPayment(orderId, amount, 'INR', name, description, prefill, notes)`
4. On success handler, receive `{ razorpay_order_id, razorpay_payment_id, razorpay_signature }`
5. Verify on backend: POST `/api/payment/verify` with the above
6. For competition, POST `/api/payment/competition` with `{ name, mobile, competitionId, amount, paymentId }` if required by flow

#### Payment status
- GET `/api/payment/status/:paymentId` returns payment status for display/troubleshooting

#### Security notes
- Only the backend holds `RAZORPAY_KEY_SECRET`
- Frontend uses `REACT_APP_RAZORPAY_KEY_ID` when opening checkout




