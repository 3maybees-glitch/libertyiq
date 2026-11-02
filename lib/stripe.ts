import Stripe from 'stripe'
import type { PaidPlan } from '@/lib/pricing'

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

/**
 * Live Payment Link for a plan, if one is configured.
 * Test-mode links are dropped so they cannot be used as a fallback.
 */
export function getPaymentLink(plan: PaidPlan): string | null {
  const map: Record<PaidPlan, string | undefined> = {
    monthly: process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_MONTHLY,
    yearly: process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_YEARLY,
    lifetime: process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_LIFETIME,
  }
  const url = map[plan]?.trim() ?? ''
  if (!url || isTestModePaymentLink(url)) return null
  return url
}

export function hasLivePaymentLink(): boolean {
  return (['monthly', 'yearly', 'lifetime'] as const).some((plan) =>
    Boolean(getPaymentLink(plan)),
  )
}

export function getPriceId(plan: PaidPlan): string {
  const map: Record<PaidPlan, string | undefined> = {
    monthly: process.env.STRIPE_PRICE_ID_MONTHLY,
    yearly: process.env.STRIPE_PRICE_ID_YEARLY,
    lifetime: process.env.STRIPE_PRICE_ID_LIFETIME,
  }
  const priceId = map[plan]
  if (!priceId) {
    throw new Error(`Stripe price for plan "${plan}" is not configured`)
  }
  return priceId
}

export function isStripeConfigured(): boolean {
  return Boolean(
    process.env.STRIPE_SECRET_KEY &&
      process.env.STRIPE_PRICE_ID_MONTHLY &&
      process.env.STRIPE_PRICE_ID_YEARLY &&
      process.env.STRIPE_PRICE_ID_LIFETIME,
  )
}

/**
 * Checkout Sessions are allowed when the secret and all three price IDs are set,
 * and production is not pointed at a test-mode secret key.
 */
export function isCheckoutSessionAllowed(): boolean {
  if (!isStripeConfigured()) return false
  if (isProductionDeployment() && isTestModeStripeKey()) return false
  return true
}

/** True when a visitor can start live checkout (Checkout Sessions or a non-test Payment Link). */
export function isCheckoutAvailable(): boolean {
  if (isCheckoutSessionAllowed()) return true
  return hasLivePaymentLink()
}
