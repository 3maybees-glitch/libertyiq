import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { RedeemPassForm } from '@/components/redeem-pass-form'

export const metadata: Metadata = {
  title: 'Redeem a pass — LibertyIQ',
  description: 'Enter a LibertyIQ family or group access code to put this device on the pass.',
}

export default function RedeemPage() {
  return (
    <div className="min-h-screen">
      <div
        className="h-1.5 w-full"
        style={{
          background:
            'linear-gradient(to right, #B22234 33%, #FFFFFF 33%, #FFFFFF 66%, #3C3B6E 66%)',
        }}
      />
      <div className="mx-auto max-w-lg px-4 py-12">
        <Link
          href="/pricing"
          className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Passes
        </Link>
        <h1 className="font-serif text-4xl font-bold tracking-tight">Redeem a pass</h1>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          Enter the code from the person who bought a Family Pass or Group Pass. This browser takes one student seat for 365 days.
        </p>
        <div className="mt-8 rounded-2xl border border-border bg-card px-5 py-6">
          <RedeemPassForm />
        </div>
      </div>
    </div>
  )
}
