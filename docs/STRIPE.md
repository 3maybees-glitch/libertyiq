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

Live Stripe account: `acct_1TsIsFEyq5c8DnMY`.

1. Set the live price IDs in Vercel Production (see [GO_LIVE.md](./GO_LIVE.md)):
   - `STRIPE_PRICE_ID_MONTHLY` = `price_1TsS6lEyq5c8DnMY7Tlymk7Q` ($5.99/mo)
   - `STRIPE_PRICE_ID_YEARLY` = `price_1TsS6lEyq5c8DnMYwIsf3CZj` ($59/yr)
   - `STRIPE_PRICE_ID_LIFETIME` = `price_1TsS6lEyq5c8DnMYBDMTgtIp` ($129)
2. Set a live `STRIPE_SECRET_KEY` from that same account. Checkout Sessions also need this key; they do not read `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
3. Add webhook endpoint `https://libertyiq.org/api/webhook`.
4. Redeploy.

`POST /api/checkout` answers with `mode: "checkout_session"` when `STRIPE_SECRET_KEY` and all three `STRIPE_PRICE_ID_*` variables are set, and the secret is not a test key on production. The selected plan maps to one price ID: `monthly` → `STRIPE_PRICE_ID_MONTHLY`, `yearly` → `STRIPE_PRICE_ID_YEARLY`, `lifetime` → `STRIPE_PRICE_ID_LIFETIME`.

If those are missing, checkout uses a Payment Link only when `NEXT_PUBLIC_STRIPE_PAYMENT_LINK_MONTHLY`, `NEXT_PUBLIC_STRIPE_PAYMENT_LINK_YEARLY`, or `NEXT_PUBLIC_STRIPE_PAYMENT_LINK_LIFETIME` is a live `https://buy.stripe.com/…` URL. Links that contain `buy.stripe.com/test_` are ignored. With neither a Checkout Session nor a live Payment Link, the API returns 503 and `/pricing` shows checkout unavailable. There is no test-link fallback.

## Flow

1. `/pricing` — Free / Core (monthly|yearly) / Lifetime
2. `POST /api/checkout` with `{ plan: "monthly" | "yearly" | "lifetime" }`
3. Lifetime uses Checkout `mode: "payment"`; Core uses `mode: "subscription"`
4. Success page confirms session and sets the entitlement cookie
5. Easy quizzes stay free; medium/hard + speaking trainer require Core/Lifetime

## Webhooks

Endpoint: `POST /api/webhook`

Webhooks are **server-to-server** — they do not set browser cookies. After payment, the success page calls `POST /api/entitlement` with the Checkout Session id to set the signed `li_pro` cookie.

| Event | Behavior |
|-------|----------|
| `checkout.session.completed` | Acknowledged (entitlement set on success page) |
| `customer.subscription.updated` | Acknowledged; `GET /api/entitlement` revalidates subscription cookies |
| `customer.subscription.deleted` | Acknowledged; next `GET /api/entitlement` clears expired subscriptions |
| `charge.refunded` | Acknowledged; lifetime revalidation fails on next `GET /api/entitlement` |

`GET /api/entitlement` revalidates **subscription and lifetime** cookies against Stripe (no database required).
