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

/** Features locked behind LibertyIQ Pro. */
export const PRO_ROUTES = ['/libertyiq', '/quiz', '/speaking-trainer'] as const

export function isProRoute(pathname: string): boolean {
  return PRO_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  )
}
