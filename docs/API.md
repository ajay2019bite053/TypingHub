### API Reference (consolidated)

Base URL: `{API_BASE_URL}/api`

#### Auth (Admin) `/admin/auth`
- POST `/register` (multer `aadharImage`)
- POST `/login`
- POST `/refresh-token`
- POST `/logout` (auth)
- GET `/check-auth` (auth)
- POST `/forgot-password`
- POST `/reset-password/:token`
- POST `/verify-reset-token/:token`
- GET `/google`, `/google/callback`, `/github`, `/github/callback`

#### Auth (User) `/auth`
- POST `/register`
- POST `/login`
- POST `/refresh-token`
- POST `/request-otp`
- POST `/verify-otp`
- POST `/reset-password-otp`
- POST `/logout` (auth)
- GET `/check-auth` (auth)

#### Users `/users`
- POST `/register` (legacy)
- POST `/login` (legacy)
- GET `/dashboard` (auth)
- PUT `/profile` (auth)
- PUT `/stats` (auth)
- POST `/:userId/purchase`
- GET `/:userId/purchased-courses`

#### Passages `/passages`
- GET `/` (public)
- GET `/test/:testType` (public)
- POST `/assign` (admin)
- POST `/unassign` (admin)
- POST `/bulk-import` (admin)
- POST `/` (admin)
- GET `/:id` (admin)
- PUT `/:id` (admin)
- DELETE `/:id` (admin)

#### Admin Requests `/admin/requests`
- GET `/` (admin)
- PUT `/approve/:id` (admin)
- PUT `/reject/:id` (admin)
- DELETE `/remove/:id` (admin)

#### Delete Requests `/delete-requests`
- POST `/` (admin)
- GET `/` (admin)
- PUT `/:requestId/approve` (admin)
- PUT `/:requestId/reject` (admin)

#### Live Exams `/live-exams`
- GET `/` (public, only time-window valid exams)
- GET `/admin` (admin)
- GET `/:id` (public)
- POST `/` (admin)
- PUT `/:id` (admin)
- DELETE `/:id` (admin)

#### Cards `/cards`
- GET `/`
- POST `/`
- PUT `/:id`
- DELETE `/:id`

#### Certificates `/certificates`
- POST `/generate` (auth)
- GET `/download/:certificateId`
- GET `/verify/:verificationCode`
- GET `/user/:userId`

#### Blogs `/blogs`
- GET `/`
- GET `/:id`
- POST `/`
- PUT `/:id`
- DELETE `/:id`
- POST `/:id/like`
- POST `/:id/comment`
- POST `/:id/share`
- POST `/uploads` (image upload → returns `{ url }`)

#### AI `/ai`
- POST `/generate-text`

#### Competition `/competition`
- GET `/status`
- GET `/public-results`
- POST `/register`
- POST `/join`
- POST `/submit-result`
- GET `/admin/registrations` (admin)
- GET `/admin/results` (admin)
- PUT `/admin/settings` (admin)
- DELETE `/admin/registrations` (admin)
- DELETE `/admin/results` (admin)
- POST `/admin/publish-results` (admin)
- POST `/admin/unpublish-results` (admin)
- GET `/admin/download-results` (admin)

#### Payment `/payment`
- POST `/create-order`
- POST `/verify`
- POST `/competition`
- GET `/status/:paymentId`
