import { NextResponse } from 'next/server'
import { z } from 'zod'
import { PAID_PLANS, STRIPE_PAYMENT_LINKS, type PaidPlan } from '@/lib/pricing'
import { getAppUrl, getPriceId, getStripe, isStripeConfigured } from '@/lib/stripe'

const bodySchema = z.object({
  plan: z.enum(['monthly', 'yearly', 'lifetime']).default('yearly'),
})

export async function POST(request: Request) {
  try {
    const json = await request.json().catch(() => ({}))
    const parsed = bodySchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid plan selection.' }, { status: 400 })
    }

    const plan = parsed.data.plan as PaidPlan
    const planMeta = PAID_PLANS[plan]

    if (isStripeConfigured()) {
      const stripe = getStripe()
      const appUrl = getAppUrl()
      const priceId = getPriceId(plan)
      const mode = planMeta.mode

      const session = await stripe.checkout.sessions.create({
        mode,
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${appUrl}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/pricing?canceled=1`,
        allow_promotion_codes: true,
        billing_address_collection: 'auto',
        metadata: {
          app: 'libertyiq',
          plan,
          tier: planMeta.tier,
        },
        ...(mode === 'subscription'
          ? {
              subscription_data: {
                metadata: {
                  app: 'libertyiq',
                  plan,
                  tier: planMeta.tier,
                },
              },
            }
          : {
              payment_intent_data: {
                metadata: {
                  app: 'libertyiq',
                  plan,
                  tier: planMeta.tier,
                },
              },
            }),
      })

      if (!session.url) {
        return NextResponse.json({ error: 'Unable to start checkout.' }, { status: 500 })
      }

      return NextResponse.json({ url: session.url, mode: 'checkout_session', plan })
    }

    const paymentLink = STRIPE_PAYMENT_LINKS[plan]
    if (!paymentLink) {
      return NextResponse.json(
        { error: 'Stripe is not configured yet. Add your Stripe keys to continue.' },
        { status: 503 },
      )
    }

    return NextResponse.json({ url: paymentLink, mode: 'payment_link', plan })
  } catch (error) {
    console.error('checkout error', error)
    return NextResponse.json({ error: 'Checkout failed. Please try again.' }, { status: 500 })
  }
}
