'use client'

import Link from 'next/link'
import { Lock, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEntitlement } from '@/hooks/use-entitlement'
import { PRO_FEATURES } from '@/lib/pricing'

type ProGateProps = {
  title: string
  description: string
  children: React.ReactNode
}

export function ProGate({ title, description, children }: ProGateProps) {
  const { isPro, loading, configured } = useEntitlement()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <p className="text-muted-foreground text-sm">Checking Pro access…</p>
      </div>
    )
  }

  if (isPro) {
    return <>{children}</>
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
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 text-center">
        <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-primary/15 text-primary mb-6">
          <Lock className="size-7" aria-hidden />
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="mt-3 text-muted-foreground text-base sm:text-lg leading-relaxed">
          {description}
        </p>

        <ul className="mt-8 text-left space-y-2 max-w-md mx-auto">
          {PRO_FEATURES.map((feature) => (
            <li key={feature} className="flex gap-2 text-sm text-foreground/90">
              <Sparkles className="size-4 text-primary shrink-0 mt-0.5" aria-hidden />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/pricing" className="w-full sm:w-auto">
            <Button size="lg" className="w-full font-semibold gap-2">
              <Sparkles className="size-4" />
              Unlock LibertyIQ Pro
            </Button>
          </Link>
          <Link href="/" className="w-full sm:w-auto">
            <Button size="lg" variant="secondary" className="w-full font-semibold">
              Back to free library
            </Button>
          </Link>
        </div>

        {!configured && (
          <p className="mt-6 text-xs text-muted-foreground">
            Payments are not configured in this environment yet.
          </p>
        )}
      </div>
    </div>
  )
}
