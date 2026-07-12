# LibertyIQ Pro / Stripe

LibertyIQ uses a freemium model:

| Tier | Price | Includes |
|------|-------|----------|
| Free | $0 | Full argument library (11 topics), evidence, defense tips |
| Pro | $9.99/mo or $79/yr | Quizzes, ranks, speaking trainer |

## Setup

1. Create a Stripe account (or claim the sandbox created during development).
2. Create a Product **LibertyIQ Pro** with two recurring Prices:
   - Monthly: `$9.99` USD
   - Yearly: `$79` USD
3. Copy values into `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

4. Enable the [Customer Portal](https://dashboard.stripe.com/settings/billing/portal) (cancel, payment method update, invoices).
5. For local webhooks:

```bash
stripe listen --forward-to localhost:3000/api/webhook
```

Paste the printed `whsec_...` into `STRIPE_WEBHOOK_SECRET`.

6. On Vercel, add the same env vars (use live keys for production) and set
   `NEXT_PUBLIC_APP_URL=https://libertyiq.org`.

## Flow

1. User opens `/pricing` and chooses Monthly or Yearly.
2. `POST /api/checkout` creates a Stripe Checkout Session (`mode: subscription`).
3. After payment, Stripe redirects to `/pricing/success?session_id=...`.
4. The success page calls `POST /api/entitlement` which verifies the session and
   sets an httpOnly signed `li_pro` cookie.
5. `/libertyiq`, `/quiz/*`, and `/speaking-trainer` are gated behind Pro.
6. `POST /api/portal` opens the Stripe Customer Portal to manage/cancel.

Progress remains in `localStorage`. Pro access is device/browser cookie–based until
a full auth + account system is added.
