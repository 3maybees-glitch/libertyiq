**Going to production?** Follow [GO_LIVE.md](./GO_LIVE.md) first.

# LibertyIQ pricing / Stripe

## Tiers

| Tier | Price | Includes |
|------|-------|----------|
| **Free** | $0 | Full library, topic pages, **easy quizzes** on every topic |
| **Core** | **$5.99/mo** or **$59/yr** | Medium/hard quizzes, ranks, speaking trainer |
| **Lifetime** | **$129** once (early-bird) | Everything in Core, no renewals |

## Setup

1. Create Stripe Product **LibertyIQ Core** with Prices:
   - Monthly recurring: `$5.99`
   - Yearly recurring: `$59`
   - One-time lifetime: `$129`
2. Copy values into `.env.local` from `.env.example`
3. Enable the [Customer Portal](https://dashboard.stripe.com/settings/billing/portal)
4. For local webhooks: `stripe listen --forward-to localhost:3000/api/webhook`
5. On Vercel, set the same env vars and `NEXT_PUBLIC_APP_URL=https://libertyiq.org`

Or run `./scripts/push-stripe-env-to-vercel.sh` after `vercel login` + `vercel link`.

## Production checklist

1. Claim the Stripe sandbox (or connect your live Stripe account).
2. Add env vars in Vercel (including `STRIPE_PRICE_ID_LIFETIME`).
3. Add webhook endpoint `https://libertyiq.org/api/webhook`.
4. Redeploy.

Until secret keys are on Vercel, checkout uses **Payment Links** and unlocks on the success redirect.

## Flow

1. `/pricing` — Free / Core (monthly|yearly) / Lifetime
2. `POST /api/checkout` with `{ plan: "monthly" | "yearly" | "lifetime" }`
3. Lifetime uses Checkout `mode: "payment"`; Core uses `mode: "subscription"`
4. Success page confirms session and sets the entitlement cookie
5. Easy quizzes stay free; medium/hard + speaking trainer require Core/Lifetime
