'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getOrCreateDeviceId, useEntitlement } from '@/hooks/use-entitlement'
import { PAID_PLANS, topicTitle, type PaidPlan } from '@/lib/pricing'

type ConfirmResponse = {
  isPro?: boolean
  topics?: string[]
  plan?: string
  purchasedPlan?: string
  accessCode?: string | null
  seats?: number | null
  seatsUsed?: number | null
  accessExpiresAt?: number | null
  error?: string
}

function formatDay(unix: number): string {
  return new Date(unix * 1000).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function PricingSuccessClient() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const { refresh } = useEntitlement()
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading')
  const [message, setMessage] = useState('Confirming your pass…')
  const [details, setDetails] = useState<ConfirmResponse | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function confirm() {
      if (!sessionId) {
        setStatus('error')
        setMessage('Missing checkout session. If you were charged, contact support with your receipt.')
        return
      }

      try {
        const res = await fetch('/api/entitlement', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ sessionId, deviceId: getOrCreateDeviceId() }),
        })
        const data = (await res.json()) as ConfirmResponse
        if (!res.ok || (!data.isPro && !(data.topics && data.topics.length > 0))) {
          throw new Error(data.error || 'Unable to confirm this pass')
        }
        await refresh()
        if (!cancelled) {
          setDetails(data)
          setStatus('ok')
          const bought = data.purchasedPlan ?? data.plan
          const plan = bought && bought in PAID_PLANS ? PAID_PLANS[bought as PaidPlan].label : 'Your pass'
          const topicId = data.topics?.[data.topics.length - 1]
          if (bought === 'topic' && topicId) {
            const title = topicTitle(topicId) ?? 'That topic'
            setMessage(`${title} is unlocked on this device. It does not expire.`)
          } else if (data.accessExpiresAt) {
            setMessage(`${plan} is active on this device through ${formatDay(data.accessExpiresAt)}.`)
          } else {
            setMessage(`${plan} is active on this device.`)
          }
        }
      } catch (err) {
        if (!cancelled) {
          setStatus('error')
          setMessage(err instanceof Error ? err.message : 'Confirmation failed')
        }
      }
    }

    void confirm()
    return () => {
      cancelled = true
    }
  }, [sessionId, refresh])

  const showCode = Boolean(details?.accessCode && details.seats && details.seats > 1)

  return (
    <div className="min-h-screen">
      <div
        className="h-1.5 w-full"
        style={{
          background:
            'linear-gradient(to right, #B22234 33%, #FFFFFF 33%, #FFFFFF 66%, #3C3B6E 66%)',
        }}
      />
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        {status === 'loading' && (
          <Loader2 className="mx-auto size-10 text-primary animate-spin mb-4" aria-hidden />
        )}
        {status === 'ok' && (
          <CheckCircle2 className="mx-auto size-12 text-primary mb-4" aria-hidden />
        )}
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
          {status === 'ok' ? 'Pass confirmed' : status === 'error' ? 'Almost there' : 'Finishing up'}
        </h1>
        <p className="mt-3 text-muted-foreground">{message}</p>

        {showCode && details?.accessCode && (
          <div className="mt-8 rounded-2xl border border-border bg-card px-5 py-5 text-left">
            <p className="text-sm font-semibold">Access code</p>
            <p className="mt-2 font-mono text-2xl tracking-widest">{details.accessCode}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Up to {details.seats} students can use it, including this device. Each other student opens{' '}
              <Link href="/redeem" className="underline underline-offset-2">
                the redeem page
              </Link>{' '}
              and enters the code on their own device. This device already has a seat
              {details.seatsUsed ? ` (${details.seatsUsed} of ${details.seats} in use)` : ''}.
            </p>
            <Button
              type="button"
              variant="secondary"
              className="mt-4 font-semibold"
              onClick={() => {
                void navigator.clipboard.writeText(details.accessCode ?? '').then(() => {
                  setCopied(true)
                })
              }}
            >
              {copied ? 'Copied' : 'Copy code'}
            </Button>
          </div>
        )}

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          {status === 'ok' ? (
            <>
              <Link href="/libertyiq">
                <Button className="font-semibold w-full sm:w-auto">Start quizzes</Button>
              </Link>
              {details?.isPro && (
                <Link href="/speaking-trainer">
                  <Button variant="secondary" className="font-semibold w-full sm:w-auto">
                    Speaking trainer
                  </Button>
                </Link>
              )}
            </>
          ) : (
            <Link href="/pricing">
              <Button variant="secondary" className="font-semibold">
                Back to passes
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
