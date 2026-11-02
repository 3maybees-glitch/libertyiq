# LibertyIQ — Go live checklist

The site is live at https://libertyiq.org. Paid checkout uses Stripe Checkout Sessions on the live account `acct_1TsIsFEyq5c8DnMY`.

Do not send a visitor to test mode. The app ignores `https://buy.stripe.com/test_…` Payment Links, including any that used to be hardcoded as fallbacks. On production it also refuses a test secret key (`sk_test_…` / `rk_test_…`) and a Checkout Session with `livemode: false`. If neither a live Checkout Session nor a live Payment Link is configured, `/pricing` shows **Checkout is unavailable** and `POST /api/checkout` returns 503.

## 1. Add environment variables in Vercel

**Vercel → libertyiq project → Settings → Environment Variables**  
Apply to **Production**. Use live keys from account `acct_1TsIsFEyq5c8DnMY` (Dashboard → API keys, with **Live** mode on). Preview can keep test keys if you want; production must not.

`POST /api/checkout` returns `mode: "checkout_session"` only when `STRIPE_SECRET_KEY` and all four pass price IDs are set. Every new purchase is Checkout `mode: "payment"` (one charge, no subscription). The price ID for the selected pass is read from the matching variable:

| Pass | Env var | Live price ID |
|------|---------|----------------|
| Core Pass ($17.77, 365 days, 1 seat) | `STRIPE_PRICE_ID_CORE_PASS` | `price_1UXBabEyq5c8DnMYKhGL2WXi` |
| Family Pass ($47.77, 365 days, 6 seats) | `STRIPE_PRICE_ID_FAMILY_PASS` | `price_1UXBaeEyq5c8DnMYGWsqIipC` |
| Group Pass ($147, 365 days, 30 seats) | `STRIPE_PRICE_ID_GROUP_PASS` | `price_1UXBajEyq5c8DnMYjm3QFANQ` |
| Topic Pack ($7.77, one topic, permanent) | `STRIPE_PRICE_ID_TOPIC_PACK` | `price_1UXBakEyq5c8DnMYd90WtKFi` |

| Name | Value |
|------|--------|
| `NEXT_PUBLIC_APP_URL` | `https://libertyiq.org` |
| `STRIPE_SECRET_KEY` | Live secret (`sk_live_…` or restricted `rk_live_…`) from `acct_1TsIsFEyq5c8DnMY` |
| `STRIPE_PRICE_ID_CORE_PASS` | `price_1UXBabEyq5c8DnMYKhGL2WXi` |
| `STRIPE_PRICE_ID_FAMILY_PASS` | `price_1UXBaeEyq5c8DnMYGWsqIipC` |
| `STRIPE_PRICE_ID_GROUP_PASS` | `price_1UXBajEyq5c8DnMYjm3QFANQ` |
| `STRIPE_PRICE_ID_TOPIC_PACK` | `price_1UXBakEyq5c8DnMYd90WtKFi` |
| `ENTITLEMENT_SECRET` | Any long random string (e.g. `openssl rand -hex 32`) |
| `STRIPE_WEBHOOK_SECRET` | Live webhook signing secret from step 2 (`whsec_…`) |
| `STRIPE_PORTAL_CONFIGURATION_ID` | Customer Portal configuration from this **live** account. Do not reuse `bpc_1TsH9BRE9JnI3Dj5NJN1N180` — that ID is from a different Stripe account. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Optional. Checkout Sessions do not read it. |

Checkout does not use Payment Links. Leave `NEXT_PUBLIC_STRIPE_PAYMENT_LINK_*` unset. The old subscription price IDs (`STRIPE_PRICE_ID_MONTHLY`, `STRIPE_PRICE_ID_YEARLY`, `STRIPE_PRICE_ID_LIFETIME`, including `price_1TsS6l…` and the earlier `price_1TsHw…` test-account IDs) are not read. People who already paid those plans keep access through the signed cookie and Stripe revalidation. The billing portal remains only for an older subscription.

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

1. https://libertyiq.org/pricing → Core, Family, Group, or a Topic Pack (pick a topic first)
2. Confirm the browser lands on a live Checkout page (the session id starts with `cs_live_`, not `cs_test_`) and the charge is one-time
3. After payment, the success page names the pass. Family and Group show an access code. A second browser redeems it at `/redeem` until the seat count is full.
4. Easy quizzes and one-pagers stay free without paying

If the buy buttons are disabled and the page says checkout is unavailable, production is missing the live secret or one of the four `STRIPE_PRICE_ID_*_PASS` / `STRIPE_PRICE_ID_TOPIC_PACK` variables above (or the secret is still a test key).

## Current pricing (already in the app)

| Pass | Price | What it opens |
|------|-------|----------------|
| Free | $0 | Library, easy quizzes, one-pagers |
| Core Pass | $17.77 once | 365 days, 1 student: medium/hard, ranks, speaking trainer |
| Family Pass | $47.77 once | 365 days, up to 6 students, one access code |
| Group Pass | $147 once | 365 days, up to 30 students, one access code |
| Topic Pack | $7.77 once | One topic, permanent, this device |

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
