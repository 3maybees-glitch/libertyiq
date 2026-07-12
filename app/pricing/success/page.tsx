import { Suspense } from 'react'
import type { Metadata } from 'next'
import PricingSuccessClient from './success-client'

export const metadata: Metadata = {
  title: 'Pro unlocked — LibertyIQ',
  robots: { index: false, follow: false },
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground text-sm">
          Confirming…
        </div>
      }
    >
      <PricingSuccessClient />
    </Suspense>
  )
}
