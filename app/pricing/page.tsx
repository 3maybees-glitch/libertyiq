import { Suspense } from 'react'
import type { Metadata } from 'next'
import PricingPage from './pricing-client'

export const metadata: Metadata = {
  title: 'Pricing — LibertyIQ Core & Lifetime',
  description:
    'Free teaser with easy quizzes, Core at $5.99/mo or $59/yr, and a $129 early-bird lifetime unlock.',
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
