import Stripe from 'stripe'
import { PAID_PLANS, type PaidPlan } from '@/lib/pricing'

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

/** Stripe test Payment Links are https://buy.stripe.com/test_… — never send a visitor there. */
export function isTestModePaymentLink(url: string): boolean {
  return /buy\.stripe\.com\/test_/i.test(url)
}

/** Checkout Session URLs from test mode include cs_test_. */
export function isTestModeCheckoutUrl(url: string): boolean {
  return isTestModePaymentLink(url) || /(?:^|[/._-])cs_test_/i.test(url)
}

export function isTestModeStripeKey(
  key: string | undefined = process.env.STRIPE_SECRET_KEY,
): boolean {
  return Boolean(key && /^(?:sk|rk)_test_/.test(key))
}

export function isProductionDeployment(): boolean {
  return process.env.VERCEL_ENV === 'production'
}

export function hasStripeSecret(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY)
}

export function getPriceId(plan: PaidPlan): string {
  const priceId = process.env[PAID_PLANS[plan].priceEnv]?.trim()
  if (!priceId) {
    throw new Error(`Stripe price for plan "${plan}" is not configured`)
  }
  return priceId
}

/** Secret key is enough to revalidate older subscriptions and lifetime purchases. */
export function isStripeConfigured(): boolean {
  return hasStripeSecret()
}

/**
 * New passes check out only when the secret and all four price IDs are set,
 * and production is not pointed at a test-mode secret key.
 */
export function isCheckoutSessionAllowed(): boolean {
  if (!hasStripeSecret()) return false
  const pricesReady = (Object.keys(PAID_PLANS) as PaidPlan[]).every((plan) =>
    Boolean(process.env[PAID_PLANS[plan].priceEnv]?.trim()),
  )
  if (!pricesReady) return false
  if (isProductionDeployment() && isTestModeStripeKey()) return false
  return true
}

/** True when a visitor can start a one-time Checkout Session for the current passes. */
export function isCheckoutAvailable(): boolean {
  return isCheckoutSessionAllowed()
}
