import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
})

export const SUBSCRIPTION_TIERS = {
  FOUNDATION: {
    name: 'Foundation',
    price: 1900, // $19.00 in cents
    priceId: process.env.STRIPE_FOUNDATION_PRICE_ID!,
    description: 'Perfect for new Cane Corso owners and prospective buyers',
    features: [
      'First 365 Days curriculum',
      'Weekly video lessons',
      'Monthly live Q&A sessions',
      'Private community access',
      'Downloadable resource library',
    ],
  },
  MASTER: {
    name: 'Master',
    price: 3900, // $39.00 in cents
    priceId: process.env.STRIPE_MASTER_PRICE_ID!,
    description: 'Advanced training for serious owners',
    features: [
      'Everything in Foundation',
      'Advanced Socialization Mastery',
      'Bi-weekly group coaching calls',
      'Video submission & feedback',
      '48-hour email support',
      'Quarterly virtual workshops',
    ],
  },
  ELITE: {
    name: 'Elite',
    price: 9700, // $97.00 in cents
    priceId: process.env.STRIPE_ELITE_PRICE_ID!,
    description: 'VIP access for the most committed owners',
    features: [
      'Everything in Master',
      'Monthly 1-on-1 consultations (30 min)',
      'Custom training plans',
      'Elite Training Vault access',
      'Same-day support',
      'Exclusive mastermind calls',
      'Annual in-person events',
      'Branded merchandise & certificates',
    ],
  },
}
