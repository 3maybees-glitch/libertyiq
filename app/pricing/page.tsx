import { Suspense } from 'react'
import type { Metadata } from 'next'
import PricingPage from './pricing-client'

export const metadata: Metadata = {
  title: 'Passes — LibertyIQ',
  description:
    'Free library and easy quizzes. One-time passes: Core $17.77, Family $47.77, Group $147, or a Topic Pack $7.77. No subscription and no auto-renew.',
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
