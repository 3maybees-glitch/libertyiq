import { Suspense } from 'react'
import type { Metadata } from 'next'
import { CommitteesShell } from '@/components/committees/committees-shell'
import { CommitteesDirectory } from '@/components/committees/committees-directory'
import { getCongress, getGeneratedAt, formatUpdated } from '@/lib/committees/roster'

export const metadata: Metadata = {
  title: 'Congressional Committees | LibertyIQ',
  description:
    '119th Congress committee roster mapped to LibertyIQ issues — who sits where, who holds the gavel, and which panels actually mark up the bills you debate.',
}

export default function CommitteesPage() {
  const congress = getCongress()
  const updated = formatUpdated(getGeneratedAt())

  return (
    <CommitteesShell
      title="Committees"
      description={`The map between a talking point and the people who can move a bill. ${congress}th Congress standing, select, and joint committees — search by member, committee, or LibertyIQ issue. Roster current as of ${updated}.`}
    >
      <Suspense fallback={<p className="text-sm text-muted-foreground">Loading roster…</p>}>
        <CommitteesDirectory />
      </Suspense>
    </CommitteesShell>
  )
}
