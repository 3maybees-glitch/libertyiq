import { NextResponse } from 'next/server'
import { z } from 'zod'
import {
  CHECKOUT_UNAVAILABLE_MESSAGE,
  PAID_PLANS,
  isTopicId,
  type PaidPlan,
} from '@/lib/pricing'
import {
  getAppUrl,
  getPriceId,
  getStripe,
  isCheckoutSessionAllowed,
  isProductionDeployment,
  isTestModeCheckoutUrl,
} from '@/lib/stripe'

const bodySchema = z.object({
  plan: z.enum(['core', 'topic']),
  topicId: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const json = await request.json().catch(() => ({}))
    const parsed = bodySchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Choose a pass to continue.' }, { status: 400 })
    }

    const plan = parsed.data.plan as PaidPlan
    const planMeta = PAID_PLANS[plan]
    const topicId = parsed.data.topicId?.trim()

    if (plan === 'topic' && (!topicId || !isTopicId(topicId))) {
      return NextResponse.json({ error: 'Choose a topic for this pack.' }, { status: 400 })
    }

    if (!isCheckoutSessionAllowed()) {
      return NextResponse.json({ error: CHECKOUT_UNAVAILABLE_MESSAGE }, { status: 503 })
    }

    const stripe = getStripe()
    const appUrl = getAppUrl()
    const priceId = getPriceId(plan)

    const metadata: Record<string, string> = {
      app: 'libertyiq',
      plan,
      tier: planMeta.label,
      seats: '1',
      scope: planMeta.scope,
      ...(planMeta.durationDays ? { duration_days: String(planMeta.durationDays) } : {}),
      ...(topicId ? { topic_id: topicId } : {}),
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pricing?canceled=1`,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      customer_creation: 'always',
      metadata,
      payment_intent_data: { metadata },
    })

    if (!session.url) {
      return NextResponse.json({ error: 'Unable to start checkout.' }, { status: 500 })
    }

    if (
      isProductionDeployment() &&
      (session.livemode === false || isTestModeCheckoutUrl(session.url))
    ) {
      return NextResponse.json({ error: CHECKOUT_UNAVAILABLE_MESSAGE }, { status: 503 })
    }

    return NextResponse.json({ url: session.url, mode: 'checkout_session', plan })
  } catch (error) {
    console.error('checkout error', error)
    return NextResponse.json({ error: 'Checkout failed. Please try again.' }, { status: 500 })
  }
}
