import { Suspense } from 'react'
import type { Metadata } from 'next'
import PricingPage from './pricing-client'

export const metadata: Metadata = {
  title: 'Pricing — LibertyIQ Pro',
  description:
    'Unlock LibertyIQ Pro for unlimited quizzes, rank progression, and the public speaking trainer. The argument library stays free.',
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground text-sm">
          Loading pricing…
        </div>
      }
    >
      <PricingPage />
    </Suspense>
  )
}
