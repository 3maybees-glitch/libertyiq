import { redirect } from 'next/navigation'
import { getEntitlementFromCookies } from '@/lib/entitlements'

export default async function SpeakingTrainerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const entitlement = await getEntitlementFromCookies()
  if (!entitlement) {
    redirect('/pricing?upgrade=1')
  }

  return <>{children}</>
}
