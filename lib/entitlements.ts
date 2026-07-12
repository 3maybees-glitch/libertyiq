import { createHmac, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'
import type Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'

export const ENTITLEMENT_COOKIE = 'li_pro'

export type EntitlementStatus = 'active' | 'trialing' | 'past_due' | 'lifetime'

export type EntitlementPayload = {
  customerId: string
  /** Subscription id, or checkout session id for lifetime */
  subscriptionId: string
  status: EntitlementStatus
  plan?: 'monthly' | 'yearly' | 'lifetime'
  /** Unix seconds when this entitlement cookie should expire */
  exp: number
}

const PRO_SUBSCRIPTION_STATUSES = new Set<Stripe.Subscription.Status>([
  'active',
  'trialing',
  'past_due',
])

function planFromSubscription(subscription: Stripe.Subscription): 'monthly' | 'yearly' | undefined {
  const meta = subscription.metadata?.plan
  if (meta === 'monthly' || meta === 'yearly') return meta
  const interval = subscription.items.data[0]?.price?.recurring?.interval
  if (interval === 'month') return 'monthly'
  if (interval === 'year') return 'yearly'
  return undefined
}

function entitlementStatusFromSubscription(
  status: Stripe.Subscription.Status,
): EntitlementStatus | null {
  if (status === 'active') return 'active'
  if (status === 'trialing') return 'trialing'
  if (status === 'past_due') return 'past_due'
  return null
}

function getSecret(): string {
  const secret = process.env.ENTITLEMENT_SECRET || process.env.STRIPE_SECRET_KEY
  if (!secret) {
    throw new Error('ENTITLEMENT_SECRET is not configured')
  }
  return secret
}

function encode(payload: EntitlementPayload): string {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const sig = createHmac('sha256', getSecret()).update(body).digest('base64url')
  return `${body}.${sig}`
}

function decode(token: string): EntitlementPayload | null {
  const [body, sig] = token.split('.')
  if (!body || !sig) return null

  const expected = createHmac('sha256', getSecret()).update(body).digest('base64url')
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as EntitlementPayload
    if (!payload.customerId || !payload.subscriptionId || !payload.exp) return null
    if (payload.exp * 1000 < Date.now()) return null
    if (
      payload.status !== 'active' &&
      payload.status !== 'trialing' &&
      payload.status !== 'past_due' &&
      payload.status !== 'lifetime'
    ) {
      return null
    }
    return payload
  } catch {
    return null
  }
}

export function buildEntitlementCookie(
  subscription: Stripe.Subscription,
  customerId: string,
): { value: string; maxAge: number; payload: EntitlementPayload } | null {
  const status = entitlementStatusFromSubscription(subscription.status)
  if (!status) return null

  const itemPeriodEnd = subscription.items?.data
    ?.map((item) => item.current_period_end)
    .filter((n): n is number => typeof n === 'number')
    .sort((a, b) => b - a)[0]

  const periodEnd =
    itemPeriodEnd ?? Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 32

  const maxAge = Math.max(60, Math.min(periodEnd - Math.floor(Date.now() / 1000), 60 * 60 * 24 * 45))

  const payload: EntitlementPayload = {
    customerId,
    subscriptionId: subscription.id,
    status,
    plan: planFromSubscription(subscription),
    exp: Math.floor(Date.now() / 1000) + maxAge,
  }

  return { value: encode(payload), maxAge, payload }
}

/** Lifetime purchase — cookie lasts ~10 years. */
export function buildLifetimeEntitlementCookie(
  customerId: string,
  referenceId: string,
): { value: string; maxAge: number; payload: EntitlementPayload } {
  const maxAge = 60 * 60 * 24 * 365 * 10
  const payload: EntitlementPayload = {
    customerId,
    subscriptionId: referenceId,
    status: 'lifetime',
    plan: 'lifetime',
    exp: Math.floor(Date.now() / 1000) + maxAge,
  }
  return { value: encode(payload), maxAge, payload }
}

export async function getEntitlementFromCookies(): Promise<EntitlementPayload | null> {
  const jar = await cookies()
  const raw = jar.get(ENTITLEMENT_COOKIE)?.value
  if (!raw) return null
  return decode(raw)
}

export function entitlementCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  }
}

export async function fetchActiveSubscription(
  customerId: string,
): Promise<Stripe.Subscription | null> {
  const stripe = getStripe()
  const list = await stripe.subscriptions.list({
    customer: customerId,
    status: 'all',
    limit: 10,
  })

  return list.data.find((sub) => PRO_SUBSCRIPTION_STATUSES.has(sub.status)) ?? null
}

export type RevalidatedEntitlement = {
  isPro: boolean
  payload: EntitlementPayload | null
  cookie: { value: string; maxAge: number } | null
}

/** Re-check a signed cookie against Stripe (subscriptions only; lifetime is trusted). */
export async function revalidateEntitlement(
  payload: EntitlementPayload,
): Promise<RevalidatedEntitlement> {
  if (payload.status === 'lifetime') {
    return { isPro: true, payload, cookie: null }
  }

  if (payload.customerId.startsWith('guest_')) {
    return { isPro: false, payload: null, cookie: null }
  }

  const stripe = getStripe()
  try {
    const subscription = await stripe.subscriptions.retrieve(payload.subscriptionId)
    if (!PRO_SUBSCRIPTION_STATUSES.has(subscription.status)) {
      return { isPro: false, payload: null, cookie: null }
    }

    const cookie = buildEntitlementCookie(subscription, payload.customerId)
    if (!cookie) {
      return { isPro: false, payload: null, cookie: null }
    }

    return { isPro: true, payload: cookie.payload, cookie: { value: cookie.value, maxAge: cookie.maxAge } }
  } catch {
    const fallback = await fetchActiveSubscription(payload.customerId)
    if (!fallback) {
      return { isPro: false, payload: null, cookie: null }
    }
    const cookie = buildEntitlementCookie(fallback, payload.customerId)
    if (!cookie) {
      return { isPro: false, payload: null, cookie: null }
    }
    return { isPro: true, payload: cookie.payload, cookie: { value: cookie.value, maxAge: cookie.maxAge } }
  }
}

export function entitlementFromCheckoutSessionMetadata(
  session: Stripe.Checkout.Session,
): 'monthly' | 'yearly' | 'lifetime' | undefined {
  const plan = session.metadata?.plan
  if (plan === 'monthly' || plan === 'yearly' || plan === 'lifetime') return plan
  if (session.mode === 'payment') return 'lifetime'
  return undefined
}

export async function entitlementFromCheckoutSession(
  sessionId: string,
): Promise<{ payload: EntitlementPayload; cookie: { value: string; maxAge: number } } | null> {
  const stripe = getStripe()
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['subscription'],
  })

  if (session.status !== 'complete') return null

  const customerId =
    typeof session.customer === 'string'
      ? session.customer
      : session.customer?.id

  // Guest checkout may omit customer for one-time payments — use session id as fallback key.
  const effectiveCustomerId = customerId || `guest_${session.id}`

  if (session.mode === 'payment') {
    if (session.payment_status !== 'paid') return null
    const built = buildLifetimeEntitlementCookie(effectiveCustomerId, session.id)
    return { payload: built.payload, cookie: { value: built.value, maxAge: built.maxAge } }
  }

  if (session.mode !== 'subscription') return null
  if (!customerId) return null

  let subscription: Stripe.Subscription | null = null
  if (typeof session.subscription === 'string') {
    subscription = await stripe.subscriptions.retrieve(session.subscription)
  } else if (session.subscription && typeof session.subscription === 'object') {
    subscription = session.subscription as Stripe.Subscription
  }

  if (!subscription) return null

  const cookie = buildEntitlementCookie(subscription, customerId)
  if (!cookie) return null

  const plan = entitlementFromCheckoutSessionMetadata(session)
  const payload: EntitlementPayload = plan
    ? { ...cookie.payload, plan: plan === 'lifetime' ? 'lifetime' : plan }
    : cookie.payload

  return {
    payload,
    cookie: { value: encode(payload), maxAge: cookie.maxAge },
  }
}

export function applyEntitlementCookie(
  response: { cookies: { set: (name: string, value: string, options: ReturnType<typeof entitlementCookieOptions>) => void } },
  cookie: { value: string; maxAge: number },
): void {
  response.cookies.set(ENTITLEMENT_COOKIE, cookie.value, entitlementCookieOptions(cookie.maxAge))
}

export function clearEntitlementCookie(
  response: { cookies: { set: (name: string, value: string, options: ReturnType<typeof entitlementCookieOptions>) => void } },
): void {
  response.cookies.set(ENTITLEMENT_COOKIE, '', entitlementCookieOptions(0))
}
