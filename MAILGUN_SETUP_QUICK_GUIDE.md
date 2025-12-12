# Mailgun Setup - Quick Guide

## ✅ What's Already Done
- Mailgun package installed (`mailgun.js` and `form-data`)
- Email utility created at `/utils/sendEmail.ts`
- Forgot password API integrated with Mailgun
- Beautiful HTML email template ready

## 🚀 Quick Setup (5 minutes)

### Step 1: Sign Up for Mailgun
1. Go to [https://signup.mailgun.com/new/signup](https://signup.mailgun.com/new/signup)
2. Create a free account (no credit card required for 1,000 emails/month)
3. Verify your email address

### Step 2: Get Your Credentials
After logging in to Mailgun dashboard:

#### Get API Key:
1. Click **Settings** in sidebar
2. Click **API Keys**
3. Copy your **Private API Key** (starts with `key-...`)

#### Get Domain:
1. Click **Sending** in sidebar
2. Click **Domains**
3. You'll see a **sandbox domain** like `sandboxXXXXXXXX.mailgun.org`
4. Copy this domain

### Step 3: Add Authorized Recipients (For Testing)
**Important:** Sandbox domains can only send to authorized recipients!

1. Go to **Sending** → **Domains**
2. Click on your sandbox domain
3. Scroll to **Authorized Recipients**
4. Click **Add Recipient**
5. Enter your email address (the one you'll test with)
6. Check your inbox and click the verification link
7. Repeat for any other email addresses you want to test with

### Step 4: Add to Your `.env` File
```env
# Add these to your .env file
DOMAIN_URL=http://localhost:3000
MAILGUN_API_KEY=key-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
MAILGUN_DOMAIN=sandboxxxxxxxxxxxxxxxxxxxxxxxxx.mailgun.org
```

### Step 5: Test It!
1. Start your dev server: `npm run dev`
2. Go to: `http://localhost:3000/forgot-password`
3. Enter an **authorized email** (from Step 3)
4. Click "Send Reset Link"
5. Check your inbox for the password reset email!

---

## 📧 Email Preview
Your users will receive a beautiful email like this:

**Subject:** Reset Your Password - Zealous Health

**Content:**
- Personalized greeting (Hi [Name])
- Clear reset password button with your brand colors
- Fallback link to copy/paste
- Security message (30 min expiry)
- Professional footer with your brand

---

## 🌐 For Production (Custom Domain)

When you're ready to use your own domain:

### Step 1: Add Your Domain in Mailgun
1. Go to **Sending** → **Domains**
2. Click **Add New Domain**
3. Enter your domain (e.g., `mg.yourdomain.com`)

### Step 2: Add DNS Records
Mailgun will show you DNS records to add. Go to your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.) and add:

**SPF Record (TXT):**
```
Type: TXT
Name: yourdomain.com
Value: v=spf1 include:mailgun.org ~all
```

**DKIM Records (TXT):**
```
Type: TXT
Name: mx._domainkey
Value: [provided by Mailgun]
```

**MX Records:**
```
Type: MX
Name: mg
Priority: 10
Value: mxa.mailgun.org

Type: MX
Name: mg
Priority: 10
Value: mxb.mailgun.org
```

**CNAME Record:**
```
Type: CNAME
Name: email.mg
Value: mailgun.org
```

### Step 3: Wait for Verification
- DNS propagation can take 24-48 hours
- Mailgun will automatically verify your domain
- You'll receive an email when it's ready

### Step 4: Update Your `.env`
```env
DOMAIN_URL=https://yourdomain.com
MAILGUN_API_KEY=key-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
MAILGUN_DOMAIN=mg.yourdomain.com
```

---

## 🔍 Troubleshooting

### Emails not sending
**Problem:** Getting errors when trying to send email

**Solutions:**
1. Verify `MAILGUN_API_KEY` is correct in `.env`
2. Check that `MAILGUN_DOMAIN` matches your Mailgun dashboard
3. Restart your dev server after adding env variables
4. Check server logs for specific error messages

### Email not received (Sandbox)
**Problem:** No email in inbox when using sandbox domain

**Solutions:**
1. ✅ Make sure recipient email is **authorized** in Mailgun dashboard
2. ✅ Check spam/junk folder
3. ✅ Verify email address in Mailgun's authorized recipients list
4. Check Mailgun dashboard → **Sending** → **Logs** for delivery status

### "Forbidden" or 403 errors
**Problem:** Getting 403 Forbidden from Mailgun API

**Solutions:**
1. API key might be wrong - regenerate in Mailgun dashboard
2. Make sure you're using the **Private API Key**, not public
3. Check if your IP is blocked (unlikely for new accounts)

### DNS records not verifying
**Problem:** Domain showing as unverified after 24+ hours

**Solutions:**
1. Use [DNS Checker](https://dnschecker.org/) to verify records are propagated
2. Make sure TXT records don't have quotes around values
3. For Cloudflare users: Disable proxy (orange cloud) for MX/CNAME records
4. Contact your domain registrar support if issues persist

---

## 📊 Mailgun Dashboard Features

### Logs
View all sent emails, delivery status, opens, clicks:
- **Sending** → **Logs**
- Filter by date, recipient, status

### Analytics
Track email performance:
- **Analytics** → **Overview**
- See delivery rates, bounces, spam complaints

### Suppressions
Manage bounced/unsubscribed emails:
- **Sending** → **Suppressions**
- Keep your sender reputation high

---

## 💰 Pricing

### Free Tier (Flex)
- **1,000 emails/month FREE**
- Pay-as-you-go after: $0.80 per 1,000 emails
- Perfect for small projects and testing

### Foundation Plan
- **$35/month**
- 50,000 emails included
- $0.60 per 1,000 additional emails
- Better for growing businesses

---

## 🎯 Quick Tips

1. **Test thoroughly with sandbox** before going to production
2. **Keep API keys secret** - never commit to Git
3. **Monitor your logs** regularly for delivery issues
4. **Set up webhooks** for real-time email event tracking
5. **Use templates** for consistent branding across all emails

---

## 📚 Additional Resources

- [Mailgun Documentation](https://documentation.mailgun.com/)
- [Mailgun API Reference](https://documentation.mailgun.com/en/latest/api_reference.html)
- [Email Best Practices](https://documentation.mailgun.com/en/latest/best_practices.html)

---

**Need Help?** Check the main setup guide at `FORGOT_PASSWORD_SETUP.md`
