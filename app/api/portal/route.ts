import { NextResponse } from 'next/server'
import {
  entitlementCookieOptions,
  ENTITLEMENT_COOKIE,
  getEntitlementFromCookies,
} from '@/lib/entitlements'
import { getAppUrl, getStripe, isStripeConfigured } from '@/lib/stripe'

export async function POST() {
  try {
    if (!isStripeConfigured()) {
      return NextResponse.json({ error: 'Stripe is not configured yet.' }, { status: 503 })
    }

    const entitlement = await getEntitlementFromCookies()
    if (!entitlement?.customerId) {
      return NextResponse.json(
        { error: 'No active Pro subscription found on this device.' },
        { status: 401 },
      )
    }

    const stripe = getStripe()
    const appUrl = getAppUrl()

    const portal = await stripe.billingPortal.sessions.create({
      customer: entitlement.customerId,
      return_url: `${appUrl}/pricing`,
      ...(process.env.STRIPE_PORTAL_CONFIGURATION_ID
        ? { configuration: process.env.STRIPE_PORTAL_CONFIGURATION_ID }
        : {}),
    })

    return NextResponse.json({ url: portal.url })
  } catch (error) {
    console.error('portal error', error)
    return NextResponse.json({ error: 'Unable to open billing portal.' }, { status: 500 })
  }
}

/** Clear local Pro cookie (does not cancel Stripe subscription). */
export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set(ENTITLEMENT_COOKIE, '', entitlementCookieOptions(0))
  return response
}
