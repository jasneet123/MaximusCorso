# Vercel Deployment Guide - Cane Corso Academy

This guide will walk you through deploying your Cane Corso Academy to Vercel.

## Prerequisites

- GitHub repository with your code (✅ Already done!)
- Vercel account (free tier works great)
- Stripe account with products created
- Database (Supabase recommended for free tier)
- Resend account for emails

---

## Step 1: Set Up Your Database (If Not Already Done)

### Option A: Supabase (Recommended - Free)

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new project
4. Wait for database to provision (2-3 minutes)
5. Go to **Settings** → **Database**
6. Copy the **Connection String** (Transaction mode)
7. It looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT].supabase.co:5432/postgres`
8. Save this for Step 3!

### Option B: Vercel Postgres (Paid but integrated)

1. During Vercel deployment, you can add Vercel Postgres
2. Click "Add Storage" → "Postgres"
3. Connection string will be automatically added to environment

---

## Step 2: Deploy to Vercel

### Via Vercel Dashboard (Easiest)

1. **Go to [vercel.com](https://vercel.com)**

2. **Sign up or log in** with GitHub

3. **Click "Add New..." → "Project"**

4. **Import your repository:**
   - Select `jasneet123/MaximusCorso`
   - Click "Import"

5. **Configure Project:**
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./` (leave as is)
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `.next` (auto-detected)

6. **Select branch:**
   - Choose: `claude/cane-corso-academy-launch-011CUMGh29bNzcNGqXfYXfbG`

7. **Add Environment Variables** (see Step 3 below)

8. **Click "Deploy"**

---

## Step 3: Configure Environment Variables

In the Vercel project settings, add these environment variables:

### Required Variables

```bash
# Database
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres

# Authentication (IMPORTANT: Generate new secret!)
NEXTAUTH_URL=https://your-project.vercel.app
NEXTAUTH_SECRET=<run this: openssl rand -base64 32>

# Stripe
STRIPE_SECRET_KEY=sk_test_... (or sk_live_... for production)
STRIPE_PUBLISHABLE_KEY=pk_test_... (or pk_live_... for production)
STRIPE_WEBHOOK_SECRET=whsec_... (see Step 4)

# Stripe Price IDs (from your Stripe Dashboard)
STRIPE_FOUNDATION_PRICE_ID=price_...
STRIPE_MASTER_PRICE_ID=price_...
STRIPE_ELITE_PRICE_ID=price_...

# Email
RESEND_API_KEY=re_...
FROM_EMAIL=academy@yourdomain.com

# App URL
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
```

### How to Add Variables in Vercel:

1. In your Vercel project → **Settings** → **Environment Variables**
2. For each variable:
   - Enter **Name** (e.g., `DATABASE_URL`)
   - Enter **Value** (e.g., your database URL)
   - Select **Production**, **Preview**, and **Development**
   - Click **Save**

---

## Step 4: Set Up Stripe Webhook (Production)

After your first deployment:

1. **Get your Vercel URL** (e.g., `https://cane-corso-academy.vercel.app`)

2. **Go to Stripe Dashboard** → **Developers** → **Webhooks**

3. **Click "Add endpoint"**
   - Endpoint URL: `https://your-vercel-url.vercel.app/api/stripe/webhook`
   - Description: "Vercel Production Webhook"

4. **Select events to listen to:**
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

5. **Click "Add endpoint"**

6. **Copy the Signing Secret** (starts with `whsec_...`)

7. **Update Vercel Environment Variable:**
   - Go to Vercel → Settings → Environment Variables
   - Update `STRIPE_WEBHOOK_SECRET` with the new value
   - Click **Save**

8. **Redeploy** (Vercel → Deployments → ⋯ → Redeploy)

---

## Step 5: Initialize Database

After deployment, initialize your database:

### Option A: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link to your project
vercel link

# Pull environment variables
vercel env pull

# Run Prisma migration
npx prisma db push
```

### Option B: Using your local environment

```bash
# Set DATABASE_URL in your local .env to your production database
DATABASE_URL="postgresql://postgres:..."

# Push schema
npx prisma db push
```

---

## Step 6: Test Your Deployment

1. **Visit your Vercel URL**

2. **Test the waitlist signup:**
   - Fill out the form on the homepage
   - Check if data appears in your database (use Prisma Studio or Supabase dashboard)

3. **Test authentication:**
   - Try registering a new account
   - Try logging in

4. **Test Stripe (Use test mode):**
   - Click "Get Started" on a tier
   - Complete checkout with test card: `4242 4242 4242 4242`
   - Verify subscription in Stripe Dashboard
   - Check if subscription appears in your database

---

## Step 7: Set Up Custom Domain (Optional)

1. **In Vercel:** Go to Settings → Domains

2. **Add your domain** (e.g., `canecorsoacademy.com`)

3. **Configure DNS** as instructed by Vercel

4. **Update environment variables:**
   - `NEXTAUTH_URL=https://canecorsoacademy.com`
   - `NEXT_PUBLIC_APP_URL=https://canecorsoacademy.com`

5. **Update Stripe webhook URL** to use your custom domain

6. **Redeploy**

---

## Troubleshooting

### Build fails with "Cannot find module @prisma/client"

**Solution:** The `postinstall` script should handle this, but if it fails:
- Go to Vercel → Settings → General
- Scroll to "Build & Development Settings"
- Override Install Command: `npm install && npx prisma generate`
- Redeploy

### Database connection errors

**Solution:**
- Verify `DATABASE_URL` is correct
- Check if database allows connections from Vercel IPs
- For Supabase: Ensure "Connection Pooling" is enabled
- Try using the "Connection Pooling" URL instead of direct connection

### Stripe webhook not working

**Solution:**
- Verify webhook URL matches your Vercel URL exactly
- Check `STRIPE_WEBHOOK_SECRET` matches the webhook in dashboard
- Look at Stripe webhook logs for error details
- Ensure you're using the right secret (test vs live mode)

### Authentication errors

**Solution:**
- Verify `NEXTAUTH_URL` matches your actual URL (with https://)
- Ensure `NEXTAUTH_SECRET` is set and random
- Clear cookies and try again

### Environment variables not updating

**Solution:**
- After changing variables, you MUST redeploy
- Go to Deployments → ⋯ (three dots) → Redeploy

---

## Vercel CLI Commands (Quick Reference)

```bash
# Install CLI
npm i -g vercel

# Login
vercel login

# Deploy from command line
vercel --prod

# View logs
vercel logs

# Pull environment variables
vercel env pull

# List deployments
vercel ls

# Alias a deployment
vercel alias set <deployment-url> <custom-domain>
```

---

## Going to Production Checklist

Before accepting real payments:

- [ ] Switch Stripe from Test to Live Mode
- [ ] Update Stripe API keys to live keys (`sk_live_...`, `pk_live_...`)
- [ ] Create new products/prices in Stripe Live Mode
- [ ] Update price IDs in environment variables
- [ ] Set up production webhook in Stripe (live mode)
- [ ] Verify domain ownership in Resend
- [ ] Update `FROM_EMAIL` to verified domain
- [ ] Test full signup → payment → dashboard flow
- [ ] Set up error monitoring (Sentry recommended)
- [ ] Enable Vercel Analytics
- [ ] Review Vercel usage limits

---

## Monitoring Your App

### Vercel Dashboard

- **Analytics:** See traffic and performance
- **Logs:** View server logs and errors
- **Deployments:** See all deployments and preview URLs

### Stripe Dashboard

- **Customers:** See all subscribers
- **Subscriptions:** Track active subscriptions
- **Webhooks:** Monitor webhook delivery

### Database

- **Supabase:** Use Table Editor to view data
- **Prisma Studio:** Run `npx prisma studio` locally to view production data

---

## Need Help?

Common resources:
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Prisma with Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)

---

## Quick Deploy Summary

**TL;DR - Fastest Path to Deploy:**

1. Sign up at vercel.com
2. Import GitHub repo: `jasneet123/MaximusCorso`
3. Select branch: `claude/cane-corso-academy-launch-011CUMGh29bNzcNGqXfYXfbG`
4. Add all environment variables from `.env.example`
5. Deploy
6. Run `npx prisma db push` (after setting DATABASE_URL locally)
7. Set up Stripe webhook with your Vercel URL
8. Test and launch! 🚀

Your app will be live at: `https://your-project-name.vercel.app`
