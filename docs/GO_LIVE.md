# LibertyIQ — Go live checklist

The site is live at https://libertyiq.org. Paid checkout uses Stripe Checkout Sessions on the live account `acct_1TsIsFEyq5c8DnMY`.

Do not send a visitor to test mode. The app ignores `https://buy.stripe.com/test_…` Payment Links, including any that used to be hardcoded as fallbacks. On production it also refuses a test secret key (`sk_test_…` / `rk_test_…`) and a Checkout Session with `livemode: false`. If neither a live Checkout Session nor a live Payment Link is configured, `/pricing` shows **Checkout is unavailable** and `POST /api/checkout` returns 503.

## 1. Add environment variables in Vercel

**Vercel → libertyiq project → Settings → Environment Variables**  
Apply to **Production**. Use live keys from account `acct_1TsIsFEyq5c8DnMY` (Dashboard → API keys, with **Live** mode on). Preview can keep test keys if you want; production must not.

`POST /api/checkout` returns `mode: "checkout_session"` only when all four of these are set: `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID_MONTHLY`, `STRIPE_PRICE_ID_YEARLY`, and `STRIPE_PRICE_ID_LIFETIME`. The price ID for the selected plan is read from the matching variable:

| Plan | Env var | Live price ID |
|------|---------|----------------|
| Core monthly ($5.99/mo) | `STRIPE_PRICE_ID_MONTHLY` | `price_1TsS6lEyq5c8DnMY7Tlymk7Q` |
| Core yearly ($59/yr) | `STRIPE_PRICE_ID_YEARLY` | `price_1TsS6lEyq5c8DnMYwIsf3CZj` |
| Lifetime ($129 once) | `STRIPE_PRICE_ID_LIFETIME` | `price_1TsS6lEyq5c8DnMYBDMTgtIp` |

| Name | Value |
|------|--------|
| `NEXT_PUBLIC_APP_URL` | `https://libertyiq.org` |
| `STRIPE_SECRET_KEY` | Live secret (`sk_live_…` or restricted `rk_live_…`) from `acct_1TsIsFEyq5c8DnMY` |
| `STRIPE_PRICE_ID_MONTHLY` | `price_1TsS6lEyq5c8DnMY7Tlymk7Q` |
| `STRIPE_PRICE_ID_YEARLY` | `price_1TsS6lEyq5c8DnMYwIsf3CZj` |
| `STRIPE_PRICE_ID_LIFETIME` | `price_1TsS6lEyq5c8DnMYBDMTgtIp` |
| `ENTITLEMENT_SECRET` | Any long random string (e.g. `openssl rand -hex 32`) |
| `STRIPE_WEBHOOK_SECRET` | Live webhook signing secret from step 2 (`whsec_…`) |
| `STRIPE_PORTAL_CONFIGURATION_ID` | Customer Portal configuration from this **live** account. Do not reuse `bpc_1TsH9BRE9JnI3Dj5NJN1N180` — that ID is from a different Stripe account. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Optional. Checkout Sessions do not read it. |

Leave the Payment Link variables unset unless you have **live** links (`https://buy.stripe.com/…` with no `test_`). Test links are ignored.

| Name | Value |
|------|--------|
| `NEXT_PUBLIC_STRIPE_PAYMENT_LINK_MONTHLY` | Live Payment Link, or unset |
| `NEXT_PUBLIC_STRIPE_PAYMENT_LINK_YEARLY` | Live Payment Link, or unset |
| `NEXT_PUBLIC_STRIPE_PAYMENT_LINK_LIFETIME` | Live Payment Link, or unset |

Price IDs from the old test account (`price_1TsHw2RE9JnI3Dj5OsOKnqsz`, `price_1TsHw2RE9JnI3Dj5KPTeo5jt`, `price_1TsHw3RE9JnI3Dj5eXLfTkfW`) must not be used on production.

Then **Deployments → … → Redeploy** the latest production deployment.

Or locally after `vercel login` + `vercel link`:

```bash
./scripts/push-stripe-env-to-vercel.sh
vercel --prod --yes
```

## 2. Create the live webhook

Stripe Dashboard → Developers → Webhooks → Add endpoint:

- URL: `https://libertyiq.org/api/webhook`
- Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `charge.refunded`
- Copy signing secret → Vercel `STRIPE_WEBHOOK_SECRET` → redeploy

After deploy, canceled subscriptions lose Pro access on the next page load (`GET /api/entitlement` revalidates with Stripe).

## 3. Confirm Customer Portal

Stripe → Settings → Billing → Customer portal  
Cancel / update payment method / invoice history should be on.  
Return URL: `https://libertyiq.org/pricing`

## 4. Smoke test (live mode)

`4242 4242 4242 4242` only works in Stripe test mode. Do not use it against https://libertyiq.org.

1. https://libertyiq.org/pricing → Core monthly / yearly / Lifetime
2. Confirm the browser lands on a live Checkout page (the session id starts with `cs_live_`, not `cs_test_`)
3. After a real payment → success page unlocks medium/hard + speaking trainer
4. Easy quizzes stay free without paying

If the paid buttons are disabled and the page says checkout is unavailable, production is missing the live secret or one of the three `STRIPE_PRICE_ID_*` variables above (or the secret is still a test key).

## Current pricing (already in the app)

| Tier | Price |
|------|-------|
| Free | $0 — library + easy quizzes |
| Core | $5.99/mo or $59/yr |
| Lifetime | $129 early-bird (one-time) |

## What the agent already did

- [x] Pricing UI + checkout live on libertyiq.org  
- [x] Stripe Core/Lifetime prices on live account `acct_1TsIsFEyq5c8DnMY`  
- [x] Old $9.99/$79 prices and links deactivated  
- [x] Test-mode Payment Link fallbacks removed — visitors are not sent to `buy.stripe.com/test_…`  
- [x] Customer portal return URL → libertyiq.org/pricing  
- [x] Secure entitlement flow (server layout gate on speaking trainer, lifetime Stripe revalidation)  
- [x] Payment Link soft-unlock only when Stripe secrets are not configured and the link is not a test link  
- [ ] Vercel production env uses the live price IDs in this doc, plus a live `STRIPE_SECRET_KEY` and live `STRIPE_WEBHOOK_SECRET`  
- [ ] Live Customer Portal configuration ID (do not reuse the old account’s `bpc_1TsH9BRE9JnI3Dj5NJN1N180`)

Quick setup after copying keys to `.env.local`:

```powershell
./scripts/setup-stripe.ps1
```
