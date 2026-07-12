import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { getStripe, isStripeConfigured } from '@/lib/stripe'

export const runtime = 'nodejs'

/**
 * Stripe webhooks are server-to-server — they cannot set browser cookies.
 * Entitlement cookies are issued on the success page via POST /api/entitlement.
 * This handler keeps subscription state in sync for logging and future extensions;
 * GET /api/entitlement revalidates subscriptions (and lifetime purchases) on each load.
 */
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
      case 'checkout.session.completed':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
      case 'charge.refunded':
        // Acknowledged — entitlement is confirmed/revoked via POST/GET /api/entitlement.
        break
      default:
        break
    }
  } catch (error) {
    console.error('webhook handler error', error)
    return NextResponse.json({ error: 'Webhook handler failed.' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
