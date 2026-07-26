'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, Check, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEntitlement } from '@/hooks/use-entitlement'
import { OnlineOnlyNote } from '@/components/online-only-note'
import { CORE_FEATURES, FREE_FEATURES, PAID_PLANS, type PaidPlan } from '@/lib/pricing'
import { cn } from '@/lib/utils'

export default function PricingPage() {
  const searchParams = useSearchParams()
  const canceled = searchParams.get('canceled') === '1'
  const { isPro, loading, startCheckout, openPortal, configured } = useEntitlement()
  const [busyPlan, setBusyPlan] = useState<PaidPlan | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function onCheckout(plan: PaidPlan) {
    setBusyPlan(plan)
    setError(null)
    try {
      await startCheckout(plan)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed')
      setBusyPlan(null)
    }
  }

  async function onManage() {
    setBusyPlan('monthly')
    setError(null)
    try {
      await openPortal()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to open billing portal')
      setBusyPlan(null)
    }
  }

  return (
    <div className="min-h-screen">
      <div
        className="h-1.5 w-full"
        style={{
          background:
            'linear-gradient(to right, #B22234 33%, #FFFFFF 33%, #FFFFFF 66%, #3C3B6E 66%)',
        }}
      />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Library
        </Link>

        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-accent font-semibold tracking-wide uppercase text-xs mb-3">
            Pricing
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Start free. Go Core when you&apos;re ready.
          </h1>
          <p className="mt-3 text-muted-foreground text-base sm:text-lg leading-relaxed">
            A generous free teaser, affordable Core subscription, and a limited early-bird lifetime unlock.
          </p>
        </div>

        {canceled && (
          <p className="mb-6 text-center text-sm text-muted-foreground">
            Checkout canceled — no charge was made. You can try again whenever you&apos;re ready.
          </p>
        )}

        {isPro && !loading ? (
          <div className="mx-auto max-w-lg text-center rounded-2xl border border-primary/30 bg-primary/10 px-6 py-10 mb-12">
            <Sparkles className="mx-auto size-8 text-primary mb-3" />
            <h2 className="font-serif text-2xl font-bold">You&apos;re unlocked</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Medium/hard quizzes, ranks, and the speaking trainer are available on this device.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/libertyiq">
                <Button className="font-semibold w-full sm:w-auto">Go to quizzes</Button>
              </Link>
              <Button
                variant="secondary"
                className="font-semibold w-full sm:w-auto"
                disabled={busyPlan !== null}
                onClick={() => void onManage()}
              >
                Manage billing
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-3 lg:gap-8 items-start">
            {/* Free */}
            <section className="text-left">
              <h2 className="font-serif text-2xl font-bold mb-1">Free</h2>
              <p className="text-muted-foreground text-sm mb-5">Generous teaser — no account required.</p>
              <p className="font-serif text-4xl font-bold mb-6">
                $0
                <span className="text-base font-sans font-medium text-muted-foreground"> forever</span>
              </p>
              <ul className="space-y-2.5 mb-8">
                {FREE_FEATURES.map((feature) => (
                  <li key={feature} className="flex gap-2 text-sm">
                    <Check className="size-4 text-accent shrink-0 mt-0.5" aria-hidden />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/libertyiq">
                <Button variant="secondary" className="w-full font-semibold">
                  Start free
                </Button>
              </Link>
            </section>

            {/* Core */}
            <section className="text-left lg:px-6 lg:border-x border-border">
              <h2 className="font-serif text-2xl font-bold mb-1 flex items-center gap-2">
                Core
                <Sparkles className="size-5 text-primary" aria-hidden />
              </h2>
              <p className="text-muted-foreground text-sm mb-5">Full training suite.</p>
              <div className="mb-6 space-y-1">
                <p className="font-serif text-4xl font-bold">
                  {PAID_PLANS.monthly.priceLabel}
                  <span className="text-base font-sans font-medium text-muted-foreground">
                    {PAID_PLANS.monthly.period}
                  </span>
                </p>
                <p className="text-sm text-muted-foreground">
                  or {PAID_PLANS.yearly.priceLabel}
                  {PAID_PLANS.yearly.period}
                </p>
              </div>
              <ul className="space-y-2.5 mb-8">
                {CORE_FEATURES.map((feature) => (
                  <li key={feature} className="flex gap-2 text-sm">
                    <Check className="size-4 text-primary shrink-0 mt-0.5" aria-hidden />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="space-y-2">
                <Button
                  className="w-full font-semibold gap-2"
                  size="lg"
                  disabled={busyPlan !== null || loading || !configured}
                  onClick={() => void onCheckout('yearly')}
                >
                  {busyPlan === 'yearly'
                    ? 'Redirecting…'
                    : `Core yearly — ${PAID_PLANS.yearly.priceLabel}`}
                </Button>
                <Button
                  variant="secondary"
                  className="w-full font-semibold"
                  disabled={busyPlan !== null || loading || !configured}
                  onClick={() => void onCheckout('monthly')}
                >
                  {busyPlan === 'monthly'
                    ? 'Redirecting…'
                    : `Core monthly — ${PAID_PLANS.monthly.priceLabel}`}
                </Button>
              </div>
            </section>

            {/* Lifetime */}
            <section className="text-left">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-serif text-2xl font-bold">Lifetime</h2>
                <span
                  className={cn(
                    'text-[10px] uppercase tracking-wide font-semibold px-2 py-0.5 rounded-md',
                    'bg-primary/15 text-primary',
                  )}
                >
                  Early bird
                </span>
              </div>
              <p className="text-muted-foreground text-sm mb-5">{PAID_PLANS.lifetime.blurb}</p>
              <p className="font-serif text-4xl font-bold mb-6">
                {PAID_PLANS.lifetime.priceLabel}
                <span className="text-base font-sans font-medium text-muted-foreground">
                  {PAID_PLANS.lifetime.period}
                </span>
              </p>
              <ul className="space-y-2.5 mb-8">
                {CORE_FEATURES.map((feature) => (
                  <li key={feature} className="flex gap-2 text-sm">
                    <Check className="size-4 text-primary shrink-0 mt-0.5" aria-hidden />
                    <span>{feature}</span>
                  </li>
                ))}
                <li className="flex gap-2 text-sm">
                  <Check className="size-4 text-primary shrink-0 mt-0.5" aria-hidden />
                  <span>Pay once — no renewals</span>
                </li>
              </ul>
              <Button
                className="w-full font-semibold gap-2"
                size="lg"
                disabled={busyPlan !== null || loading || !configured}
                onClick={() => void onCheckout('lifetime')}
              >
                <Sparkles className="size-4" />
                {busyPlan === 'lifetime'
                  ? 'Redirecting…'
                  : `Get lifetime — ${PAID_PLANS.lifetime.priceLabel}`}
              </Button>
            </section>
          </div>
        )}

        {error && (
          <p className="mt-6 text-center text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        <div className="mt-12 mx-auto max-w-lg space-y-2 text-center">
          <OnlineOnlyNote>
            Checkout and billing portal need a network connection. The library and quizzes still work offline
            after you&apos;ve opened them once.
          </OnlineOnlyNote>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Secure checkout powered by Stripe. Core subscriptions renew until canceled.
            Lifetime is a one-time early-bird purchase. Manage subscriptions anytime from the billing portal.
          </p>
        </div>
      </div>
    </div>
  )
}
