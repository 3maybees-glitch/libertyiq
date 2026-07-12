#!/usr/bin/env bash
# Print Vercel env vars from .env.local for manual dashboard entry.
# Usage: ./scripts/print-vercel-env-checklist.sh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="${1:-$ROOT/.env.local}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing $ENV_FILE"
  exit 1
fi

# shellcheck disable=SC1090
set -a
# shellcheck source=/dev/null
source "$ENV_FILE"
set +a

missing=()
for key in STRIPE_SECRET_KEY NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ENTITLEMENT_SECRET; do
  if [[ -z "${!key:-}" ]]; then
    missing+=("$key")
  fi
done

if ((${#missing[@]} > 0)); then
  echo "Still missing in $ENV_FILE:"
  printf '  - %s\n' "${missing[@]}"
  echo
  echo "Get Stripe keys: https://dashboard.stripe.com/test/apikeys"
  exit 1
fi

echo "Paste these in Vercel → libertyiq → Settings → Environment Variables → Production"
echo "(check Preview too if you want test checkout on preview URLs)"
echo
printf '%-42s %s\n' "NAME" "VALUE"
printf '%-42s %s\n' "----" "-----"

vars=(
  NEXT_PUBLIC_APP_URL
  STRIPE_SECRET_KEY
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  STRIPE_PRICE_ID_MONTHLY
  STRIPE_PRICE_ID_YEARLY
  STRIPE_PRICE_ID_LIFETIME
  STRIPE_PORTAL_CONFIGURATION_ID
  ENTITLEMENT_SECRET
  NEXT_PUBLIC_STRIPE_PAYMENT_LINK_MONTHLY
  NEXT_PUBLIC_STRIPE_PAYMENT_LINK_YEARLY
  NEXT_PUBLIC_STRIPE_PAYMENT_LINK_LIFETIME
)

for name in "${vars[@]}"; do
  printf '%-42s %s\n' "$name" "${!name}"
done

if [[ -n "${STRIPE_WEBHOOK_SECRET:-}" && "$STRIPE_WEBHOOK_SECRET" != "whsec_placeholder" ]]; then
  printf '%-42s %s\n' "STRIPE_WEBHOOK_SECRET" "$STRIPE_WEBHOOK_SECRET"
else
  echo
  echo "STRIPE_WEBHOOK_SECRET — add after step 3 (webhook setup)"
fi

echo
echo "Then: Deployments → Redeploy latest production build"
echo "Or run: vercel login && vercel link && ./scripts/push-stripe-env-to-vercel.sh && vercel --prod --yes"
