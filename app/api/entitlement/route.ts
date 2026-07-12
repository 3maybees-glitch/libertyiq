import { NextResponse } from 'next/server'
import {
  applyEntitlementCookie,
  buildEntitlementCookie,
  clearEntitlementCookie,
  entitlementFromCheckoutSession,
  fetchActiveSubscription,
  getEntitlementFromCookies,
  revalidateEntitlement,
} from '@/lib/entitlements'
import { isStripeConfigured } from '@/lib/stripe'
import { STRIPE_PAYMENT_LINKS } from '@/lib/pricing'

export async function GET() {
  try {
    const checkoutAvailable =
      isStripeConfigured() ||
      Boolean(
        STRIPE_PAYMENT_LINKS.monthly ||
          STRIPE_PAYMENT_LINKS.yearly ||
          STRIPE_PAYMENT_LINKS.lifetime,
      )

    if (!isStripeConfigured()) {
      return NextResponse.json({
        isPro: false,
        configured: checkoutAvailable,
        reason: checkoutAvailable ? 'payment_links' : 'stripe_not_configured',
      })
    }

    const existing = await getEntitlementFromCookies()
    if (!existing) {
      return NextResponse.json({
        isPro: false,
        configured: true,
      })
    }

    const validated = await revalidateEntitlement(existing)
    const response = NextResponse.json({
      isPro: validated.isPro,
      configured: true,
      customerId: validated.payload?.customerId,
      status: validated.payload?.status,
      plan: validated.payload?.plan,
    })

    if (!validated.isPro) {
      clearEntitlementCookie(response)
      return response
    }

    if (validated.cookie) {
      applyEntitlementCookie(response, validated.cookie)
    }

    return response
  } catch (error) {
    console.error('entitlement get error', error)
    return NextResponse.json({ isPro: false, configured: true }, { status: 200 })
  }
}

/** Confirm a completed Checkout Session and set the Core/Lifetime cookie. */
export async function POST(request: Request) {
  try {
    if (!isStripeConfigured()) {
      return NextResponse.json({ error: 'Stripe is not configured yet.' }, { status: 503 })
    }

    const body = (await request.json().catch(() => ({}))) as {
      sessionId?: string
      customerId?: string
    }

    if (body.sessionId) {
      const result = await entitlementFromCheckoutSession(body.sessionId)
      if (!result) {
        return NextResponse.json({ error: 'Checkout session is not complete.' }, { status: 400 })
      }

      const response = NextResponse.json({
        isPro: true,
        customerId: result.payload.customerId,
        status: result.payload.status,
        plan: result.payload.plan,
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
        customerId: body.customerId,
        status: cookie.payload.status,
        plan: cookie.payload.plan,
      })
      applyEntitlementCookie(response, { value: cookie.value, maxAge: cookie.maxAge })
      return response
    }

    return NextResponse.json({ error: 'sessionId or customerId required.' }, { status: 400 })
  } catch (error) {
    console.error('entitlement post error', error)
    return NextResponse.json({ error: 'Unable to confirm entitlement.' }, { status: 500 })
  }
}
