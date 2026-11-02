'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, Check, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RedeemPassForm } from '@/components/redeem-pass-form'
import { useEntitlement } from '@/hooks/use-entitlement'
import { OnlineOnlyNote } from '@/components/online-only-note'
import {
  CHECKOUT_UNAVAILABLE_MESSAGE,
  FREE_FEATURES,
  PAID_PLANS,
  PASS_TOPICS,
  type PaidPlan,
} from '@/lib/pricing'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const PASS_ORDER: PaidPlan[] = ['core', 'family', 'group', 'topic']

function formatDay(unix: number): string {
  return new Date(unix * 1000).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function PricingPage() {
  const searchParams = useSearchParams()
  const canceled = searchParams.get('canceled') === '1'
  const {
    isPro,
    topics,
    loading,
    startCheckout,
    openPortal,
    configured,
    plan,
    accessCode,
    seats,
    seatsUsed,
    accessExpiresAt,
    legacySubscription,
  } = useEntitlement()
  const [busyPlan, setBusyPlan] = useState<PaidPlan | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [topicId, setTopicId] = useState<string>('')

  async function onCheckout(planId: PaidPlan) {
    setBusyPlan(planId)
    setError(null)
    try {
      await startCheckout(planId, planId === 'topic' ? topicId : undefined)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed')
      setBusyPlan(null)
    }
  }

  async function onManage() {
    setError(null)
    try {
      await openPortal()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to open billing portal')
    }
  }

  const hasAccess = isPro || topics.length > 0

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

        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-accent font-semibold tracking-wide uppercase text-xs mb-3">
            Passes
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Study free. Buy a pass when you are ready.
          </h1>
          <p className="mt-3 text-muted-foreground text-base sm:text-lg leading-relaxed">
            One payment. No subscription and no auto-renew. A 365-day pass ends on its own.
          </p>
        </div>

        {canceled && (
          <p className="mb-6 text-center text-sm text-muted-foreground">
            Checkout canceled. No charge was made.
          </p>
        )}

        {!loading && !configured && !hasAccess && (
          <p className="mb-8 text-center text-sm text-foreground/95" role="status">
            {CHECKOUT_UNAVAILABLE_MESSAGE}
          </p>
        )}

        {!loading && hasAccess && (
          <div className="mx-auto max-w-2xl rounded-2xl border border-primary/30 bg-primary/10 px-6 py-6 mb-10 text-center">
            <Sparkles className="mx-auto size-7 text-primary mb-2" />
            <h2 className="font-serif text-2xl font-bold">
              {isPro ? 'This device has a pass' : 'A topic is unlocked on this device'}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {isPro && accessExpiresAt
                ? `${plan === 'family' ? 'Family' : plan === 'group' ? 'Group' : 'Core'} access runs through ${formatDay(accessExpiresAt)}.`
                : isPro
                  ? 'Full training access is on this device.'
                  : 'Medium and hard quizzes are open for the topic you bought. The speaking trainer stays with a Core, Family, or Group pass.'}
              {seats != null && seatsUsed != null ? ` ${seatsUsed} of ${seats} seats are in use.` : ''}
            </p>
            {accessCode && seats != null && seats > 1 && (
              <p className="mt-4 font-mono text-lg tracking-widest text-foreground">{accessCode}</p>
            )}
            <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/libertyiq">
                <Button className="font-semibold w-full sm:w-auto">Go to quizzes</Button>
              </Link>
              {isPro && (
                <Link href="/speaking-trainer">
                  <Button variant="secondary" className="font-semibold w-full sm:w-auto">
                    Speaking trainer
                  </Button>
                </Link>
              )}
              {legacySubscription && (
                <Button variant="secondary" className="font-semibold" onClick={() => void onManage()}>
                  Manage older subscription
                </Button>
              )}
            </div>
          </div>
        )}

        <section className="rounded-2xl border border-border bg-card/60 px-5 py-5 mb-8 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-serif text-2xl font-bold">Free</h2>
              <p className="text-sm text-muted-foreground mt-1">The library, easy quizzes, and one-pagers. No account.</p>
            </div>
            <p className="font-serif text-3xl font-bold">
              $0
              <span className="text-base font-sans font-medium text-muted-foreground"> forever</span>
            </p>
          </div>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {FREE_FEATURES.map((feature) => (
              <li key={feature} className="flex gap-2 text-sm">
                <Check className="size-4 text-accent shrink-0 mt-0.5" aria-hidden />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <Link href="/libertyiq" className="inline-block mt-5">
            <Button variant="secondary" className="font-semibold">
              Start free
            </Button>
          </Link>
        </section>

        <div className="grid gap-6 md:grid-cols-2">
          {PASS_ORDER.map((planId) => {
            const pass = PAID_PLANS[planId]
            const needsTopic = planId === 'topic'
            const disabled =
              busyPlan !== null || loading || !configured || (needsTopic && !topicId)
            return (
              <section key={planId} className="rounded-2xl border border-border bg-card px-5 py-6 text-left">
                <h2 className="font-serif text-2xl font-bold flex items-center gap-2">
                  {pass.label}
                  {planId === 'core' && <Sparkles className="size-5 text-primary" aria-hidden />}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">{pass.blurb}</p>
                <p className="mt-4 font-serif text-4xl font-bold">
                  {pass.priceLabel}
                  <span className="text-base font-sans font-medium text-muted-foreground"> once</span>
                </p>
                <ul className="mt-5 space-y-2.5 mb-6">
                  {pass.features.map((feature) => (
                    <li key={feature} className="flex gap-2 text-sm">
                      <Check className="size-4 text-primary shrink-0 mt-0.5" aria-hidden />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                {needsTopic && (
                  <div className="mb-4">
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Topic
                    </label>
                    <Select value={topicId} onValueChange={setTopicId}>
                      <SelectTrigger className="mt-2 w-full">
                        <SelectValue placeholder="Choose one issue" />
                      </SelectTrigger>
                      <SelectContent>
                        {PASS_TOPICS.map((topic) => (
                          <SelectItem key={topic.id} value={topic.id}>
                            {topic.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <Button
                  className={cn('w-full font-semibold')}
                  size="lg"
                  disabled={disabled}
                  onClick={() => void onCheckout(planId)}
                >
                  {busyPlan === planId ? 'Redirecting…' : `Buy ${pass.label} — ${pass.priceLabel}`}
                </Button>
              </section>
            )
          })}
        </div>

        {error && (
          <p className="mt-6 text-center text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        <section className="mt-12 mx-auto max-w-xl rounded-2xl border border-border px-5 py-6">
          <h2 className="font-serif text-2xl font-bold">Have a code?</h2>
          <div className="mt-4">
            <RedeemPassForm />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            You can also open <Link href="/redeem" className="underline underline-offset-2">the redeem page</Link>.
          </p>
        </section>

        <div className="mt-10 mx-auto max-w-lg space-y-2 text-center">
          <OnlineOnlyNote>
            Checkout needs a network connection. The library and quizzes still work offline after you have opened them once.
          </OnlineOnlyNote>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Secure checkout by Stripe. Every pass is a single charge. Nothing on this page renews.
            An older Core subscription, if you already have one, keeps working until it is canceled.
          </p>
        </div>
      </div>
    </div>
  )
}
