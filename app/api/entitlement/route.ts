import { NextResponse } from 'next/server'
import {
  PassAccessError,
  applyEntitlementCookie,
  buildEntitlementCookie,
  clearEntitlementCookie,
  confirmCheckoutSession,
  fetchActiveSubscription,
  getEntitlementFromCookies,
  isLegacySubscription,
  payloadHasFullAccess,
  revalidateEntitlement,
} from '@/lib/entitlements'
import { hasStripeSecret, isCheckoutSessionAllowed } from '@/lib/stripe'

function passFields(source: {
  accessCode?: string | null
  seats?: number | null
  seatsUsed?: number | null
  accessExpiresAt?: number | null
  legacySubscription?: boolean
  plan?: string
  status?: string
}) {
  return {
    plan: source.plan,
    status: source.status,
    accessCode: source.accessCode ?? null,
    seats: source.seats ?? null,
    seatsUsed: source.seatsUsed ?? null,
    accessExpiresAt: source.accessExpiresAt ?? null,
    legacySubscription: Boolean(source.legacySubscription),
  }
}

export async function GET() {
  try {
    const configured = isCheckoutSessionAllowed()

    if (!hasStripeSecret()) {
      const existing = await getEntitlementFromCookies()
      if (!existing) {
        return NextResponse.json({
          isPro: false,
          topics: [],
          configured: false,
          mode: 'none',
          reason: 'stripe_not_configured',
        })
      }
      return NextResponse.json({
        isPro: payloadHasFullAccess(existing),
        topics: existing.topics ?? [],
        configured: false,
        mode: 'none',
        customerId: existing.customerId,
        ...passFields({
          plan: existing.plan,
          status: existing.status,
          accessExpiresAt: existing.accessExpiresAt,
          legacySubscription: isLegacySubscription(existing),
        }),
      })
    }

    const existing = await getEntitlementFromCookies()
    if (!existing) {
      return NextResponse.json({
        isPro: false,
        topics: [],
        configured,
        mode: configured ? 'checkout_session' : 'none',
      })
    }

    const validated = await revalidateEntitlement(existing)
    const response = NextResponse.json({
      isPro: validated.isPro,
      topics: validated.topics,
      configured,
      mode: 'checkout_session',
      customerId: validated.payload?.customerId,
      ...passFields({
        plan: validated.payload?.plan,
        status: validated.payload?.status,
        accessCode: validated.accessCode,
        seats: validated.seats,
        seatsUsed: validated.seatsUsed,
        accessExpiresAt: validated.accessExpiresAt ?? validated.payload?.accessExpiresAt,
        legacySubscription: validated.legacySubscription,
      }),
    })

    if (!validated.isPro && validated.topics.length === 0) {
      clearEntitlementCookie(response)
      return response
    }

    if (validated.cookie) {
      applyEntitlementCookie(response, validated.cookie)
    }

    return response
  } catch (error) {
    console.error('entitlement get error', error)
    return NextResponse.json({ isPro: false, topics: [], configured: true }, { status: 200 })
  }
}

/** Confirm a completed Checkout Session and set the pass cookie on this device. */
export async function POST(request: Request) {
  try {
    if (!hasStripeSecret()) {
      return NextResponse.json({ error: 'Stripe is not configured yet.' }, { status: 503 })
    }

    const body = (await request.json().catch(() => ({}))) as {
      sessionId?: string
      customerId?: string
      deviceId?: string
    }

    if (body.sessionId) {
      const existing = await getEntitlementFromCookies()
      const result = await confirmCheckoutSession({
        sessionId: body.sessionId,
        deviceId: body.deviceId,
        existing,
      })
      const response = NextResponse.json({
        isPro: result.isPro,
        topics: result.topics,
        customerId: result.payload.customerId,
        purchasedPlan: result.purchasedPlan,
        ...passFields(result),
      })
      applyEntitlementCookie(response, result.cookie)
      return response
    }

    if (body.customerId) {
      const subscription = await fetchActiveSubscription(body.customerId)
      if (!subscription) {
        return NextResponse.json({ isPro: false, error: 'No active subscription.' }, { status: 404 })
      }
      const cookie = buildEntitlementCookie(subscription, body.customerId)
      if (!cookie) {
        return NextResponse.json({ isPro: false }, { status: 404 })
      }
      const response = NextResponse.json({
        isPro: true,
        topics: [],
        customerId: body.customerId,
        ...passFields({
          plan: cookie.payload.plan,
          status: cookie.payload.status,
          legacySubscription: true,
        }),
      })
      applyEntitlementCookie(response, { value: cookie.value, maxAge: cookie.maxAge })
      return response
    }

    return NextResponse.json({ error: 'sessionId or customerId required.' }, { status: 400 })
  } catch (error) {
    if (error instanceof PassAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    console.error('entitlement post error', error)
    return NextResponse.json({ error: 'Unable to confirm entitlement.' }, { status: 500 })
  }
}
