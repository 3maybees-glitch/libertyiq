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
- Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
- Copy signing secret → Vercel `STRIPE_WEBHOOK_SECRET` → redeploy

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

1. Stripe Dashboard → toggle **Live mode**
2. Recreate product/prices ($5.99, $59, $129) + Payment Links in live mode  
   (or activate live prices on the claimed account)
3. Replace Vercel env vars with `pk_live_…`, `rk_live_…` / `sk_live_…`, live price IDs & Payment Links
4. Add a **live** webhook to the same `/api/webhook` URL
5. Redeploy and buy once with a real card for $5.99 (then refund if testing)

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
- [ ] Claim sandbox (needs your browser login)  
- [ ] Vercel env secrets (needs your Vercel login)  
- [ ] Webhook signing secret (needs claim + dashboard)  
- [ ] Live-mode keys (needs Stripe live onboarding)
