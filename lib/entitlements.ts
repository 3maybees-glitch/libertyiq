import { createHmac, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'
import type Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'

export const ENTITLEMENT_COOKIE = 'li_pro'

export type EntitlementPayload = {
  customerId: string
  subscriptionId: string
  status: 'active' | 'trialing'
  /** Unix seconds when this entitlement cookie should expire */
  exp: number
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
    if (payload.status !== 'active' && payload.status !== 'trialing') return null
    return payload
  } catch {
    return null
  }
}

export function buildEntitlementCookie(
  subscription: Stripe.Subscription,
  customerId: string,
): { value: string; maxAge: number } | null {
  const status = subscription.status
  if (status !== 'active' && status !== 'trialing') return null

  const itemPeriodEnd = subscription.items?.data
    ?.map((item) => item.current_period_end)
    .filter((n): n is number => typeof n === 'number')
    .sort((a, b) => b - a)[0]

  const periodEnd =
    itemPeriodEnd ?? Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 32

  // Cookie lasts until period end, capped at 45 days
  const maxAge = Math.max(60, Math.min(periodEnd - Math.floor(Date.now() / 1000), 60 * 60 * 24 * 45))

  const payload: EntitlementPayload = {
    customerId,
    subscriptionId: subscription.id,
    status,
    exp: Math.floor(Date.now() / 1000) + maxAge,
  }

  return { value: encode(payload), maxAge }
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

/** Live-check Stripe for an active Pro subscription on this customer. */
export async function fetchActiveSubscription(
  customerId: string,
): Promise<Stripe.Subscription | null> {
  const stripe = getStripe()
  const list = await stripe.subscriptions.list({
    customer: customerId,
    status: 'all',
    limit: 10,
  })

  return (
    list.data.find((sub) => sub.status === 'active' || sub.status === 'trialing') ?? null
  )
}

export async function entitlementFromCheckoutSession(
  sessionId: string,
): Promise<{ payload: EntitlementPayload; cookie: { value: string; maxAge: number } } | null> {
  const stripe = getStripe()
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['subscription'],
  })

  if (session.mode !== 'subscription' || session.status !== 'complete') return null

  const customerId =
    typeof session.customer === 'string'
      ? session.customer
      : session.customer?.id

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

  const payload = decode(cookie.value)
  if (!payload) return null

  return { payload, cookie }
}
