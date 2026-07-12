import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import {
  applyEntitlementCookie,
  buildEntitlementCookie,
  buildLifetimeEntitlementCookie,
} from '@/lib/entitlements'
import { getStripe, isStripeConfigured } from '@/lib/stripe'

export const runtime = 'nodejs'

function customerIdFrom(
  customer: string | Stripe.Customer | Stripe.DeletedCustomer | null,
): string | null {
  if (!customer) return null
  if (typeof customer === 'string') return customer
  if ('deleted' in customer && customer.deleted) return null
  return customer.id
}

function setEntitlementCookieOnResponse(
  response: NextResponse,
  cookie: { value: string; maxAge: number },
): NextResponse {
  applyEntitlementCookie(response, cookie)
  return response
}

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
        const customerId = customerIdFrom(session.customer)
        const effectiveCustomerId = customerId || `guest_${session.id}`

        if (session.mode === 'payment' && session.payment_status === 'paid') {
          const built = buildLifetimeEntitlementCookie(effectiveCustomerId, session.id)
          return setEntitlementCookieOnResponse(NextResponse.json({ received: true }), {
            value: built.value,
            maxAge: built.maxAge,
          })
        }

        if (session.mode === 'subscription' && session.subscription && customerId) {
          const subscriptionId =
            typeof session.subscription === 'string'
              ? session.subscription
              : session.subscription.id
          const subscription = await stripe.subscriptions.retrieve(subscriptionId)
          const cookie = buildEntitlementCookie(subscription, customerId)
          if (cookie) {
            return setEntitlementCookieOnResponse(NextResponse.json({ received: true }), {
              value: cookie.value,
              maxAge: cookie.maxAge,
            })
          }
        }
        break
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = customerIdFrom(subscription.customer)
        if (!customerId) break

        const cookie = buildEntitlementCookie(subscription, customerId)
        if (cookie) {
          return setEntitlementCookieOnResponse(NextResponse.json({ received: true }), {
            value: cookie.value,
            maxAge: cookie.maxAge,
          })
        }
        break
      }
      case 'customer.subscription.deleted': {
        // Cookie revocation happens on the next /api/entitlement GET (Stripe revalidation).
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
