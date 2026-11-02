import { debateOnePagers } from '@/lib/debate-onepagers'

export type PaidPlan = 'core' | 'family' | 'group' | 'topic'

/** Plans sold before November 2026. Still honored on existing cookies. */
export type LegacyPaidPlan = 'monthly' | 'yearly' | 'lifetime'

export type PassScope = 'core' | 'topic'

export const FREE_FEATURES = [
  'Full argument library (all 14 topics)',
  'Evidence, biblical foundations, and defense tips',
  'Easy quizzes on every topic',
  'Debate one-pagers for every issue',
  'Saved on this device',
] as const

export const CORE_FEATURES = [
  'Everything in Free',
  'Medium and hard quizzes on every issue',
  'Full rank progression to Chief Strategist',
  'Speaking trainer',
  '365 days, then it ends',
  'No subscription and no auto-renew',
] as const

type PassPlan = {
  id: PaidPlan
  label: string
  priceLabel: string
  priceEnv: string
  durationDays: number | null
  seats: number
  scope: PassScope
  mode: 'payment'
  blurb: string
  features: readonly string[]
}

export const PAID_PLANS: Record<PaidPlan, PassPlan> = {
  core: {
    id: 'core',
    label: 'Core Pass',
    priceLabel: '$17.77',
    priceEnv: 'STRIPE_PRICE_ID_CORE_PASS',
    durationDays: 365,
    seats: 1,
    scope: 'core',
    mode: 'payment',
    blurb: 'One student. A year of the full training suite.',
    features: [
      'Medium and hard quizzes on every issue',
      'Full rank progression to Chief Strategist',
      'Speaking trainer',
      '1 seat on this device',
      '365 days, then it ends',
    ],
  },
  family: {
    id: 'family',
    label: 'Family Pass',
    priceLabel: '$47.77',
    priceEnv: 'STRIPE_PRICE_ID_FAMILY_PASS',
    durationDays: 365,
    seats: 6,
    scope: 'core',
    mode: 'payment',
    blurb: 'The same Core training for a household.',
    features: [
      'Everything in Core Pass',
      'One access code for the home',
      'Up to 6 students, one device each',
      '365 days, then it ends',
    ],
  },
  group: {
    id: 'group',
    label: 'Group Pass',
    priceLabel: '$147',
    priceEnv: 'STRIPE_PRICE_ID_GROUP_PASS',
    durationDays: 365,
    seats: 30,
    scope: 'core',
    mode: 'payment',
    blurb: 'A church class, a co-op, or a debate club.',
    features: [
      'Everything in Core Pass',
      'One access code for the group',
      'Up to 30 students, one device each',
      '365 days, then it ends',
    ],
  },
  topic: {
    id: 'topic',
    label: 'Topic Pack',
    priceLabel: '$7.77',
    priceEnv: 'STRIPE_PRICE_ID_TOPIC_PACK',
    durationDays: null,
    seats: 1,
    scope: 'topic',
    mode: 'payment',
    blurb: 'One issue, on this device, for good.',
    features: [
      'Medium and hard quizzes for one topic you choose',
      "That topic's debate one-pager",
      'Does not expire',
      'Does not include the speaking trainer or other topics',
    ],
  },
}

/** Shown on /pricing and returned by POST /api/checkout when live prices are not configured. */
export const CHECKOUT_UNAVAILABLE_MESSAGE =
  'Checkout is unavailable right now. The free library and easy quizzes are still open.'

/** Routes that require a Core, Family, or Group pass (speaking trainer). */
export const PRO_ROUTES = ['/speaking-trainer'] as const

export function isProRoute(pathname: string): boolean {
  return PRO_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  )
}

/** Free tier includes easy quizzes. Passes unlock medium and hard. */
export function isDifficultyFree(difficulty: string): boolean {
  return difficulty === 'easy'
}

export function isPaidPlan(value: string): value is PaidPlan {
  return value === 'core' || value === 'family' || value === 'group' || value === 'topic'
}

export function isTopicId(topicId: string): boolean {
  return debateOnePagers.some((topic) => topic.topicId === topicId)
}

export function topicTitle(topicId: string): string | undefined {
  return debateOnePagers.find((topic) => topic.topicId === topicId)?.title
}

export const PASS_TOPICS = debateOnePagers.map((topic) => ({
  id: topic.topicId,
  title: topic.title,
}))
