'use client'

import { EntitlementProvider } from '@/hooks/use-entitlement'

export function Providers({ children }: { children: React.ReactNode }) {
  return <EntitlementProvider>{children}</EntitlementProvider>
}
