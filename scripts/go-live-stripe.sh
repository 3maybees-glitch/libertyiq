#!/usr/bin/env bash
# Push LIVE Stripe env vars to Vercel and redeploy production.
# Prereq: fill .env.local with pk_live_/rk_live_ keys, live price IDs, live webhook secret.
# Usage: ./scripts/go-live-stripe.sh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="${1:-$ROOT/.env.local}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing $ENV_FILE"
  echo "Copy .env.example, then paste your LIVE Stripe values from the Dashboard."
  exit 1
fi

# shellcheck disable=SC1090
set -a
# shellcheck source=/dev/null
source "$ENV_FILE"
set +a

if [[ "${STRIPE_SECRET_KEY:-}" != *"_live_"* ]]; then
  echo "STRIPE_SECRET_KEY must be a live key (rk_live_… or sk_live_…)."
  echo "You are still on test mode. Toggle Live in Stripe Dashboard and copy live keys."
  exit 1
fi

if [[ "${NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:-}" != *"_live_"* ]]; then
  echo "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY must be pk_live_…"
  exit 1
fi

for key in STRIPE_PRICE_ID_MONTHLY STRIPE_PRICE_ID_YEARLY STRIPE_PRICE_ID_LIFETIME ENTITLEMENT_SECRET; do
  if [[ -z "${!key:-}" ]]; then
    echo "Missing $key in $ENV_FILE"
    exit 1
  fi
done

if [[ -z "${STRIPE_WEBHOOK_SECRET:-}" || "$STRIPE_WEBHOOK_SECRET" == "whsec_placeholder" ]]; then
  echo "Missing live STRIPE_WEBHOOK_SECRET."
  echo "Create a LIVE webhook at https://libertyiq.org/api/webhook in Stripe Dashboard first."
  exit 1
fi

export NEXT_PUBLIC_APP_URL="${NEXT_PUBLIC_APP_URL:-https://libertyiq.org}"

echo "=== Pushing LIVE Stripe env to Vercel ==="
"$ROOT/scripts/push-stripe-env-to-vercel.sh" "$ENV_FILE"

if command -v vercel >/dev/null 2>&1; then
  echo
  echo "=== Redeploying production ==="
  vercel --prod --yes
else
  echo
  echo "Vercel CLI not found. Redeploy manually: Vercel → Deployments → Redeploy"
fi

echo
echo "=== Verifying production ==="
sleep 5
"$ROOT/scripts/verify-stripe-production.sh" "${NEXT_PUBLIC_APP_URL}"
