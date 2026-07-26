'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEntitlement } from '@/hooks/use-entitlement'

type EntitlementMode = 'checkout_session' | 'payment_links' | 'none'

export default function PricingSuccessClient() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const { refresh, grantSoftPro } = useEntitlement()
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading')
  const [message, setMessage] = useState('Confirming your Pro subscription…')

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
          body: JSON.stringify({ sessionId }),
        })
        const data = await res.json()
        if (res.ok && data.isPro) {
          await refresh()
          if (!cancelled) {
            setStatus('ok')
            setMessage('LibertyIQ Pro is unlocked on this device.')
          }
          return
        }

        // Payment Links only — no server-side Stripe secrets on this deployment.
        if (res.status === 503) {
          const statusRes = await fetch('/api/entitlement', { credentials: 'include' })
          const statusData = (await statusRes.json()) as { mode?: EntitlementMode }
          if (statusData.mode === 'payment_links' && sessionId.startsWith('cs_')) {
            grantSoftPro(sessionId)
            await refresh()
            if (!cancelled) {
              setStatus('ok')
              setMessage('LibertyIQ Pro is unlocked on this device.')
            }
            return
          }
        }

        throw new Error(data.error || 'Unable to confirm Pro access')
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
  }, [sessionId, refresh, grantSoftPro])

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
          {status === 'ok' ? 'Welcome to Pro' : status === 'error' ? 'Almost there' : 'Finishing up'}
        </h1>
        <p className="mt-3 text-muted-foreground">{message}</p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          {status === 'ok' ? (
            <>
              <Link href="/libertyiq">
                <Button className="font-semibold w-full sm:w-auto">Start quizzes</Button>
              </Link>
              <Link href="/speaking-trainer">
                <Button variant="secondary" className="font-semibold w-full sm:w-auto">
                  Speaking trainer
                </Button>
              </Link>
            </>
          ) : (
            <Link href="/pricing">
              <Button variant="secondary" className="font-semibold">
                Back to pricing
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
