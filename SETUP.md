# Cane Corso Academy - Detailed Setup Guide

This guide will walk you through setting up and deploying the Cane Corso Academy platform.

## Table of Contents

1. [Local Development Setup](#local-development-setup)
2. [Stripe Configuration](#stripe-configuration)
3. [Database Setup](#database-setup)
4. [Email Configuration](#email-configuration)
5. [Deployment to Production](#deployment-to-production)
6. [Post-Deployment Tasks](#post-deployment-tasks)

---

## Local Development Setup

### 1. Prerequisites

Make sure you have:
- Node.js 18 or higher installed
- PostgreSQL installed locally OR access to a cloud PostgreSQL database
- A Stripe account (free test mode is fine for development)
- A Resend account (free tier is fine for development)

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Update `.env` with your credentials (details in sections below).

### 4. Start Development Server

```bash
npm run dev
```

The app will be available at http://localhost:3000

---

## Stripe Configuration

### Step 1: Create a Stripe Account

1. Sign up at https://stripe.com
2. Keep it in **Test Mode** for development

### Step 2: Get API Keys

1. Go to Developers → API Keys
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Copy your **Secret key** (starts with `sk_test_`)
4. Add them to `.env`:

```env
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

### Step 3: Create Products and Prices

1. Go to Products in Stripe Dashboard
2. Create three products:

**Foundation Tier:**
- Name: "Cane Corso Academy - Foundation"
- Description: "Perfect for new owners"
- Price: $19.00 USD
- Billing: Recurring monthly
- Copy the Price ID (starts with `price_`)

**Master Tier:**
- Name: "Cane Corso Academy - Master"
- Description: "Advanced training"
- Price: $39.00 USD
- Billing: Recurring monthly
- Copy the Price ID

**Elite Tier:**
- Name: "Cane Corso Academy - Elite"
- Description: "VIP access"
- Price: $97.00 USD
- Billing: Recurring monthly
- Copy the Price ID

Add the Price IDs to `.env`:

```env
STRIPE_FOUNDATION_PRICE_ID="price_..."
STRIPE_MASTER_PRICE_ID="price_..."
STRIPE_ELITE_PRICE_ID="price_..."
```

### Step 4: Set Up Webhook (Local Development)

For local testing, use Stripe CLI:

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login:
   ```bash
   stripe login
   ```
3. Forward webhooks to local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
4. Copy the webhook signing secret (starts with `whsec_`) to `.env`:
   ```env
   STRIPE_WEBHOOK_SECRET="whsec_..."
   ```

Keep this terminal running while developing.

---

## Database Setup

### Option A: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database:
   ```bash
   createdb canecorso_academy
   ```
3. Update `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/canecorso_academy"
   ```

### Option B: Cloud PostgreSQL (Recommended)

**Using Supabase (Free):**

1. Sign up at https://supabase.com
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string (Transaction mode)
5. Add to `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT].supabase.co:5432/postgres"
   ```

**Using Railway (Paid but simple):**

1. Sign up at https://railway.app
2. Create a new PostgreSQL database
3. Copy the connection string
4. Add to `.env`

### Initialize Database

```bash
# Generate Prisma Client
npx prisma generate

# Create tables
npx prisma db push

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

---

## Email Configuration

### Using Resend (Recommended)

1. Sign up at https://resend.com (free tier: 100 emails/day)
2. Verify your domain OR use the provided test domain
3. Go to API Keys → Create API Key
4. Add to `.env`:
   ```env
   RESEND_API_KEY="re_..."
   FROM_EMAIL="academy@yourdomain.com"
   ```

For development, you can use `onboarding@resend.dev` as FROM_EMAIL.

---

## Deployment to Production

### Deploying to Vercel (Recommended)

#### Step 1: Prepare Repository

```bash
git add .
git commit -m "Initial commit"
git push origin claude/cane-corso-academy-launch-011CUMGh29bNzcNGqXfYXfbG
```

#### Step 2: Connect to Vercel

1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repository
4. Select the branch: `claude/cane-corso-academy-launch-011CUMGh29bNzcNGqXfYXfbG`

#### Step 3: Configure Environment Variables

In Vercel project settings, add ALL environment variables from `.env`:

**Required Variables:**
- `DATABASE_URL` - Your production database URL
- `NEXTAUTH_URL` - Your production URL (e.g., https://canecorsoacademy.com)
- `NEXTAUTH_SECRET` - Generate a secure secret: `openssl rand -base64 32`
- `STRIPE_SECRET_KEY` - Your Stripe secret key
- `STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key
- `STRIPE_WEBHOOK_SECRET` - Production webhook secret (see below)
- `STRIPE_FOUNDATION_PRICE_ID` - Foundation tier price ID
- `STRIPE_MASTER_PRICE_ID` - Master tier price ID
- `STRIPE_ELITE_PRICE_ID` - Elite tier price ID
- `RESEND_API_KEY` - Your Resend API key
- `FROM_EMAIL` - Your verified sender email
- `NEXT_PUBLIC_APP_URL` - Your production URL

#### Step 4: Deploy

Click "Deploy" and wait for the build to complete.

#### Step 5: Set Up Production Database

If using a cloud database (Supabase, Railway, etc.):

1. Database is already set up from local development
2. Run migrations in production:
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Login
   vercel login

   # Pull environment
   vercel env pull

   # Push database schema
   npx prisma db push
   ```

#### Step 6: Configure Production Stripe Webhook

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://yourdomain.com/api/stripe/webhook`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the webhook signing secret
6. Update `STRIPE_WEBHOOK_SECRET` in Vercel environment variables
7. Redeploy

---

## Post-Deployment Tasks

### 1. Switch Stripe to Live Mode

When ready to accept real payments:

1. Go to Stripe Dashboard
2. Toggle to "Live Mode" (top right)
3. Get new API keys (starts with `pk_live_` and `sk_live_`)
4. Create new products/prices in live mode
5. Update environment variables in Vercel
6. Create new live webhook

### 2. Verify Your Email Domain

1. Go to Resend Dashboard
2. Add your domain (e.g., canecorsoacademy.com)
3. Add DNS records to verify ownership
4. Update `FROM_EMAIL` to use your verified domain

### 3. Set Up Custom Domain

1. In Vercel, go to Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` with your domain

### 4. Create First Admin User

1. Register a user through the normal flow
2. Connect to your database
3. Update the user's role:
   ```sql
   UPDATE "User" SET role = 'ADMIN' WHERE email = 'your@email.com';
   ```

### 5. Monitor Application

- Set up error tracking (Sentry recommended)
- Monitor Stripe dashboard for payments
- Check Vercel analytics for traffic

---

## Troubleshooting

### Database Connection Issues

**Error: Can't reach database server**
- Check DATABASE_URL is correct
- Verify database is running
- Check firewall/security groups allow connections

### Stripe Webhook Failures

**Error: Webhook signature verification failed**
- Verify STRIPE_WEBHOOK_SECRET matches the webhook in Stripe dashboard
- Ensure using the correct key for test/live mode

### Authentication Issues

**Error: Session cookie not setting**
- Verify NEXTAUTH_URL matches your domain
- Check NEXTAUTH_SECRET is set
- Ensure using HTTPS in production

### Build Failures

**Error: Module not found**
- Run `npm install` to ensure all dependencies are installed
- Check for typos in import paths
- Clear `.next` folder and rebuild

---

## Development Tips

### Testing Payments Locally

Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Requires 3D Secure: `4000 0025 0000 3155`

Any future expiry date, any CVC.

### Database Management

```bash
# View data
npx prisma studio

# Reset database (WARNING: Deletes all data)
npx prisma db push --force-reset

# Generate types after schema changes
npx prisma generate
```

### Viewing Logs

```bash
# Vercel logs
vercel logs

# Local development
# Logs appear in terminal where you ran npm run dev
```

---

## Next Steps

After deployment:

1. **Add Content**: Create courses, modules, and lessons
2. **Build Admin Panel**: Implement admin interface for content management
3. **Launch Marketing**: Start driving traffic to waitlist
4. **Collect Feedback**: Get early users and iterate
5. **Scale Features**: Add community forum, video submissions, etc.

---

## Support

For issues or questions:
- Check GitHub Issues
- Review Stripe/Vercel documentation
- Contact development team

Good luck with your launch! 🚀
