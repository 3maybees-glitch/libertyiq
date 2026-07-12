#!/usr/bin/env node
/**
 * Create LibertyIQ live Stripe resources (product, prices, webhook).
 * Requires STRIPE_SECRET_KEY=rk_live_... or sk_live_... in env or .env.local
 *
 * Usage: node scripts/create-stripe-live-resources.mjs
 */

import { readFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import Stripe from 'stripe'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

function loadEnvFile(path) {
  if (!existsSync(path)) return
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const m = line.match(/^\s*([^#=]+)=(.*)$/)
    if (!m) continue
    const key = m[1].trim()
    const value = m[2].trim().replace(/^["']|["']$/g, '')
    if (!process.env[key]) process.env[key] = value
  }
}

loadEnvFile(resolve(root, '.env.local'))
loadEnvFile(resolve(root, '.env'))

const key = process.env.STRIPE_SECRET_KEY
if (!key) {
  console.error('Missing STRIPE_SECRET_KEY. Add rk_live_... to .env.local and retry.')
  process.exit(1)
}
if (!key.includes('_live_')) {
  console.error('STRIPE_SECRET_KEY must be a LIVE key (rk_live_... or sk_live_...).')
  process.exit(1)
}

const stripe = new Stripe(key, { apiVersion: '2026-06-24.dahlia' })
const WEBHOOK_URL = process.env.WEBHOOK_URL || 'https://libertyiq.org/api/webhook'
const PRODUCT_NAME = 'LibertyIQ Core'

const WEBHOOK_EVENTS = [
  'checkout.session.completed',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'charge.refunded',
]

async function findOrCreateProduct() {
  const existing = await stripe.products.search({
    query: `name:'${PRODUCT_NAME}' AND active:'true'`,
    limit: 1,
  })
  if (existing.data[0]) {
    console.log(`Product exists: ${existing.data[0].id}`)
    return existing.data[0]
  }

  const product = await stripe.products.create({
    name: PRODUCT_NAME,
    description: 'Medium/hard quizzes, ranks, and public speaking trainer for LibertyIQ.',
    metadata: { app: 'libertyiq', tier: 'core' },
  })
  console.log(`Created product: ${product.id}`)
  return product
}

async function findOrCreatePrice(productId, spec) {
  const prices = await stripe.prices.list({ product: productId, active: true, limit: 100 })
  const match = prices.data.find((p) => {
    if (spec.type === 'one_time') {
      return !p.recurring && p.unit_amount === spec.unit_amount
    }
    return (
      p.recurring?.interval === spec.interval &&
      p.unit_amount === spec.unit_amount
    )
  })
  if (match) {
    console.log(`Price exists (${spec.label}): ${match.id}`)
    return match
  }

  const price = await stripe.prices.create({
    product: productId,
    currency: 'usd',
    unit_amount: spec.unit_amount,
    ...(spec.type === 'one_time'
      ? {}
      : { recurring: { interval: spec.interval } }),
    metadata: { app: 'libertyiq', plan: spec.plan },
  })
  console.log(`Created price (${spec.label}): ${price.id}`)
  return price
}

async function findOrCreateWebhook() {
  const endpoints = await stripe.webhookEndpoints.list({ limit: 100 })
  const existing = endpoints.data.find((e) => e.url === WEBHOOK_URL && e.status !== 'disabled')
  if (existing) {
    console.log(`Webhook exists: ${existing.id}`)
    console.log('NOTE: Stripe only shows the signing secret when a webhook is first created.')
    console.log('If you need whsec_, roll the secret in Dashboard or delete and recreate this endpoint.')
    return existing
  }

  const endpoint = await stripe.webhookEndpoints.create({
    url: WEBHOOK_URL,
    enabled_events: WEBHOOK_EVENTS,
    description: 'LibertyIQ production entitlement sync',
    metadata: { app: 'libertyiq' },
  })
  console.log(`Created webhook: ${endpoint.id}`)
  console.log(`Webhook signing secret: ${endpoint.secret}`)
  return endpoint
}

async function main() {
  console.log('Mode: LIVE')
  console.log()

  const product = await findOrCreateProduct()

  const monthly = await findOrCreatePrice(product.id, {
    label: 'Core $5.99/mo',
    plan: 'monthly',
    type: 'recurring',
    interval: 'month',
    unit_amount: 599,
  })
  const yearly = await findOrCreatePrice(product.id, {
    label: 'Core $59/yr',
    plan: 'yearly',
    type: 'recurring',
    interval: 'year',
    unit_amount: 5900,
  })

  const lifetimeProductSearch = await stripe.products.search({
    query: "name:'LibertyIQ Lifetime' AND active:'true'",
    limit: 1,
  })
  let lifetimeProduct = lifetimeProductSearch.data[0]
  if (!lifetimeProduct) {
    lifetimeProduct = await stripe.products.create({
      name: 'LibertyIQ Lifetime',
      description: 'One-time lifetime access to all LibertyIQ Core features.',
      metadata: { app: 'libertyiq', tier: 'lifetime' },
    })
    console.log(`Created product: ${lifetimeProduct.id}`)
  } else {
    console.log(`Product exists: ${lifetimeProduct.id}`)
  }

  const lifetime = await findOrCreatePrice(lifetimeProduct.id, {
    label: 'Lifetime $129',
    plan: 'lifetime',
    type: 'one_time',
    unit_amount: 12900,
  })

  const webhook = await findOrCreateWebhook()

  const publishable = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '(copy pk_live_... from Dashboard → API keys)'

  console.log()
  console.log('=== Paste into .env.local ===')
  console.log(`STRIPE_SECRET_KEY=${key}`)
  console.log(`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${publishable}`)
  console.log(`STRIPE_PRICE_ID_MONTHLY=${monthly.id}`)
  console.log(`STRIPE_PRICE_ID_YEARLY=${yearly.id}`)
  console.log(`STRIPE_PRICE_ID_LIFETIME=${lifetime.id}`)
  if (webhook.secret) {
    console.log(`STRIPE_WEBHOOK_SECRET=${webhook.secret}`)
  }
  console.log('NEXT_PUBLIC_APP_URL=https://libertyiq.org')
  console.log()
  console.log('Then run: ./scripts/go-live-stripe.sh')
}

main().catch((err) => {
  console.error(err.message || err)
  process.exit(1)
})
