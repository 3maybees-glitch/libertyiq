'use client'

import { EntitlementProvider } from '@/hooks/use-entitlement'
import { InstallAppProvider } from '@/components/install-app'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <EntitlementProvider>
      <InstallAppProvider>{children}</InstallAppProvider>
    </EntitlementProvider>
  )
}
