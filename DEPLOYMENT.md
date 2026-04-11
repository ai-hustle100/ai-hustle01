# AI Hustle — Production Deployment Guide

## Step 1: Railway Deployment

1. Install Railway CLI: `npm install -g @railway/cli`
2. Login: `railway login`
3. Initialize project: `railway init` → name it "ai-hustle"
4. Set environment variables:
   ```
   railway variables set NODE_ENV=production
   railway variables set PORT=5000
   railway variables set MONGODB_URI="your-mongodb-atlas-uri"
   railway variables set JWT_SECRET="your-secret"
   railway variables set JWT_EXPIRE=7d
   railway variables set OTP_EXPIRY_MINUTES=10
   railway variables set CLIENT_URL="https://ai-hustle.ai"
   railway variables set SESSION_SECRET="random-string"
   railway variables set GOOGLE_CLIENT_ID="your-google-id"
   railway variables set GOOGLE_CLIENT_SECRET="your-google-secret"
   railway variables set EMAIL_HOST=smtp.gmail.com
   railway variables set EMAIL_PORT=587
   railway variables set EMAIL_USER="your-email@gmail.com"
   railway variables set EMAIL_PASS="your-gmail-app-password"
   ```
5. Deploy: `railway up`
6. Get Railway domain: `railway domain` → note the `.up.railway.app` URL
7. Test: visit the Railway URL → should see your landing page
8. Seed database (one time): `railway run npm run seed`

## Step 2: Cloudflare Setup

1. Go to cloudflare.com → Add site → Enter "ai-hustle.ai"
2. Select FREE plan
3. Cloudflare gives 2 nameservers → Go to your domain registrar → replace nameservers
4. Wait 10-30 minutes for propagation
5. In Cloudflare DNS:
   - Add CNAME record: Name = `@`, Target = `your-app.up.railway.app`, Proxy = ON (orange cloud)
   - Add CNAME record: Name = `www`, Target = `your-app.up.railway.app`, Proxy = ON
6. SSL/TLS → Set to "Full (Strict)"
7. Caching:
   - Browser Cache TTL: 4 hours
   - Cache Level: Standard
8. Page Rules (FREE plan allows 3):
   - Rule 1: `ai-hustle.ai/api/*` → Cache Level: Bypass
   - Rule 2: `ai-hustle.ai/assets/*` → Cache Level: Cache Everything, Edge TTL: 1 month
   - Rule 3: `ai-hustle.ai/health` → Cache Level: Bypass

## Step 3: Google OAuth Setup

1. Go to console.cloud.google.com
2. Create project "AI Hustle"
3. APIs & Services → OAuth consent screen → External
4. Fill in required fields (app name, support email, developer email)
5. Add scopes: `email`, `profile`, `openid`
6. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Name: "AI Hustle Web"
   - Authorized JavaScript origins: `https://ai-hustle.ai`
   - Authorized redirect URI: `https://ai-hustle.ai/api/auth/google/callback`
7. Copy Client ID and Client Secret → add to Railway env vars
8. **For local testing**, add to your `server/.env`:
   ```
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   CLIENT_URL=http://localhost:5173
   ```
   And add redirect URI: `http://localhost:5000/api/auth/google/callback`

## Step 4: Gmail App Password Setup

1. Go to myaccount.google.com
2. Security → 2-Step Verification (must be enabled)
3. App passwords → Generate new app password
4. Select: Mail, Windows
5. Copy the 16-character password → use as `EMAIL_PASS`

## Step 5: MongoDB Atlas Production Config

1. Go to MongoDB Atlas dashboard
2. Network Access → Add Railway server IP (or allow `0.0.0.0/0` for now)
3. Database Access → Verify your user has readWrite permissions
4. Upgrade to M2 cluster ($9/month) if traffic exceeds 500 connections
5. Enable Monitoring: Database → Metrics

## Pre-Launch Checklist

- [ ] Railway deployment successful (no build errors)
- [ ] Health check returns 200 OK at `/health`
- [ ] Landing page loads on ai-hustle.ai
- [ ] Google OAuth login works
- [ ] Email + Password registration works
- [ ] OTP email is received and verification works
- [ ] Dashboard loads with all 20 platforms
- [ ] Search and filter working
- [ ] Platform detail page loads correctly
- [ ] Email capture form on hero works
- [ ] Dark/Light mode toggle works
- [ ] Mobile responsive (test on phone)
- [ ] Bookmark works for logged-in users
- [ ] Bookmark shows "sign up" prompt for non-logged-in users
- [ ] Profile completion page accessible after login
- [ ] SSL certificate active (HTTPS)
- [ ] Cloudflare DNS propagated
