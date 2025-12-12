# Forgot Password Setup Guide

## Overview
The forgot password functionality has been implemented using a link-based approach. Users receive an email with a reset link containing their user ID.

## What's Implemented

### Frontend Pages
1. **Forgot Password Page** - `/forgot-password`
   - Users enter their email
   - Validates email format
   - Shows success confirmation

2. **Reset Password Page** - `/reset-password?param=USER_ID`
   - Validates user ID on page load
   - Password input with strength requirements
   - Confirms password match
   - Redirects to login after success

3. **Login Page Update** - `/login`
   - Added clickable "Forgot password?" link

### Backend API Routes
1. **POST `/api/forgetpassword`**
   - Accepts: `{ email: string }`
   - Validates email exists in database
   - Creates reset link: `DOMAIN_URL/reset-password?param=USER_ID`
   - Returns success message

2. **GET `/api/resetpassword?param=USER_ID`**
   - Validates if user ID is valid
   - Used to verify reset link before showing form

3. **POST `/api/resetpassword`**
   - Accepts: `{ param: string, password: string }`
   - Validates password strength
   - Updates user password with bcrypt hash
   - Returns success message

## Setup Instructions

### 1. Add Environment Variable
Add to your `.env` file:
```env
DOMAIN_URL=http://localhost:3000
```

In production:
```env
DOMAIN_URL=https://yourdomain.com
```

### 2. Install Email Service ✅ COMPLETED
Mailgun has been installed and configured!

```bash
npm install mailgun.js form-data  # Already installed
```

### 3. Create Email Utility ✅ COMPLETED
Email utility created at `/utils/sendEmail.ts` using Mailgun!

### 4. Get Mailgun Credentials

#### Sign up for Mailgun:
1. Go to [https://www.mailgun.com/](https://www.mailgun.com/)
2. Sign up for a free account (1,000 emails/month free)
3. Verify your email address

#### Get your API credentials:
1. After login, go to **Settings** → **API Keys**
2. Copy your **Private API Key**
3. Go to **Sending** → **Domains**
4. Copy your domain (sandbox domain for testing, or add your own domain)

#### Add to your `.env` file:
```env
MAILGUN_API_KEY=your-private-api-key-here
MAILGUN_DOMAIN=sandboxXXXXXXXX.mailgun.org
```

**For Testing (Sandbox Domain):**
- You can only send to **authorized recipients**
- Go to **Sending** → **Authorized Recipients** → Add your email
- Verify the email you receive

**For Production (Custom Domain):**
- Add your domain in Mailgun dashboard
- Add DNS records (MX, TXT, CNAME) to your domain provider
- Wait for verification (can take a few hours)
- Example: `MAILGUN_DOMAIN=mg.yourdomain.com`

## Security Considerations

### Current Implementation
- User ID is passed in URL parameter
- No expiration on reset links
- Links remain valid until password is changed

### Recommended Improvements (Optional)
1. **Add Token Expiration**: Store reset token with timestamp in database
2. **Use Secure Tokens**: Use crypto to generate random tokens instead of user ID
3. **One-Time Use**: Invalidate token after password reset
4. **Rate Limiting**: Limit reset requests per email

### Example Enhanced Implementation:
```typescript
// Add to User model:
resetPasswordToken: String,
resetPasswordExpires: Date,

// In forgetpassword route:
const crypto = require('crypto');
const token = crypto.randomBytes(32).toString('hex');
user.resetPasswordToken = token;
user.resetPasswordExpires = Date.now() + 1800000; // 30 minutes
await user.save();

const resetLink = `${domainUrl}/reset-password?token=${token}`;
```

## Testing

### Local Testing
1. Start dev server: `npm run dev`
2. Go to: `http://localhost:3000/login`
3. Click "Forgot password?"
4. Enter a registered email
5. Check console for reset link (until email is configured)
6. Copy link and paste in browser
7. Enter new password and submit

### Production Testing
1. Ensure `DOMAIN_URL` is set to production domain
2. Ensure email service is configured
3. Test forgot password flow
4. Verify email delivery
5. Test password reset

## Troubleshooting

### Email not sending
- Check email service credentials
- Verify environment variables are set
- Check spam folder
- Look at server logs for errors

### Reset link not working
- Verify `DOMAIN_URL` is correct
- Check if user ID exists in database
- Ensure API routes are accessible

### Password not updating
- Verify password meets requirements (8+ chars, uppercase, lowercase, number, special char)
- Check database connection
- Look at API response in browser console

## Files Modified/Created
- ✅ `/app/(pages)/forgot-password/page.tsx` - Email input page
- ✅ `/app/(pages)/reset-password/page.tsx` - Password reset page
- ✅ `/app/(pages)/login/page.tsx` - Added forgot password link
- ✅ `/app/api/forgetpassword/route.ts` - Sends reset email with Mailgun
- ✅ `/app/api/resetpassword/route.ts` - Handles password reset
- ✅ `.env.example` - Added DOMAIN_URL and Mailgun config
- ✅ `/utils/sendEmail.ts` - Mailgun email utility

## Next Steps
1. ✅ Frontend and API routes completed
2. ✅ Install Mailgun package
3. ✅ Create email utility function
4. ✅ Update forgetpassword API to send real emails
5. ⏳ Get Mailgun credentials and add to `.env`
6. ⏳ Test complete flow
