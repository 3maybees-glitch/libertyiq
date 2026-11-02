**Going to production?** Follow [GO_LIVE.md](./GO_LIVE.md) first.

# LibertyIQ pricing / Stripe

## Passes

| Pass | Price | Includes |
|------|-------|----------|
| **Free** | $0 | Full library, easy quizzes, debate one-pagers |
| **Patriot Pass** | **$17.77** once | 365 days on this device: medium/hard quizzes, ranks, speaking trainer |
| **Topic Pack** | **$7.77** once | Permanent medium/hard quizzes for one chosen topic, on this device |

No subscription and no auto-renew. Older monthly, yearly, and Lifetime purchases still revalidate from their Stripe subscription or Checkout Session.

## Setup

1. Live account `acct_1TsIsFEyq5c8DnMY` has the two prices still sold. Copy the IDs into `.env.local` from `.env.example`:
   - `STRIPE_PRICE_ID_CORE_PASS` = `price_1UXBabEyq5c8DnMYKhGL2WXi` (Patriot Pass, $17.77)
   - `STRIPE_PRICE_ID_TOPIC_PACK` = `price_1UXBakEyq5c8DnMYd90WtKFi`
   `STRIPE_PRICE_ID_FAMILY_PASS` and `STRIPE_PRICE_ID_GROUP_PASS` are not read.
2. The Customer Portal is only for an older subscription. New passes do not open it.
3. For local webhooks: `stripe listen --forward-to localhost:3000/api/webhook`
4. On Vercel, set the same env vars and `NEXT_PUBLIC_APP_URL=https://libertyiq.org`

Or run `./scripts/push-stripe-env-to-vercel.sh` after `vercel login` + `vercel link`.

## Production checklist

1. Set the two price IDs above in Vercel Production, plus a live `STRIPE_SECRET_KEY` from the same account. Checkout Sessions do not read `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
2. Add webhook endpoint `https://libertyiq.org/api/webhook`.
3. Redeploy.

`POST /api/checkout` answers with `mode: "checkout_session"` when `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID_CORE_PASS`, and `STRIPE_PRICE_ID_TOPIC_PACK` are set, and the secret is not a test key on production. The body is `{ plan: "core" | "topic", topicId? }`. The `core` plan is the Patriot Pass. Topic Pack requires `topicId`. Checkout always uses `mode: "payment"`. There is no Payment Link fallback.

## Flow

1. `/pricing` — Free, Patriot Pass, Topic Pack
2. `POST /api/checkout` creates a one-time Checkout Session for this device (`seats: 1`).
3. The success page posts the session id and this browser's device id to `POST /api/entitlement`, which binds that one device and sets the signed cookie.
4. Patriot Pass expires 365 days after the session's `created` time. A Topic Pack does not expire. Easy quizzes stay free. The speaking trainer requires Patriot Pass.

## Webhooks

Endpoint: `POST /api/webhook`

Webhooks are **server-to-server** — they do not set browser cookies. After payment, the success page calls `POST /api/entitlement` with the Checkout Session id to set the signed `li_pro` cookie.

| Event | Behavior |
|-------|----------|
| `checkout.session.completed` | Acknowledged (entitlement set on success page) |
| `customer.subscription.updated` | Acknowledged; `GET /api/entitlement` revalidates subscription cookies |
| `customer.subscription.deleted` | Acknowledged; next `GET /api/entitlement` clears expired subscriptions |
| `charge.refunded` | Acknowledged; lifetime revalidation fails on next `GET /api/entitlement` |

`GET /api/entitlement` revalidates passes, topic packs, lifetime purchases, and older subscriptions against Stripe. Seat lists live on the Checkout Session. There is no user database.
