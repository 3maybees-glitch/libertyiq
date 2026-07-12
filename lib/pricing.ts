export type BillingInterval = 'monthly' | 'yearly'

export const FREE_FEATURES = [
  'Full argument library (11 topics)',
  'Evidence, outlines, and defense tips',
  'Topic deep-dive pages',
] as const

export const PRO_FEATURES = [
  'Everything in Free',
  'Unlimited quizzes (easy / medium / hard)',
  'Rank progression to Chief Strategist',
  'Public speaking trainer with filler-word analysis',
] as const

export const PRO_PLANS = {
  monthly: {
    id: 'monthly' as const,
    label: 'Monthly',
    priceLabel: '$9.99',
    period: '/month',
    blurb: 'Cancel anytime.',
  },
  yearly: {
    id: 'yearly' as const,
    label: 'Yearly',
    priceLabel: '$79',
    period: '/year',
    blurb: 'Save ~34% vs monthly.',
  },
} as const

/**
 * Public Stripe Payment Link URLs (safe to expose).
 * Used when server-side Checkout Sessions are not configured yet.
 * Replace with live-mode links after claiming your Stripe account.
 */
export const STRIPE_PAYMENT_LINKS: Record<BillingInterval, string> = {
  monthly:
    process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_MONTHLY ||
    'https://buy.stripe.com/test_3cIaEZ3Yae6A7MR64rcZa00',
  yearly:
    process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_YEARLY ||
    'https://buy.stripe.com/test_5kQ3cx2U66E87MR9gDcZa01',
}

/** Features locked behind LibertyIQ Pro. */
export const PRO_ROUTES = ['/libertyiq', '/quiz', '/speaking-trainer'] as const

export function isProRoute(pathname: string): boolean {
  return PRO_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  )
}
