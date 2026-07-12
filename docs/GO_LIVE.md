# LibertyIQ — Go live checklist

Do these in order. The site is already live at https://libertyiq.org with **test-mode** checkout.

## 1. Claim your Stripe sandbox (required — expires 2026-07-19)

Open this link while logged into the Stripe account you want to keep:

https://dashboard.stripe.com/onboard_sandbox/YWNjdF8xVHNFTDhSRTlKbkkzRGo1LDE3ODQ0NDM0MDUv100tLXPG6da

After claiming you’ll get full API access (webhooks, live mode, etc.).

## 2. Add environment variables in Vercel

**Vercel → libertyiq project → Settings → Environment Variables**  
Apply to **Production** (and Preview if you want).

| Name | Value |
|------|--------|
| `NEXT_PUBLIC_APP_URL` | `https://libertyiq.org` |
| `STRIPE_PRICE_ID_MONTHLY` | `price_1TsHw2RE9JnI3Dj5OsOKnqsz` |
| `STRIPE_PRICE_ID_YEARLY` | `price_1TsHw2RE9JnI3Dj5KPTeo5jt` |
| `STRIPE_PRICE_ID_LIFETIME` | `price_1TsHw3RE9JnI3Dj5eXLfTkfW` |
| `STRIPE_PORTAL_CONFIGURATION_ID` | `bpc_1TsH9BRE9JnI3Dj5NJN1N180` |
| `NEXT_PUBLIC_STRIPE_PAYMENT_LINK_MONTHLY` | `https://buy.stripe.com/test_4gMcN766ie6A4AF0K7cZa02` |
| `NEXT_PUBLIC_STRIPE_PAYMENT_LINK_YEARLY` | `https://buy.stripe.com/test_cNibJ30LYbYs9UZ8czcZa03` |
| `NEXT_PUBLIC_STRIPE_PAYMENT_LINK_LIFETIME` | `https://buy.stripe.com/test_28E8wRfGS4w06IN9gDcZa04` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | From Stripe Dashboard → API keys (`pk_test_…` or later `pk_live_…`) |
| `STRIPE_SECRET_KEY` | From Stripe Dashboard → API keys (`rk_test_…` / `sk_test_…`, later live) |
| `ENTITLEMENT_SECRET` | Any long random string (e.g. `openssl rand -hex 32`) |
| `STRIPE_WEBHOOK_SECRET` | From step 3 (`whsec_…`) |

Then **Deployments → … → Redeploy** the latest production deployment.

Or locally after `vercel login` + `vercel link`:

```bash
./scripts/push-stripe-env-to-vercel.sh
vercel --prod --yes
```

## 3. Create the webhook (after claim)

Stripe Dashboard → Developers → Webhooks → Add endpoint:

- URL: `https://libertyiq.org/api/webhook`
- Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `charge.refunded`
- Copy signing secret → Vercel `STRIPE_WEBHOOK_SECRET` → redeploy

After deploy, canceled subscriptions lose Pro access on the next page load (`GET /api/entitlement` revalidates with Stripe).

## 4. Confirm Customer Portal

Stripe → Settings → Billing → Customer portal  
Cancel / update payment method / invoice history should be on.  
Return URL: `https://libertyiq.org/pricing`

## 5. Smoke test (test mode)

Use card `4242 4242 4242 4242`:

1. https://libertyiq.org/pricing → Core monthly / yearly / Lifetime
2. After pay → success page unlocks medium/hard + speaking trainer
3. Easy quizzes stay free without paying

## 6. Switch to live payments (when ready for real cards)

### A. Stripe Dashboard (Live mode)

Toggle **Live** in the top-right of [Stripe Dashboard](https://dashboard.stripe.com).

1. **Activate live payments** if prompted (business details, bank account).
2. **Product + prices** — create **LibertyIQ Core** in live mode:
   - Monthly recurring: **$5.99**
   - Yearly recurring: **$59**
   - One-time lifetime: **$129**
3. **API keys** — Developers → API keys → copy:
   - `pk_live_…` → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `rk_live_…` (restricted, recommended) or `sk_live_…` → `STRIPE_SECRET_KEY`
4. **Customer portal** — Settings → Billing → Customer portal (enable cancel/update). Copy live `bpc_…` if you use a custom configuration.
5. **Live webhook** — Developers → Webhooks → Add endpoint:
   - URL: `https://libertyiq.org/api/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `charge.refunded`
   - Copy signing secret → `STRIPE_WEBHOOK_SECRET` (live `whsec_…`, different from test)

### B. Update `.env.local` with live values

```bash
STRIPE_SECRET_KEY=rk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_PRICE_ID_MONTHLY=price_...    # live $5.99/mo
STRIPE_PRICE_ID_YEARLY=price_...     # live $59/yr
STRIPE_PRICE_ID_LIFETIME=price_...   # live $129 one-time
STRIPE_WEBHOOK_SECRET=whsec_...      # from LIVE webhook endpoint
STRIPE_PORTAL_CONFIGURATION_ID=bpc_...  # optional, live portal config
ENTITLEMENT_SECRET=...               # keep the same value you already set
NEXT_PUBLIC_APP_URL=https://libertyiq.org
```

Payment Links are optional when Checkout Sessions are configured (recommended). If you create live Payment Links, set `NEXT_PUBLIC_STRIPE_PAYMENT_LINK_*` to `https://buy.stripe.com/...` URLs **without** `/test_` in the path.

### C. Push to Vercel and redeploy

```bash
vercel login
vercel link    # select libertyiq
./scripts/go-live-stripe.sh
```

Or manually: paste live values in **Vercel → Settings → Environment Variables → Production**, then **Redeploy**.

### D. Verify live mode

```bash
./scripts/verify-stripe-production.sh
```

You should see `cs_live_` in checkout URLs (not `cs_test_`).

### E. First real charge

1. https://libertyiq.org/pricing → Core monthly ($5.99)
2. Pay with a real card
3. Confirm success page unlocks Pro + speaking trainer
4. Refund the test charge in Stripe Dashboard if desired

**Important:** Test-mode customers and subscriptions do not carry over to live mode. Existing `li_pro` cookies from test checkouts will stop working after you switch keys (expected).

## Current pricing (already in the app)

| Tier | Price |
|------|-------|
| Free | $0 — library + easy quizzes |
| Core | $5.99/mo or $59/yr |
| Lifetime | $129 early-bird (one-time) |

## What the agent already did

- [x] Pricing UI + checkout live on libertyiq.org  
- [x] Stripe Core/Lifetime prices + Payment Links (test mode)  
- [x] Old $9.99/$79 prices and links deactivated  
- [x] Customer portal return URL → libertyiq.org/pricing  
- [x] Secure entitlement flow (server layout gate on speaking trainer, lifetime Stripe revalidation)  
- [x] Payment Link soft-unlock only when Stripe secrets are not configured  
- [ ] Claim sandbox (needs your browser login)  
- [ ] Vercel env secrets (needs your Vercel login + Stripe keys in `.env.local`)  
- [ ] Webhook signing secret (needs claim + dashboard or `stripe listen`)  
- [ ] Live-mode keys (needs Stripe live onboarding) — see section 6 + `./scripts/go-live-stripe.sh`

Quick setup after copying keys to `.env.local`:

```powershell
./scripts/setup-stripe.ps1
```
