import { Suspense } from 'react'
import type { Metadata } from 'next'
import PricingPage from './pricing-client'

export const metadata: Metadata = {
  title: 'Passes — LibertyIQ',
  description:
    'Free library and easy quizzes. Patriot Pass is $17.77 for 365 days. A Topic Pack is $7.77 for one issue, for good. No subscription and no auto-renew.',
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-muted-foreground text-sm">
          Loading pricing…
        </div>
      }
    >
      <PricingPage />
    </Suspense>
  )
}
