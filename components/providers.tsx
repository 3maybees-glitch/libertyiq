'use client'

import { EntitlementProvider } from '@/hooks/use-entitlement'
import { InstallPrompt } from '@/components/install-prompt'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <EntitlementProvider>
      {children}
      <InstallPrompt />
    </EntitlementProvider>
  )
}
