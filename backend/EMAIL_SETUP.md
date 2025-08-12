# Email Setup Guide for TypingHub Contact Form

## Overview
The contact form now sends actual emails to `Contact@typinghub.in` when users submit the form. This setup uses Gmail SMTP for sending emails.

## Setup Instructions

### 1. Gmail Account Setup
You need a Gmail account to send emails. Follow these steps:

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Navigate to Security
   - Under "2-Step Verification", click on "App passwords"
   - Generate a new app password for "Mail"
   - Copy the 16-character password

### 2. Environment Variables
Add these variables to your `.env` file in the backend directory:

```env
# Email Configuration
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-16-character-app-password
```

### 3. Example .env Configuration
```env
# Other existing variables...
EMAIL_USER=typinghub@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
```

### 4. Testing the Setup
1. Start your backend server: `npm run dev`
2. Go to the Contact Us page on your frontend
3. Fill out and submit the contact form
4. Check your `Contact@typinghub.in` email for the message
5. The user will also receive a confirmation email

## Features

### ✅ **What the Contact Form Does:**
- Sends emails to `Contact@typinghub.in`
- Includes user's name, email, subject, and message
- Supports file attachments (JPG, PNG, PDF, DOC, DOCX)
- Sends confirmation email to the user
- Professional HTML email templates
- File size limit: 5MB

### ✅ **Email Templates:**
- **Admin Email**: Professional formatted email with all contact details
- **User Confirmation**: Thank you email with message details
- **Responsive Design**: Works on all email clients

### ✅ **Security Features:**
- File type validation
- File size limits
- Email validation
- Rate limiting (inherited from server config)
- XSS protection

## Troubleshooting

### Common Issues:

1. **"Authentication failed" error**:
   - Make sure 2FA is enabled on Gmail
   - Use the correct 16-character app password
   - Don't use your regular Gmail password

2. **"Connection timeout" error**:
   - Check your internet connection
   - Verify Gmail SMTP settings
   - Check firewall settings

3. **"File upload failed" error**:
   - Ensure file is under 5MB
   - Check file type is supported
   - Verify uploads directory exists

### Testing Commands:
```bash
# Test backend connection
curl -X POST http://localhost:9501/api/contact/submit \
  -F "name=Test User" \
  -F "email=test@example.com" \
  -F "subject=Test Message" \
  -F "message=This is a test message"
```

## Production Deployment

For production, consider:
1. Using a dedicated email service (SendGrid, Mailgun, etc.)
2. Setting up proper SPF/DKIM records
3. Monitoring email delivery rates
4. Setting up email logs and analytics

## Support

If you encounter issues:
1. Check the server logs for error messages
2. Verify all environment variables are set
3. Test with a simple email first
4. Contact support if problems persist
