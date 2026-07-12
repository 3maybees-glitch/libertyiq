import { NextResponse } from 'next/server'
import { z } from 'zod'
import { STRIPE_PAYMENT_LINKS } from '@/lib/pricing'
import { getAppUrl, getPriceId, getStripe, isStripeConfigured } from '@/lib/stripe'

const bodySchema = z.object({
  plan: z.enum(['monthly', 'yearly']).default('monthly'),
})

export async function POST(request: Request) {
  try {
    const json = await request.json().catch(() => ({}))
    const parsed = bodySchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid plan selection.' }, { status: 400 })
    }

    const { plan } = parsed.data

    // Prefer server-created Checkout Sessions when Stripe keys are configured.
    if (isStripeConfigured()) {
      const stripe = getStripe()
      const appUrl = getAppUrl()
      const priceId = getPriceId(plan)

      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${appUrl}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/pricing?canceled=1`,
        allow_promotion_codes: true,
        billing_address_collection: 'auto',
        metadata: {
          app: 'libertyiq',
          plan,
        },
        subscription_data: {
          metadata: {
            app: 'libertyiq',
            plan,
          },
        },
      })

      if (!session.url) {
        return NextResponse.json({ error: 'Unable to start checkout.' }, { status: 500 })
      }

      return NextResponse.json({ url: session.url, mode: 'checkout_session' })
    }

    // Fallback: public Payment Links (no secret key required on the server).
    const paymentLink = STRIPE_PAYMENT_LINKS[plan]
    if (!paymentLink) {
      return NextResponse.json(
        { error: 'Stripe is not configured yet. Add your Stripe keys to continue.' },
        { status: 503 },
      )
    }

    return NextResponse.json({ url: paymentLink, mode: 'payment_link' })
  } catch (error) {
    console.error('checkout error', error)
    return NextResponse.json({ error: 'Checkout failed. Please try again.' }, { status: 500 })
  }
}
