'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, Check, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEntitlement } from '@/hooks/use-entitlement'
import { FREE_FEATURES, PRO_FEATURES, PRO_PLANS, type BillingInterval } from '@/lib/pricing'
import { cn } from '@/lib/utils'

export default function PricingPage() {
  const searchParams = useSearchParams()
  const canceled = searchParams.get('canceled') === '1'
  const { isPro, loading, startCheckout, openPortal, configured } = useEntitlement()
  const [plan, setPlan] = useState<BillingInterval>('yearly')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selected = PRO_PLANS[plan]

  async function onCheckout() {
    setBusy(true)
    setError(null)
    try {
      await startCheckout(plan)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed')
      setBusy(false)
    }
  }

  async function onManage() {
    setBusy(true)
    setError(null)
    try {
      await openPortal()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to open billing portal')
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div
        className="h-1.5 w-full"
        style={{
          background:
            'linear-gradient(to right, #B22234 33%, #FFFFFF 33%, #FFFFFF 66%, #3C3B6E 66%)',
        }}
      />

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Library
        </Link>

        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-accent font-semibold tracking-wide uppercase text-xs mb-3">
            LibertyIQ Pro
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Master every argument.
          </h1>
          <p className="mt-3 text-muted-foreground text-base sm:text-lg leading-relaxed">
            The library stays free. Pro unlocks quizzes, ranks, and the speaking trainer.
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
            <h2 className="font-serif text-2xl font-bold">You&apos;re on LibertyIQ Pro</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Quizzes, ranks, and the speaking trainer are unlocked on this device.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/libertyiq">
                <Button className="font-semibold w-full sm:w-auto">Go to quizzes</Button>
              </Link>
              <Button
                variant="secondary"
                className="font-semibold w-full sm:w-auto"
                disabled={busy}
                onClick={() => void onManage()}
              >
                Manage billing
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-center mb-8">
              <div
                role="tablist"
                aria-label="Billing interval"
                className="inline-flex rounded-xl border border-border bg-card/60 p-1"
              >
                {(Object.keys(PRO_PLANS) as BillingInterval[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={plan === key}
                    onClick={() => setPlan(key)}
                    className={cn(
                      'px-4 py-2 text-sm font-semibold rounded-lg transition-colors',
                      plan === key
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {PRO_PLANS[key].label}
                    {key === 'yearly' ? (
                      <span className="ml-1.5 text-[10px] uppercase tracking-wide opacity-90">
                        Best value
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start max-w-4xl mx-auto">
              <section className="text-left">
                <h2 className="font-serif text-2xl font-bold mb-1">Free</h2>
                <p className="text-muted-foreground text-sm mb-5">Browse the full library.</p>
                <p className="font-serif text-4xl font-bold mb-6">
                  $0<span className="text-base font-sans font-medium text-muted-foreground"> forever</span>
                </p>
                <ul className="space-y-2.5 mb-8">
                  {FREE_FEATURES.map((feature) => (
                    <li key={feature} className="flex gap-2 text-sm">
                      <Check className="size-4 text-accent shrink-0 mt-0.5" aria-hidden />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/">
                  <Button variant="secondary" className="w-full font-semibold">
                    Continue free
                  </Button>
                </Link>
              </section>

              <section className="text-left md:pl-8 md:border-l border-border">
                <h2 className="font-serif text-2xl font-bold mb-1 flex items-center gap-2">
                  Pro
                  <Sparkles className="size-5 text-primary" aria-hidden />
                </h2>
                <p className="text-muted-foreground text-sm mb-5">{selected.blurb}</p>
                <p className="font-serif text-4xl font-bold mb-6">
                  {selected.priceLabel}
                  <span className="text-base font-sans font-medium text-muted-foreground">
                    {selected.period}
                  </span>
                </p>
                <ul className="space-y-2.5 mb-8">
                  {PRO_FEATURES.map((feature) => (
                    <li key={feature} className="flex gap-2 text-sm">
                      <Check className="size-4 text-primary shrink-0 mt-0.5" aria-hidden />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full font-semibold gap-2"
                  size="lg"
                  disabled={busy || loading || !configured}
                  onClick={() => void onCheckout()}
                >
                  <Sparkles className="size-4" />
                  {busy ? 'Redirecting…' : `Get Pro — ${selected.priceLabel}${selected.period}`}
                </Button>
                {!configured && (
                  <p className="mt-3 text-xs text-muted-foreground">
                    Stripe keys are missing in this environment.
                  </p>
                )}
              </section>
            </div>
          </>
        )}

        {error && (
          <p className="mt-6 text-center text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        <p className="mt-12 text-center text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
          Secure checkout powered by Stripe. Subscriptions renew automatically until canceled.
          Manage or cancel anytime from the billing portal.
        </p>
      </div>
    </div>
  )
}
