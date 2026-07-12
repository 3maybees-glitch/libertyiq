export type PaidPlan = 'monthly' | 'yearly' | 'lifetime'

export const FREE_FEATURES = [
  'Full argument library (all 11 topics)',
  'Evidence, biblical foundations, and defense tips',
  'Topic deep-dive pages',
  'Easy quizzes on every topic (practice teaser)',
  'Local progress saved in your browser',
] as const

export const CORE_FEATURES = [
  'Everything in Free',
  'Medium & hard quizzes',
  'Full rank progression to Chief Strategist',
  'Public speaking trainer with filler-word analysis',
  'Priority access to new topics and drills',
] as const

/** @deprecated Use CORE_FEATURES */
export const PRO_FEATURES = CORE_FEATURES

export const PAID_PLANS = {
  monthly: {
    id: 'monthly' as const,
    tier: 'Core',
    label: 'Monthly',
    priceLabel: '$5.99',
    period: '/month',
    blurb: 'Full Core access. Cancel anytime.',
    mode: 'subscription' as const,
  },
  yearly: {
    id: 'yearly' as const,
    tier: 'Core',
    label: 'Yearly',
    priceLabel: '$59',
    period: '/year',
    blurb: 'Best value subscription — about 2 months free.',
    mode: 'subscription' as const,
  },
  lifetime: {
    id: 'lifetime' as const,
    tier: 'Lifetime',
    label: 'Lifetime',
    priceLabel: '$129',
    period: ' once',
    blurb: 'Early-bird lifetime unlock. Limited offer.',
    mode: 'payment' as const,
    badge: 'Early bird',
  },
} as const

/** @deprecated Use PAID_PLANS */
export const PRO_PLANS = {
  monthly: PAID_PLANS.monthly,
  yearly: PAID_PLANS.yearly,
} as const

/** @deprecated Use PaidPlan */
export type BillingInterval = PaidPlan

/**
 * Public Stripe Payment Link URLs (safe to expose).
 * Used when server-side Checkout Sessions are not configured yet.
 */
export const STRIPE_PAYMENT_LINKS: Record<PaidPlan, string> = {
  monthly:
    process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_MONTHLY ||
    'https://buy.stripe.com/test_4gMcN766ie6A4AF0K7cZa02',
  yearly:
    process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_YEARLY ||
    'https://buy.stripe.com/test_cNibJ30LYbYs9UZ8czcZa03',
  lifetime:
    process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_LIFETIME ||
    'https://buy.stripe.com/test_28E8wRfGS4w06IN9gDcZa04',
}

/** Routes that require Core/Lifetime (speaking trainer). Quizzes use level gating. */
export const PRO_ROUTES = ['/speaking-trainer'] as const

export function isProRoute(pathname: string): boolean {
  return PRO_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  )
}

/** Free tier includes easy quizzes; Core unlocks medium/hard. */
export function isDifficultyFree(difficulty: string): boolean {
  return difficulty === 'easy'
}
