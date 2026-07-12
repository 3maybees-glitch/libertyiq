#!/usr/bin/env bash
# Push Stripe env vars to the linked Vercel project (production + preview).
# Usage: ./scripts/push-stripe-env-to-vercel.sh
# Requires: vercel CLI logged in (`vercel login`) and linked project (`vercel link`).

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="${1:-$ROOT/.env.local}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing $ENV_FILE — copy .env.example and fill in Stripe keys first."
  exit 1
fi

if ! command -v vercel >/dev/null 2>&1; then
  echo "Install Vercel CLI: npm i -g vercel"
  exit 1
fi

# shellcheck disable=SC1090
set -a
# shellcheck source=/dev/null
source "$ENV_FILE"
set +a

REQUIRED=(
  STRIPE_SECRET_KEY
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  STRIPE_PRICE_ID_MONTHLY
  STRIPE_PRICE_ID_YEARLY
  ENTITLEMENT_SECRET
  NEXT_PUBLIC_APP_URL
)

for key in "${REQUIRED[@]}"; do
  if [[ -z "${!key:-}" ]]; then
    echo "Missing $key in $ENV_FILE"
    exit 1
  fi
done

# Production site URL
export NEXT_PUBLIC_APP_URL="${NEXT_PUBLIC_APP_URL:-https://libertyiq.org}"

add_env() {
  local name="$1"
  local value="$2"
  local environment="$3"
  echo "→ $name ($environment)"
  # Remove existing value if present (ignore errors)
  printf '%s\n' "$value" | vercel env rm "$name" "$environment" --yes >/dev/null 2>&1 || true
  printf '%s\n' "$value" | vercel env add "$name" "$environment" --yes >/dev/null
}

ENVIRONMENTS=(production preview development)

for env_name in "${ENVIRONMENTS[@]}"; do
  echo "=== $env_name ==="
  add_env STRIPE_SECRET_KEY "$STRIPE_SECRET_KEY" "$env_name"
  add_env NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY "$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" "$env_name"
  add_env STRIPE_PRICE_ID_MONTHLY "$STRIPE_PRICE_ID_MONTHLY" "$env_name"
  add_env STRIPE_PRICE_ID_YEARLY "$STRIPE_PRICE_ID_YEARLY" "$env_name"
  add_env ENTITLEMENT_SECRET "$ENTITLEMENT_SECRET" "$env_name"
  add_env NEXT_PUBLIC_APP_URL "$NEXT_PUBLIC_APP_URL" "$env_name"
  if [[ -n "${STRIPE_PORTAL_CONFIGURATION_ID:-}" ]]; then
    add_env STRIPE_PORTAL_CONFIGURATION_ID "$STRIPE_PORTAL_CONFIGURATION_ID" "$env_name"
  fi
  if [[ -n "${STRIPE_WEBHOOK_SECRET:-}" && "$STRIPE_WEBHOOK_SECRET" != "whsec_placeholder" ]]; then
    add_env STRIPE_WEBHOOK_SECRET "$STRIPE_WEBHOOK_SECRET" "$env_name"
  fi
  if [[ -n "${NEXT_PUBLIC_STRIPE_PAYMENT_LINK_MONTHLY:-}" ]]; then
    add_env NEXT_PUBLIC_STRIPE_PAYMENT_LINK_MONTHLY "$NEXT_PUBLIC_STRIPE_PAYMENT_LINK_MONTHLY" "$env_name"
  fi
  if [[ -n "${NEXT_PUBLIC_STRIPE_PAYMENT_LINK_YEARLY:-}" ]]; then
    add_env NEXT_PUBLIC_STRIPE_PAYMENT_LINK_YEARLY "$NEXT_PUBLIC_STRIPE_PAYMENT_LINK_YEARLY" "$env_name"
  fi
done

echo "Done. Redeploy production: vercel --prod --yes"
