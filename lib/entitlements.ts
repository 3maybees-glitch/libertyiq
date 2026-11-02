import { createHmac, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'
import type Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'
import { isStripeConfigured, isProductionDeployment } from '@/lib/stripe'
import { PAID_PLANS, isPaidPlan, isTopicId, type PaidPlan } from '@/lib/pricing'
import {
  claimDevice,
  createAccessCode,
  isPassCurrent,
  normalizeAccessCode,
  normalizeCheckoutSessionId,
  normalizeDeviceId,
  parseDeviceList,
  passExpiresAt,
} from '@/lib/pass-seats'

export const ENTITLEMENT_COOKIE = 'li_pro'

export type EntitlementStatus = 'active' | 'trialing' | 'past_due' | 'lifetime' | 'pass' | 'topic'

export type EntitlementPlan = 'monthly' | 'yearly' | 'lifetime' | PaidPlan

export type TopicGrant = {
  topicId: string
  sessionId: string
}

export type EntitlementPayload = {
  customerId: string
  /** Subscription id, or checkout session id for a pass or lifetime purchase */
  subscriptionId: string
  status: EntitlementStatus
  plan?: EntitlementPlan
  /** Unix seconds when this entitlement cookie should expire */
  exp: number
  /** Unix seconds when a 365-day pass ends. Absent for legacy lifetime and topic-only. */
  accessExpiresAt?: number
  /** Topic ids with a permanent medium/hard unlock. */
  topics?: string[]
  topicGrants?: TopicGrant[]
  deviceId?: string
}

const STATUSES = new Set<EntitlementStatus>([
  'active',
  'trialing',
  'past_due',
  'lifetime',
  'pass',
  'topic',
])

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

/** Parse a signed entitlement cookie without calling Stripe. */
export function parseEntitlementCookie(token: string): EntitlementPayload | null {
  return decode(token)
}

function sanitizeTopics(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  const seen = new Set<string>()
  for (const item of value) {
    if (typeof item === 'string' && isTopicId(item)) seen.add(item)
  }
  return [...seen]
}

function sanitizeTopicGrants(value: unknown): TopicGrant[] {
  if (!Array.isArray(value)) return []
  const grants: TopicGrant[] = []
  for (const item of value) {
    if (!item || typeof item !== 'object') continue
    const topicId = (item as TopicGrant).topicId
    const sessionId = (item as TopicGrant).sessionId
    if (typeof topicId === 'string' && isTopicId(topicId) && normalizeCheckoutSessionId(sessionId)) {
      grants.push({ topicId, sessionId })
    }
  }
  return grants
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
    if (!STATUSES.has(payload.status)) return null
    payload.topics = sanitizeTopics(payload.topics)
    payload.topicGrants = sanitizeTopicGrants(payload.topicGrants)
    if (payload.topics.length === 0) delete payload.topics
    if (payload.topicGrants.length === 0) delete payload.topicGrants
    return payload
  } catch {
    return null
  }
}

export function signEntitlement(
  payload: EntitlementPayload,
  maxAge: number,
): { value: string; maxAge: number; payload: EntitlementPayload } {
  return { value: encode(payload), maxAge, payload }
}

export function isLegacySubscription(payload: EntitlementPayload): boolean {
  return payload.status === 'active' || payload.status === 'trialing' || payload.status === 'past_due'
}

export function payloadHasFullAccess(payload: EntitlementPayload, nowMs = Date.now()): boolean {
  if (payload.status === 'lifetime' || isLegacySubscription(payload)) return true
  if (payload.status === 'pass' && payload.accessExpiresAt) {
    return payload.accessExpiresAt * 1000 > nowMs
  }
  return false
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
  topics: string[]
  payload: EntitlementPayload | null
  cookie: { value: string; maxAge: number } | null
  accessCode: string | null
  seats: number | null
  seatsUsed: number | null
  accessExpiresAt: number | null
  legacySubscription: boolean
}

export class PassAccessError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = 'PassAccessError'
    this.status = status
  }
}

function entitlementResult(
  partial: Partial<RevalidatedEntitlement> & Pick<RevalidatedEntitlement, 'isPro' | 'topics'>,
): RevalidatedEntitlement {
  return {
    payload: null,
    cookie: null,
    accessCode: null,
    seats: null,
    seatsUsed: null,
    accessExpiresAt: null,
    legacySubscription: false,
    ...partial,
  }
}

function sessionPriceId(session: Stripe.Checkout.Session): string | null {
  const price = session.line_items?.data[0]?.price
  if (!price) return null
  return typeof price === 'string' ? price : price.id
}

export function isSessionPaid(session: Stripe.Checkout.Session): boolean {
  if (session.status !== 'complete') return false
  if (session.payment_status !== 'paid') return false
  const paymentIntent = session.payment_intent
  if (paymentIntent && typeof paymentIntent === 'object') {
    if (paymentIntent.status === 'canceled') return false
    const refunded = (paymentIntent as Stripe.PaymentIntent & { amount_refunded?: number }).amount_refunded
    if (typeof refunded === 'number' && paymentIntent.amount > 0 && refunded >= paymentIntent.amount) {
      return false
    }
  }
  return true
}

function customerIdFromSession(session: Stripe.Checkout.Session): string {
  const customerId =
    typeof session.customer === 'string' ? session.customer : session.customer?.id
  return customerId || `guest_${session.id}`
}

async function revalidateTopicGrants(payload: EntitlementPayload): Promise<TopicGrant[]> {
  const grants = payload.topicGrants ?? []
  if (grants.length === 0 || !payload.deviceId) return []
  const stripe = getStripe()
  const kept: TopicGrant[] = []
  for (const grant of grants) {
    try {
      const session = await stripe.checkout.sessions.retrieve(grant.sessionId, {
        expand: ['payment_intent'],
      })
      if (!isSessionPaid(session)) continue
      if (isProductionDeployment() && session.livemode === false) continue
      if (session.metadata?.plan !== 'topic' || session.metadata.topic_id !== grant.topicId) continue
      const devices = parseDeviceList(session.metadata.device_ids)
      if (!devices.includes(payload.deviceId)) continue
      kept.push(grant)
    } catch {
      continue
    }
  }
  return kept
}

function topicsFromGrants(grants: TopicGrant[]): string[] {
  return [...new Set(grants.map((grant) => grant.topicId))]
}

function topicOnlyCookie(
  customerId: string,
  grants: TopicGrant[],
  deviceId?: string,
): { value: string; maxAge: number; payload: EntitlementPayload } | null {
  if (grants.length === 0) return null
  const maxAge = 60 * 60 * 24 * 365 * 10
  const payload: EntitlementPayload = {
    customerId,
    subscriptionId: grants[grants.length - 1]?.sessionId ?? customerId,
    status: 'topic',
    plan: 'topic',
    exp: Math.floor(Date.now() / 1000) + maxAge,
    topics: topicsFromGrants(grants),
    topicGrants: grants,
    deviceId,
  }
  return signEntitlement(payload, maxAge)
}

async function revalidateLifetimeEntitlement(
  payload: EntitlementPayload,
): Promise<RevalidatedEntitlement> {
  const stripe = getStripe()
  const grants = await revalidateTopicGrants(payload)
  try {
    const session = await stripe.checkout.sessions.retrieve(payload.subscriptionId, {
      expand: ['payment_intent'],
    })
    if (isSessionPaid(session) && !(isProductionDeployment() && session.livemode === false)) {
      const next: EntitlementPayload = {
        ...payload,
        topics: topicsFromGrants(grants),
        topicGrants: grants,
      }
      if (!next.topics?.length) delete next.topics
      if (!next.topicGrants?.length) delete next.topicGrants
      return entitlementResult({
        isPro: true,
        topics: next.topics ?? [],
        payload: next,
        legacySubscription: false,
      })
    }
  } catch {
    // Fall through — the one-time payment is no longer valid.
  }

  const topicCookie = topicOnlyCookie(payload.customerId, grants, payload.deviceId)
  if (!topicCookie) return entitlementResult({ isPro: false, topics: [] })
  return entitlementResult({
    isPro: false,
    topics: topicCookie.payload.topics ?? [],
    payload: topicCookie.payload,
    cookie: { value: topicCookie.value, maxAge: topicCookie.maxAge },
  })
}

async function revalidatePassEntitlement(
  payload: EntitlementPayload,
): Promise<RevalidatedEntitlement> {
  const grants = await revalidateTopicGrants(payload)
  const stripe = getStripe()
  let full: EntitlementPayload | null = null
  let accessCode: string | null = null
  let seats: number | null = null
  let seatsUsed: number | null = null
  let accessExpiresAt: number | null = payload.accessExpiresAt ?? null

  if (payload.status === 'pass' && payload.deviceId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(payload.subscriptionId, {
        expand: ['payment_intent'],
      })
      const plan = session.metadata?.plan
      const expires = Number(session.metadata?.access_expires_at || payload.accessExpiresAt || 0)
      const devices = parseDeviceList(session.metadata?.device_ids)
      if (
        isSessionPaid(session) &&
        isPaidPlan(plan ?? '') &&
        PAID_PLANS[plan as PaidPlan].scope === 'core' &&
        expires > 0 &&
        isPassCurrent(expires) &&
        devices.includes(payload.deviceId) &&
        !(isProductionDeployment() && session.livemode === false)
      ) {
        accessCode = session.metadata?.access_code || null
        seats = Number(session.metadata?.seats || PAID_PLANS[plan as PaidPlan].seats)
        seatsUsed = devices.length
        accessExpiresAt = expires
        const maxAge =
          grants.length > 0
            ? 60 * 60 * 24 * 365 * 10
            : Math.max(60, expires - Math.floor(Date.now() / 1000))
        full = {
          ...payload,
          plan: plan as PaidPlan,
          accessExpiresAt: expires,
          topics: topicsFromGrants(grants),
          topicGrants: grants,
          exp: Math.floor(Date.now() / 1000) + maxAge,
        }
        if (!full.topics?.length) delete full.topics
        if (!full.topicGrants?.length) delete full.topicGrants
        const signed = signEntitlement(full, maxAge)
        return entitlementResult({
          isPro: true,
          topics: full.topics ?? [],
          payload: signed.payload,
          cookie: { value: signed.value, maxAge },
          accessCode,
          seats,
          seatsUsed,
          accessExpiresAt: expires,
        })
      }
    } catch {
      // The pass session could not be confirmed.
    }
  }

  const topicCookie = topicOnlyCookie(payload.customerId, grants, payload.deviceId)
  if (!topicCookie) return entitlementResult({ isPro: false, topics: [] })
  return entitlementResult({
    isPro: false,
    topics: topicCookie.payload.topics ?? [],
    payload: topicCookie.payload,
    cookie: { value: topicCookie.value, maxAge: topicCookie.maxAge },
    accessExpiresAt,
  })
}

/** Re-check a signed cookie against Stripe (passes, subscriptions, and lifetime purchases). */
export async function revalidateEntitlement(
  payload: EntitlementPayload,
): Promise<RevalidatedEntitlement> {
  if (payload.status === 'pass' || payload.status === 'topic') {
    return revalidatePassEntitlement(payload)
  }

  if (payload.status === 'lifetime') {
    return revalidateLifetimeEntitlement(payload)
  }

  if (payload.customerId.startsWith('guest_')) {
    return entitlementResult({ isPro: false, topics: [] })
  }

  const grants = await revalidateTopicGrants(payload)
  const stripe = getStripe()

  const fromSubscription = async (
    subscription: Stripe.Subscription,
  ): Promise<RevalidatedEntitlement> => {
    const cookie = buildEntitlementCookie(subscription, payload.customerId)
    if (!cookie) {
      const topicCookie = topicOnlyCookie(payload.customerId, grants, payload.deviceId)
      if (!topicCookie) return entitlementResult({ isPro: false, topics: [] })
      return entitlementResult({
        isPro: false,
        topics: topicCookie.payload.topics ?? [],
        payload: topicCookie.payload,
        cookie: { value: topicCookie.value, maxAge: topicCookie.maxAge },
      })
    }
    const next: EntitlementPayload = {
      ...cookie.payload,
      topics: topicsFromGrants(grants),
      topicGrants: grants,
      deviceId: payload.deviceId,
    }
    if (!next.topics?.length) delete next.topics
    if (!next.topicGrants?.length) delete next.topicGrants
    const signed = signEntitlement(next, cookie.maxAge)
    return entitlementResult({
      isPro: true,
      topics: next.topics ?? [],
      payload: signed.payload,
      cookie: { value: signed.value, maxAge: cookie.maxAge },
      legacySubscription: true,
    })
  }

  try {
    const subscription = await stripe.subscriptions.retrieve(payload.subscriptionId)
    if (!PRO_SUBSCRIPTION_STATUSES.has(subscription.status)) {
      const topicCookie = topicOnlyCookie(payload.customerId, grants, payload.deviceId)
      if (!topicCookie) return entitlementResult({ isPro: false, topics: [] })
      return entitlementResult({
        isPro: false,
        topics: topicCookie.payload.topics ?? [],
        payload: topicCookie.payload,
        cookie: { value: topicCookie.value, maxAge: topicCookie.maxAge },
      })
    }
    return fromSubscription(subscription)
  } catch {
    const fallback = await fetchActiveSubscription(payload.customerId)
    if (!fallback) return entitlementResult({ isPro: false, topics: [] })
    return fromSubscription(fallback)
  }
}

export function entitlementFromCheckoutSessionMetadata(
  session: Stripe.Checkout.Session,
): 'monthly' | 'yearly' | 'lifetime' | undefined {
  const plan = session.metadata?.plan
  if (plan === 'monthly' || plan === 'yearly' || plan === 'lifetime') return plan
  if (isPaidPlan(plan ?? '')) return undefined
  if (session.mode === 'payment') return 'lifetime'
  return undefined
}

export async function entitlementFromCheckoutSession(
  sessionId: string,
): Promise<{ payload: EntitlementPayload; cookie: { value: string; maxAge: number } } | null> {
  const stripe = getStripe()
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['subscription', 'payment_intent', 'line_items'],
  })

  if (session.status !== 'complete') return null

  const customerId =
    typeof session.customer === 'string'
      ? session.customer
      : session.customer?.id

  // Guest checkout may omit customer for one-time payments — use session id as fallback key.
  const effectiveCustomerId = customerId || `guest_${session.id}`

  if (session.mode === 'payment') {
    if (!isSessionPaid(session)) return null
    if (isPaidPlan(session.metadata?.plan ?? '')) return null
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

export type ConfirmedAccess = {
  payload: EntitlementPayload
  cookie: { value: string; maxAge: number }
  isPro: boolean
  topics: string[]
  accessCode: string | null
  seats: number | null
  seatsUsed: number | null
  accessExpiresAt: number | null
  plan: EntitlementPlan
  purchasedPlan: PaidPlan | EntitlementPlan
  legacySubscription: boolean
}

async function loadSession(sessionId: string): Promise<Stripe.Checkout.Session> {
  return getStripe().checkout.sessions.retrieve(sessionId, {
    expand: ['payment_intent', 'line_items', 'subscription'],
  })
}

function assertLiveSession(session: Stripe.Checkout.Session): void {
  if (isProductionDeployment() && session.livemode === false) {
    throw new PassAccessError('Checkout is unavailable right now.', 503)
  }
}

async function bindDevice(
  session: Stripe.Checkout.Session,
  deviceId: string,
  seats: number,
): Promise<Stripe.Checkout.Session> {
  const stripe = getStripe()
  let current = session
  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt > 0) current = await stripe.checkout.sessions.retrieve(session.id)
    const decision = claimDevice(parseDeviceList(current.metadata?.device_ids), deviceId, seats)
    if (!decision.ok) throw new PassAccessError(decision.error, 409)
    if (!decision.added) return current
    const updated = await stripe.checkout.sessions.update(session.id, {
      metadata: { device_ids: decision.devices.join(',') },
    })
    const confirmed = parseDeviceList(updated.metadata?.device_ids)
    if (confirmed.includes(deviceId) && confirmed.length <= seats) return updated
  }
  throw new PassAccessError('Could not reserve a seat. Try again.', 409)
}

function mergeTopicGrants(existing: EntitlementPayload | null, incoming: TopicGrant[]): TopicGrant[] {
  const map = new Map<string, TopicGrant>()
  for (const grant of existing?.topicGrants ?? []) map.set(grant.topicId, grant)
  for (const grant of incoming) map.set(grant.topicId, grant)
  return [...map.values()]
}

async function confirmPassSession(
  session: Stripe.Checkout.Session,
  deviceId: string,
  existing: EntitlementPayload | null,
): Promise<ConfirmedAccess> {
  assertLiveSession(session)
  if (!isSessionPaid(session)) {
    throw new PassAccessError('Checkout session is not complete.', 400)
  }
  const plan = session.metadata?.plan
  if (!isPaidPlan(plan ?? '')) {
    throw new PassAccessError('This payment is not a LibertyIQ pass.', 400)
  }
  const spec = PAID_PLANS[plan as PaidPlan]
  const expectedPrice = process.env[spec.priceEnv]?.trim()
  const paidPrice = sessionPriceId(session)
  if (expectedPrice && paidPrice && paidPrice !== expectedPrice) {
    throw new PassAccessError('This payment does not match a LibertyIQ pass.', 400)
  }

  const topicId = session.metadata?.topic_id || null
  if (spec.scope === 'topic' && (!topicId || !isTopicId(topicId))) {
    throw new PassAccessError('Choose a topic before checkout.', 400)
  }

  const seats = Number(session.metadata?.seats || spec.seats)
  const durationDays = session.metadata?.duration_days
    ? Number(session.metadata.duration_days)
    : spec.durationDays
  let accessExpiresAt = Number(session.metadata?.access_expires_at || 0)
  if (durationDays && durationDays > 0 && !isPassCurrent(accessExpiresAt)) {
    accessExpiresAt = passExpiresAt(session.created, durationDays)
  }
  if (durationDays && durationDays > 0 && !isPassCurrent(accessExpiresAt)) {
    throw new PassAccessError('This pass has ended.', 410)
  }

  const metadata: Record<string, string> = {}
  if (!session.metadata?.seats) metadata.seats = String(spec.seats)
  if (durationDays && !session.metadata?.duration_days) metadata.duration_days = String(durationDays)
  if (!session.metadata?.scope) metadata.scope = spec.scope
  if (durationDays && session.metadata?.access_expires_at !== String(accessExpiresAt)) {
    metadata.access_expires_at = String(accessExpiresAt)
  }
  let accessCode = session.metadata?.access_code || null
  if (spec.seats > 1 && !accessCode) {
    accessCode = createAccessCode()
    metadata.access_code = accessCode
  }
  if (Object.keys(metadata).length > 0) {
    session = await getStripe().checkout.sessions.update(session.id, { metadata })
  }
  const paymentIntentId =
    typeof session.payment_intent === 'string'
      ? session.payment_intent
      : session.payment_intent?.id
  if (paymentIntentId && (accessCode || session.metadata?.access_code)) {
    await getStripe().paymentIntents.update(paymentIntentId, {
      metadata: {
        access_code: session.metadata?.access_code || accessCode || '',
        checkout_session: session.id,
        plan: plan as string,
        seats: String(seats),
      },
    })
  }

  session = await bindDevice(session, deviceId, seats)
  const devices = parseDeviceList(session.metadata?.device_ids)
  const incomingGrants: TopicGrant[] =
    spec.scope === 'topic' && topicId ? [{ topicId, sessionId: session.id }] : []
  const topicGrants = mergeTopicGrants(existing, incomingGrants)
  const topics = topicsFromGrants(topicGrants)
  const customerId = customerIdFromSession(session)

  const existingFull =
    existing != null &&
    (existing.status === 'lifetime' ||
      isLegacySubscription(existing) ||
      (existing.status === 'pass' && payloadHasFullAccess(existing)))

  let payload: EntitlementPayload
  let maxAge: number
  if (spec.scope === 'topic' && existingFull && existing) {
    maxAge = 60 * 60 * 24 * 365 * 10
    payload = {
      ...existing,
      topics,
      topicGrants,
      deviceId: existing.deviceId || deviceId,
      exp: Math.floor(Date.now() / 1000) + maxAge,
    }
  } else if (spec.scope === 'core') {
    maxAge =
      topics.length > 0
        ? 60 * 60 * 24 * 365 * 10
        : Math.max(60, accessExpiresAt - Math.floor(Date.now() / 1000))
    payload = {
      customerId,
      subscriptionId: session.id,
      status: 'pass',
      plan: plan as PaidPlan,
      exp: Math.floor(Date.now() / 1000) + maxAge,
      accessExpiresAt,
      deviceId,
      ...(topics.length ? { topics, topicGrants } : {}),
    }
  } else {
    maxAge = 60 * 60 * 24 * 365 * 10
    payload = {
      customerId,
      subscriptionId: session.id,
      status: 'topic',
      plan: 'topic',
      exp: Math.floor(Date.now() / 1000) + maxAge,
      deviceId,
      topics,
      topicGrants,
    }
  }

  const signed = signEntitlement(payload, maxAge)
  return {
    payload: signed.payload,
    cookie: { value: signed.value, maxAge },
    isPro: payloadHasFullAccess(signed.payload),
    topics: signed.payload.topics ?? [],
    accessCode: session.metadata?.access_code || accessCode,
    seats,
    seatsUsed: devices.length,
    accessExpiresAt: signed.payload.accessExpiresAt ?? null,
    plan: signed.payload.plan ?? (plan as PaidPlan),
    purchasedPlan: plan as PaidPlan,
    legacySubscription: isLegacySubscription(signed.payload),
  }
}

/** Confirm a Checkout Session and bind this device to a seat. */
export async function confirmCheckoutSession(options: {
  sessionId: string
  deviceId?: string | null
  existing?: EntitlementPayload | null
}): Promise<ConfirmedAccess> {
  const sessionId = normalizeCheckoutSessionId(options.sessionId)
  if (!sessionId) throw new PassAccessError('Checkout session is not complete.', 400)
  const session = await loadSession(sessionId)
  const plan = session.metadata?.plan
  if (isPaidPlan(plan ?? '')) {
    const deviceId = normalizeDeviceId(options.deviceId)
    if (!deviceId) throw new PassAccessError('This browser could not be identified. Refresh and try again.', 400)
    return confirmPassSession(session, deviceId, options.existing ?? null)
  }

  const legacy = await entitlementFromCheckoutSession(sessionId)
  if (!legacy) throw new PassAccessError('Checkout session is not complete.', 400)
  return {
    payload: legacy.payload,
    cookie: legacy.cookie,
    isPro: payloadHasFullAccess(legacy.payload),
    topics: legacy.payload.topics ?? [],
    accessCode: null,
    seats: null,
    seatsUsed: null,
    accessExpiresAt: null,
    plan: legacy.payload.plan ?? 'lifetime',
    purchasedPlan: legacy.payload.plan ?? 'lifetime',
    legacySubscription: isLegacySubscription(legacy.payload),
  }
}

/** Redeem a family or group code, or a checkout session id, onto this device. */
export async function redeemAccessCode(options: {
  code: string
  deviceId: string
  existing?: EntitlementPayload | null
}): Promise<ConfirmedAccess> {
  const deviceId = normalizeDeviceId(options.deviceId)
  if (!deviceId) throw new PassAccessError('This browser could not be identified. Refresh and try again.', 400)

  const sessionId = normalizeCheckoutSessionId(options.code)
  if (sessionId) {
    return confirmCheckoutSession({ sessionId, deviceId, existing: options.existing })
  }

  const accessCode = normalizeAccessCode(options.code)
  if (!accessCode) throw new PassAccessError('Enter the access code from the pass.', 400)

  const found = await getStripe().paymentIntents.search({
    query: `metadata['access_code']:'${accessCode}'`,
    limit: 1,
  })
  const linkedSessionId = normalizeCheckoutSessionId(found.data[0]?.metadata?.checkout_session ?? '')
  if (!linkedSessionId) {
    throw new PassAccessError(
      'That code was not found. Check the letters, or wait a minute if the pass was just purchased.',
      404,
    )
  }
  const loaded = await loadSession(linkedSessionId)
  return confirmPassSession(loaded, deviceId, options.existing ?? null)
}

/** Server-side Pro check with Stripe revalidation when configured. */
export async function hasProAccess(): Promise<boolean> {
  const existing = await getEntitlementFromCookies()
  if (!existing) return false

  if (!isStripeConfigured()) {
    return true
  }

  const validated = await revalidateEntitlement(existing)
  return validated.isPro
}
