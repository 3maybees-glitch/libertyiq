import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import {
  buildEntitlementCookie,
  entitlementCookieOptions,
  ENTITLEMENT_COOKIE,
} from '@/lib/entitlements'
import { getStripe, isStripeConfigured } from '@/lib/stripe'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: 'Stripe is not configured.' }, { status: 503 })
  }

  const stripe = getStripe()
  const signature = request.headers.get('stripe-signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!signature || !webhookSecret || webhookSecret === 'whsec_placeholder') {
    return NextResponse.json(
      { error: 'Webhook secret is not configured.' },
      { status: 400 },
    )
  }

  const payload = await request.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret)
  } catch (error) {
    console.error('webhook signature failed', error)
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.mode === 'subscription' && session.subscription && session.customer) {
          const customerId =
            typeof session.customer === 'string' ? session.customer : session.customer.id
          const subscriptionId =
            typeof session.subscription === 'string'
              ? session.subscription
              : session.subscription.id
          const subscription = await stripe.subscriptions.retrieve(subscriptionId)
          const cookie = buildEntitlementCookie(subscription, customerId)
          if (cookie) {
            const response = NextResponse.json({ received: true })
            // Cookie set is best-effort for browser-triggered webhooks; primary unlock is /pricing/success
            response.cookies.set(
              ENTITLEMENT_COOKIE,
              cookie.value,
              entitlementCookieOptions(cookie.maxAge),
            )
            return response
          }
        }
        break
      }
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        // Browser cookie refresh happens on next entitlement check / portal visit.
        // No server-side user store in this app yet.
        break
      }
      default:
        break
    }
  } catch (error) {
    console.error('webhook handler error', error)
    return NextResponse.json({ error: 'Webhook handler failed.' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
