import { NextResponse } from 'next/server'
import { z } from 'zod'
import {
  PassAccessError,
  applyEntitlementCookie,
  getEntitlementFromCookies,
  isLegacySubscription,
  redeemAccessCode,
} from '@/lib/entitlements'
import { hasStripeSecret } from '@/lib/stripe'

const bodySchema = z.object({
  code: z.string().min(4).max(120),
  deviceId: z.string().min(8).max(32),
})

export async function POST(request: Request) {
  try {
    if (!hasStripeSecret()) {
      return NextResponse.json({ error: 'Stripe is not configured yet.' }, { status: 503 })
    }

    const json = await request.json().catch(() => ({}))
    const parsed = bodySchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Enter the access code from the pass.' }, { status: 400 })
    }

    const existing = await getEntitlementFromCookies()
    const result = await redeemAccessCode({
      code: parsed.data.code,
      deviceId: parsed.data.deviceId,
      existing,
    })

    const response = NextResponse.json({
      isPro: result.isPro,
      topics: result.topics,
      plan: result.plan,
      status: result.payload.status,
      accessCode: result.accessCode,
      seats: result.seats,
      seatsUsed: result.seatsUsed,
      accessExpiresAt: result.accessExpiresAt,
      legacySubscription: result.legacySubscription || isLegacySubscription(result.payload),
    })
    applyEntitlementCookie(response, result.cookie)
    return response
  } catch (error) {
    if (error instanceof PassAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    console.error('redeem error', error)
    return NextResponse.json({ error: 'Unable to redeem that code.' }, { status: 500 })
  }
}
