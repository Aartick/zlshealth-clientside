# Mailgun 401 Unauthorized Error - Troubleshooting

## Your Current Setup
Based on the logs:
- ✅ Domain: `sandbox6d6ab75caff1431e804f9ee485fdcd09.mailgun.org`
- ✅ API Key detected: `c24b...ad82`
- ❌ Getting 401 Unauthorized error

## Solution Steps

### Step 1: Verify Your API Key ⚠️ MOST COMMON ISSUE

**The Problem:** You might be using the wrong API key type or it's incorrect.

**Solution:**
1. Go to [Mailgun Dashboard](https://app.mailgun.com/mg/dashboard)
2. Click **Settings** → **API Keys** (or go directly to: https://app.mailgun.com/settings/api_security)
3. Look for **Private API key** (NOT public key!)
4. It should start with `key-` followed by random characters
5. Copy the ENTIRE key including `key-`
6. Update your `.env` file:

```env
MAILGUN_API_KEY=key-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Important:**
- ✅ Use: `key-abc123...` (Private API key)
- ❌ Don't use: `pubkey-...` (Public API key - this won't work!)

### Step 2: Check Your Region

Mailgun has different API endpoints for US and EU regions.

**Find Your Region:**
1. Go to **Sending** → **Domains**
2. Look at your domain
3. If it says "EU" or you signed up with a European account, you're in EU region

**If you're in EU region, add this to `.env`:**
```env
MAILGUN_REGION=eu
```

**If you're in US region (default):**
- No need to add anything, it's the default

### Step 3: Verify Authorized Recipients (For Sandbox Domain)

Since you're using a sandbox domain, you can ONLY send to **authorized recipients**.

**Check if recipient is authorized:**
1. Go to **Sending** → **Domains**
2. Click on your sandbox domain: `sandbox6d6ab75caff1431e804f9ee485fdcd09.mailgun.org`
3. Scroll down to **Authorized Recipients**
4. Make sure `atharv.bhute18@gmail.com` (or whatever email you're testing with) is listed
5. If not, click **Add Recipient** and add it
6. Check your email and click the verification link

### Step 4: Restart Your Dev Server

After updating `.env`, you MUST restart your Next.js dev server:

```bash
# Stop the server (Ctrl+C)
# Then start again:
npm run dev
```

## Complete .env Example

Your `.env` file should look like this:

```env
# Domain
DOMAIN_URL=http://localhost:3000

# Mailgun - US Region (default)
MAILGUN_API_KEY=key-1234567890abcdef1234567890abcdef
MAILGUN_DOMAIN=sandbox6d6ab75caff1431e804f9ee485fdcd09.mailgun.org

# OR if you're in EU region:
# MAILGUN_API_KEY=key-1234567890abcdef1234567890abcdef
# MAILGUN_DOMAIN=sandbox6d6ab75caff1431e804f9ee485fdcd09.mailgun.org
# MAILGUN_REGION=eu
```

## Testing Steps

1. ✅ Update `.env` with correct API key (starts with `key-`)
2. ✅ Add authorized recipient in Mailgun dashboard
3. ✅ Verify the recipient email (check inbox for verification link)
4. ✅ Restart dev server: `npm run dev`
5. ✅ Try sending reset email again
6. ✅ Check server logs for detailed error messages

## Expected Success Output

When it works, you should see:

```
Mailgun Configuration: {
  domain: 'sandbox6d6ab75caff1431e804f9ee485fdcd09.mailgun.org',
  apiKeyPrefix: 'key-',
  apiKeySuffix: '...',
  recipient: 'atharv.bhute18@gmail.com'
}
Using Mailgun API URL: https://api.mailgun.net
Email sent successfully: { id: '<...@sandbox...mailgun.org>', message: 'Queued. Thank you.' }
Password reset email sent to: atharv.bhute18@gmail.com
```

## Still Not Working?

### Check API Key Status
1. Go to https://app.mailgun.com/settings/api_security
2. Make sure your API key is **Active** (not deleted or revoked)

### Try Regenerating API Key
1. In Mailgun dashboard → **Settings** → **API Keys**
2. Click **Create New Key**
3. Copy the new key
4. Update `.env` with new key
5. Restart server

### Verify Domain Status
1. Go to **Sending** → **Domains**
2. Check if your sandbox domain is **Active**
3. If it says "Unverified" or "Disabled", contact Mailgun support

### Check Mailgun Account Status
- Make sure your Mailgun account is active
- Check if there are any billing issues (shouldn't be for free tier)
- Verify your email address is confirmed with Mailgun

## Alternative: Create New Mailgun Account

If all else fails:
1. Create a new Mailgun account with a different email
2. Get new sandbox domain and API key
3. Update `.env` with new credentials
4. Should work fresh!

## Quick Checklist

- [ ] API key starts with `key-` (not `pubkey-`)
- [ ] API key copied completely (no spaces or missing characters)
- [ ] Correct region set (add `MAILGUN_REGION=eu` if needed)
- [ ] Recipient is authorized in sandbox domain
- [ ] Recipient email is verified (clicked link in verification email)
- [ ] `.env` file is in project root directory
- [ ] Dev server restarted after `.env` changes
- [ ] No typos in `MAILGUN_API_KEY` or `MAILGUN_DOMAIN` variable names

## Contact Information

If you're still stuck:
- Mailgun Support: https://help.mailgun.com/
- Mailgun Status: https://status.mailgun.com/
- Check if Mailgun services are down

---

**Most Common Fix:** Double-check you're using the **Private API key** (starts with `key-`) and not the public key!
