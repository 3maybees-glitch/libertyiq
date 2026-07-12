import Stripe from 'stripe'

let stripeClient: Stripe | null = null

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }
  if (!stripeClient) {
    stripeClient = new Stripe(key, {
      apiVersion: '2026-06-24.dahlia',
      typescript: true,
    })
  }
  return stripeClient
}

export function getAppUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.replace(/\/$/, '') ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
  )
}

export function getPriceId(plan: 'monthly' | 'yearly'): string {
  const priceId =
    plan === 'yearly'
      ? process.env.STRIPE_PRICE_ID_YEARLY
      : process.env.STRIPE_PRICE_ID_MONTHLY

  if (!priceId) {
    throw new Error(
      plan === 'yearly'
        ? 'STRIPE_PRICE_ID_YEARLY is not configured'
        : 'STRIPE_PRICE_ID_MONTHLY is not configured',
    )
  }
  return priceId
}

export function isStripeConfigured(): boolean {
  return Boolean(
    process.env.STRIPE_SECRET_KEY &&
      process.env.STRIPE_PRICE_ID_MONTHLY &&
      process.env.STRIPE_PRICE_ID_YEARLY,
  )
}
