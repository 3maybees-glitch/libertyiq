#!/usr/bin/env bash
# Verify production Stripe mode at https://libertyiq.org
# Usage: ./scripts/verify-stripe-production.sh [base_url]

set -euo pipefail

BASE_URL="${1:-https://libertyiq.org}"
BASE_URL="${BASE_URL%/}"

echo "Checking $BASE_URL …"
echo

fail=0

check_json() {
  local path="$1"
  local label="$2"
  if ! body="$(curl -fsS "$BASE_URL$path")"; then
    echo "✗ $label — request failed"
    fail=1
    return
  fi
  echo "$body"
}

echo "=== Entitlement status ==="
entitlement="$(curl -fsS "$BASE_URL/api/entitlement")"
echo "$entitlement"
mode="$(printf '%s' "$entitlement" | python3 -c "import sys,json; print(json.load(sys.stdin).get('mode',''))" 2>/dev/null || true)"
configured="$(printf '%s' "$entitlement" | python3 -c "import sys,json; print(json.load(sys.stdin).get('configured', False))" 2>/dev/null || true)"

if [[ "$configured" != "True" && "$configured" != "true" ]]; then
  echo "✗ Stripe is not configured on production"
  fail=1
else
  echo "✓ Stripe configured (mode: $mode)"
fi
echo

echo "=== Checkout session (monthly) ==="
checkout="$(curl -fsS -X POST "$BASE_URL/api/checkout" \
  -H "Content-Type: application/json" \
  -d '{"plan":"monthly"}')"
echo "$checkout"
url="$(printf '%s' "$checkout" | python3 -c "import sys,json; print(json.load(sys.stdin).get('url',''))" 2>/dev/null || true)"

if [[ "$url" == *"cs_live_"* ]]; then
  echo "✓ LIVE checkout sessions (cs_live_)"
elif [[ "$url" == *"cs_test_"* ]]; then
  echo "⚠ Still in TEST mode (cs_test_) — swap Vercel env vars to live keys and redeploy"
  fail=1
elif [[ "$url" == *"buy.stripe.com"* ]]; then
  echo "⚠ Using Payment Links fallback — set STRIPE_SECRET_KEY + price IDs for Checkout Sessions"
  fail=1
else
  echo "✗ Unexpected checkout response"
  fail=1
fi
echo

echo "=== Webhook endpoint ==="
webhook_code="$(curl -sS -o /tmp/liq-webhook.json -w "%{http_code}" -X POST "$BASE_URL/api/webhook" \
  -H "Content-Type: application/json" \
  -H "stripe-signature: t=1,v1=invalid" \
  -d '{}')"
webhook_body="$(cat /tmp/liq-webhook.json)"
echo "HTTP $webhook_code — $webhook_body"
if [[ "$webhook_body" == *"Invalid signature"* ]]; then
  echo "✓ Webhook secret configured (signature validation active)"
elif [[ "$webhook_body" == *"not configured"* ]]; then
  echo "✗ STRIPE_WEBHOOK_SECRET missing on production"
  fail=1
else
  echo "⚠ Unexpected webhook response"
fi
echo

if (( fail == 0 )); then
  echo "All production checks passed."
  exit 0
fi

echo "One or more checks failed. See docs/GO_LIVE.md section 6."
exit 1
