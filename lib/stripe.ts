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
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '')
  }
  if (process.env.VERCEL_ENV === 'production') {
    return 'https://libertyiq.org'
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`.replace(
      /\/$/,
      '',
    )
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return 'http://localhost:3000'
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

/** True when users can start checkout (Checkout Sessions or Payment Links). */
export function isCheckoutAvailable(): boolean {
  if (isStripeConfigured()) return true
  return Boolean(
    process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_MONTHLY ||
      process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_YEARLY,
  )
}
