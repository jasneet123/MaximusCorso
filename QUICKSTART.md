# 🚀 Quick Start - Deploy to Vercel in 10 Minutes

Follow these steps to get your Cane Corso Academy live on Vercel!

## ⚡ Step 1: Sign Up for Required Services (5 minutes)

### 1. Vercel Account
- Go to [vercel.com](https://vercel.com)
- Click "Sign Up"
- Choose "Continue with GitHub"
- ✅ Free tier is perfect to start!

### 2. Database (Supabase - Free)
- Go to [supabase.com](https://supabase.com)
- Click "Start your project" → Sign in with GitHub
- Click "New project"
- Choose organization and set:
  - **Name:** cane-corso-academy
  - **Database Password:** (create a strong password - save it!)
  - **Region:** Choose closest to your users
- Click "Create new project"
- ⏱️ Wait 2-3 minutes for database to provision

### 3. Get Your Database URL
- In Supabase: Settings → Database → Connection String
- Copy the **Connection Pooler** URL (looks like):
  ```
  postgresql://postgres.xyz:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
  ```
- Replace `[PASSWORD]` with your actual database password
- 💾 **Save this!** You'll need it in Step 3

---

## 🎯 Step 2: Deploy to Vercel (2 minutes)

### Option A: One-Click Deploy (Easiest)

1. **Click this button** (coming soon after you push to main)

   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jasneet123/MaximusCorso)

### Option B: Manual Deploy

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New..." → "Project"**
3. Click **"Import Git Repository"**
4. Find and select: **`jasneet123/MaximusCorso`**
5. Click **"Import"**
6. Configure:
   - **Framework Preset:** Next.js ✅ (auto-detected)
   - **Root Directory:** `./` (leave as default)
   - **Branch:** Select `claude/cane-corso-academy-launch-011CUMGh29bNzcNGqXfYXfbG`
7. **Don't click Deploy yet!** → Continue to Step 3

---

## 🔐 Step 3: Add Environment Variables (3 minutes)

In Vercel, before deploying, click **"Environment Variables"** and add these:

### Copy-Paste These (Update Values!)

```bash
# 1. DATABASE (from Step 1.3)
DATABASE_URL=postgresql://postgres.xyz:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres

# 2. AUTHENTICATION (Generate a random secret)
NEXTAUTH_URL=https://your-project.vercel.app
NEXTAUTH_SECRET=your-random-secret-min-32-characters-long-abc123xyz

# 3. STRIPE (Get from stripe.com/test/dashboard/apikeys)
STRIPE_SECRET_KEY=sk_test_51xxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_51xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# 4. STRIPE PRICE IDs (Create products first - see note below)
STRIPE_FOUNDATION_PRICE_ID=price_xxxxx
STRIPE_MASTER_PRICE_ID=price_xxxxx
STRIPE_ELITE_PRICE_ID=price_xxxxx

# 5. EMAIL (Sign up at resend.com)
RESEND_API_KEY=re_xxxxx
FROM_EMAIL=onboarding@resend.dev

# 6. APP URL (Will be your Vercel URL)
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
```

### Where to Get These Values:

**DATABASE_URL:** ✅ From Step 1.3

**NEXTAUTH_SECRET:** Run this in your terminal:
```bash
openssl rand -base64 32
```
Or use any random 32+ character string

**Stripe Keys:**
1. Go to [stripe.com](https://stripe.com) → Dashboard
2. Make sure you're in **Test Mode** (toggle top-right)
3. Go to Developers → API Keys
4. Copy "Publishable key" and "Secret key"

**Stripe Price IDs:** (⚠️ Important - Do this first!)
1. In Stripe Dashboard → Products → "Add Product"
2. Create three products:
   - **Foundation:** $19.00/month recurring
   - **Master:** $39.00/month recurring
   - **Elite:** $97.00/month recurring
3. For each, copy the **Price ID** (starts with `price_`)

**Stripe Webhook Secret:**
- For now, use: `whsec_temporary` (we'll update after deployment)

**Resend API Key:**
1. Sign up at [resend.com](https://resend.com)
2. Get API key from dashboard
3. For testing, use `FROM_EMAIL=onboarding@resend.dev`

**App URLs:**
- Leave as placeholder for now: `https://your-project.vercel.app`
- We'll update after deployment

---

## 🎉 Step 4: Deploy! (30 seconds)

1. **Click "Deploy"** in Vercel
2. ⏱️ Wait 2-3 minutes for build to complete
3. 🎊 You'll get a URL like: `https://maximus-corso-xyz.vercel.app`

---

## 🔧 Step 5: Post-Deployment Setup (2 minutes)

### Update Environment Variables with Your Real URL

1. Copy your Vercel URL (e.g., `https://maximus-corso-xyz.vercel.app`)
2. In Vercel → Settings → Environment Variables
3. Update these two:
   - `NEXTAUTH_URL` → Your Vercel URL
   - `NEXT_PUBLIC_APP_URL` → Your Vercel URL
4. Click **Save** for each

### Set Up Stripe Webhook

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click **"Add endpoint"**
3. Endpoint URL: `https://your-vercel-url.vercel.app/api/stripe/webhook`
4. Click **"Select events"** and choose:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
5. Click **"Add endpoint"**
6. Copy the **Signing secret** (starts with `whsec_`)
7. In Vercel → Settings → Environment Variables
8. Update `STRIPE_WEBHOOK_SECRET` with the new secret
9. **Important:** Go to Deployments → Click ⋯ → **Redeploy** (with latest commit)

### Initialize Your Database

1. Open your terminal:
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Login
   vercel login

   # Link to your project
   vercel link

   # Pull environment variables
   vercel env pull

   # Push database schema
   npx prisma db push
   ```

---

## ✅ Step 6: Test Everything! (2 minutes)

### Test 1: Waitlist Signup
1. Visit your Vercel URL
2. Scroll to "Join the Waitlist"
3. Enter your email and submit
4. Check Supabase dashboard to see the entry

### Test 2: User Registration
1. Click "Get Started" or "Register"
2. Fill out the form
3. You should be redirected to Stripe checkout
4. Use test card: `4242 4242 4242 4242`
5. Any future expiry date, any CVC
6. Complete payment

### Test 3: Login
1. Go to /login
2. Enter your credentials
3. You should see your dashboard!

---

## 🎊 You're Live!

Your Cane Corso Academy is now running at: `https://your-project.vercel.app`

### What's Working:
- ✅ Landing page with waitlist
- ✅ User registration & login
- ✅ Stripe subscription payments
- ✅ Member dashboard
- ✅ Automated billing

### Next Steps:
1. **Add Content:** Create your first courses
2. **Custom Domain:** Add `canecorsoacademy.com` in Vercel settings
3. **Go Live:** Switch Stripe from Test to Live mode
4. **Launch:** Start marketing to your audience!

---

## 🆘 Having Issues?

### Build Failed?
- Check the build logs in Vercel
- Most common: Environment variables not set correctly
- See full guide: [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

### Can't Login?
- Clear cookies and try again
- Verify `NEXTAUTH_URL` matches your actual URL
- Check `NEXTAUTH_SECRET` is set

### Stripe Not Working?
- Verify you're in Test Mode
- Check API keys are correct
- Ensure webhook is set up with correct URL

### Database Errors?
- Verify `DATABASE_URL` is correct
- Make sure you ran `npx prisma db push`
- Check Supabase dashboard - is database online?

### Need More Help?
- Read: [SETUP.md](./SETUP.md) - Comprehensive setup guide
- Read: [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) - Detailed Vercel guide
- Check: [README.md](./README.md) - Full documentation

---

## 📊 Monitor Your App

- **Vercel Dashboard:** Analytics, logs, performance
- **Stripe Dashboard:** Customers, subscriptions, revenue
- **Supabase Dashboard:** Database, users, tables

---

## 🚀 Ready to Scale?

Once you're ready for production:
- [ ] Set up custom domain
- [ ] Switch Stripe to Live Mode
- [ ] Verify email domain in Resend
- [ ] Enable Vercel Analytics
- [ ] Set up error monitoring (Sentry)
- [ ] Add Google Analytics
- [ ] Start marketing! 🎯

**You're all set! Welcome to the #MaxEffect movement! 🐕**
