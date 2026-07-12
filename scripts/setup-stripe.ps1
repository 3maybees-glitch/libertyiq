# Stripe webhook + Vercel env setup (Windows)
# Run from repo root after filling .env.local (copy from .env.example + GO_LIVE.md values).

param(
  [string]$EnvFile = ".env.local"
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location (Join-Path $Root "..")

if (-not (Test-Path $EnvFile)) {
  Write-Host "Missing $EnvFile — copy .env.example and add Stripe keys from docs/GO_LIVE.md"
  exit 1
}

Get-Content $EnvFile | ForEach-Object {
  if ($_ -match '^\s*([^#=]+)=(.*)$') {
    $name = $matches[1].Trim()
    $value = $matches[2].Trim().Trim('"')
    Set-Item -Path "env:$name" -Value $value
  }
}

$required = @(
  'STRIPE_SECRET_KEY',
  'STRIPE_PRICE_ID_MONTHLY',
  'STRIPE_PRICE_ID_YEARLY',
  'STRIPE_PRICE_ID_LIFETIME',
  'ENTITLEMENT_SECRET',
  'NEXT_PUBLIC_APP_URL'
)

foreach ($key in $required) {
  if (-not (Get-Item "env:$key" -ErrorAction SilentlyContinue)?.Value) {
    Write-Host "Missing $key in $EnvFile"
    exit 1
  }
}

Write-Host "=== Stripe webhook (test mode) ==="
Write-Host "Run in a separate terminal:"
Write-Host "  stripe listen --forward-to localhost:3000/api/webhook"
Write-Host "Copy the whsec_... secret into $EnvFile as STRIPE_WEBHOOK_SECRET"
Write-Host ""
Write-Host "Production endpoint: https://libertyiq.org/api/webhook"
Write-Host "Events: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted, charge.refunded"
Write-Host ""

Write-Host "=== Push env to Vercel ==="
Write-Host "  npm i -g vercel"
Write-Host "  vercel login"
Write-Host "  vercel link   # select libertyiq"
Write-Host "  bash ./scripts/push-stripe-env-to-vercel.sh"
Write-Host "  vercel --prod --yes"
Write-Host ""
Write-Host "Done (manual steps above)."
