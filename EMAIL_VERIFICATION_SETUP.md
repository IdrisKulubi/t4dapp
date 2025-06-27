# Email Verification Setup Guide

This guide explains how to set up the email verification system for user registration.

## Environment Variables Required

Add the following environment variable to your `.env.local` file:

```bash
# Resend API for Email Verification
RESEND_API_KEY="your_resend_api_key_here"
```

## Getting a Resend API Key

1. Go to [Resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your domain or use the default testing domain
4. Go to API Keys section and create a new API key
5. Copy the API key and add it to your environment variables

## Database Migration

Run the following command to generate and apply the database migration for the email verification codes table:

```bash
pnpm db:generate
pnpm db:migrate
```

## Features Implemented

### 1. Email Verification Flow
- Users can sign up with email and password
- Verification code is sent to their email
- 6-digit code verification
- Account creation upon successful verification

### 2. Email Template
- Professional React Email template with GCA branding
- Responsive design
- Clear verification code display

### 3. Security Features
- Password hashing with bcrypt
- Rate limiting for verification codes
- Code expiration (10 minutes)
- Maximum attempts tracking
- Automatic cleanup of expired codes

### 4. User Interface
- Modern signup form with step-by-step flow
- Email verification code input with auto-submit
- Error handling and success messages
- Resend code functionality with cooldown timer

### 5. Authentication Integration
- NextAuth.js Credentials provider
- Seamless integration with existing Google OAuth
- Tabbed login interface (Google vs Email)

## Usage

### For Users
1. Visit `/signup` to create a new account
2. Fill in name, email, and password
3. Click "Send Verification Code"
4. Check email for 6-digit code
5. Enter code to verify and create account
6. Automatically signed in and redirected

### For Existing Users
1. Visit `/login`
2. Choose "Email" tab
3. Enter email and password
4. Sign in normally

## API Endpoints

- `POST /api/auth/send-verification` - Send verification code
- `POST /api/auth/verify-code` - Verify code and create account

## Database Schema

New table: `email_verification_codes`
- `id` - Primary key
- `email` - User email
- `code` - 6-digit verification code
- `expiresAt` - Expiration timestamp
- `isUsed` - Whether code has been used
- `attempts` - Number of verification attempts
- `createdAt` - Creation timestamp

## File Structure

```
src/
├── app/
│   ├── (auth)/
│   │   └── signup/
│   │       └── page.tsx
│   └── api/
│       └── auth/
│           ├── send-verification/
│           │   └── route.ts
│           └── verify-code/
│               └── route.ts
├── components/
│   ├── auth/
│   │   ├── signup-card.tsx
│   │   └── email-login-form.tsx
│   └── emails/
│       └── verification-code-email.tsx
└── lib/
    ├── actions/
    │   └── email-verification.ts
    └── email.ts
```

## Testing

1. Start the development server: `pnpm dev`
2. Visit `http://localhost:3000/signup`
3. Create a test account
4. Check your email for the verification code
5. Complete the verification process

## Production Considerations

1. **Domain Verification**: Verify your domain with Resend for production
2. **Email Deliverability**: Set up proper SPF, DKIM, and DMARC records
3. **Rate Limiting**: Consider implementing additional rate limiting
4. **Monitoring**: Monitor email delivery and verification success rates
5. **Backup**: Consider implementing SMS verification as a backup option

## Troubleshooting

### Email Not Received
- Check spam/junk folder
- Verify Resend API key is correct
- Check domain verification status
- Review Resend dashboard for delivery logs

### Verification Code Invalid
- Check if code has expired (10 minutes)
- Verify code hasn't been used already
- Check for too many failed attempts

### Database Errors
- Ensure database migration has been run
- Check database connection
- Review database logs for errors 