'use client'

import { useCallback, useMemo } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Building2, Landmark, Search, UserRound } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { WhoHoldsTheGavel } from '@/components/committees/who-holds-the-gavel'
import { PartyPill } from '@/components/committees/member-row'
import {
  chamberLabel,
  getLeadership,
  searchCommittees,
  searchMembers,
} from '@/lib/committees/roster'
import { getGavelTopics } from '@/lib/committees/gavel'
import { topics } from '@/lib/types'
import type { Chamber, DirectoryFilters, DirectoryView, Side } from '@/lib/committees/types'
import { cn } from '@/lib/utils'

const VIEWS: { id: DirectoryView; label: string; icon: typeof UserRound }[] = [
  { id: 'committee', label: 'By committee', icon: Landmark },
  { id: 'member', label: 'By member', icon: UserRound },
  { id: 'issue', label: 'By issue', icon: Building2 },
]

function topicTitle(id: string) {
  return topics.find((t) => t.id === id)?.title ?? id
}

export function CommitteesDirectory() {
  const params = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const view = (params.get('view') as DirectoryView) || 'committee'
  const query = params.get('q') || ''
  const chamber = (params.get('chamber') as DirectoryFilters['chamber']) || 'all'
  const side = (params.get('side') as DirectoryFilters['side']) || 'all'
  const chairsOnly = params.get('chairs') === '1'
  const issue = params.get('issue') || ''

  const setParams = useCallback(
    (patch: Record<string, string | null>) => {
      const next = new URLSearchParams(params.toString())
      for (const [key, value] of Object.entries(patch)) {
        if (!value) next.delete(key)
        else next.set(key, value)
      }
      const qs = next.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [params, pathname, router],
  )

  const filters: DirectoryFilters = useMemo(
    () => ({ query, chamber, side, chairsOnly }),
    [query, chamber, side, chairsOnly],
  )

  const members = useMemo(
    () => searchMembers(filters, filters.query.trim() ? 80 : 600),
    [filters],
  )
  const committees = useMemo(() => searchCommittees(filters, true), [filters])

  const issues = getGavelTopics()
  const grouped = useMemo(() => {
    const house = committees.filter((c) => c.type === 'house')
    const senate = committees.filter((c) => c.type === 'senate')
    const joint = committees.filter((c) => c.type === 'joint')
    return { house, senate, joint }
  }, [committees])

  return (
    <div className="space-y-6">
      <div className="print:hidden space-y-3">
        <label className="block">
          <span className="sr-only">Search members, committees, nicknames</span>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setParams({ q: e.target.value || null })}
              placeholder='Search “Cruz”, “Ways and Means”, “HELP”, “HPSCI”, Texas…'
              className="pl-9 h-11 bg-card/80 text-base"
            />
          </div>
        </label>

        <div className="flex flex-wrap gap-2">
          <FilterChip
            active={chamber === 'all'}
            onClick={() => setParams({ chamber: null })}
          >
            All chambers
          </FilterChip>
          {(['house', 'senate', 'joint'] as Chamber[]).map((c) => (
            <FilterChip
              key={c}
              active={chamber === c}
              onClick={() => setParams({ chamber: chamber === c ? null : c })}
            >
              {chamberLabel(c)}
            </FilterChip>
          ))}
          <span className="w-px bg-border/60 mx-1 hidden sm:inline-block" />
          {(['majority', 'minority'] as Side[]).map((s) => (
            <FilterChip
              key={s}
              active={side === s}
              onClick={() => setParams({ side: side === s ? null : s })}
            >
              {s === 'majority' ? 'Majority' : 'Minority'}
            </FilterChip>
          ))}
          <FilterChip
            active={chairsOnly}
            onClick={() => setParams({ chairs: chairsOnly ? null : '1' })}
          >
            Chairs only
          </FilterChip>
        </div>

        <div className="flex flex-wrap gap-2">
          {VIEWS.map((item) => {
            const Icon = item.icon
            const active = view === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setParams({ view: item.id === 'committee' ? null : item.id })}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold border transition-colors',
                  active
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card/60 border-border hover:border-primary/50',
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            )
          })}
        </div>
      </div>

      {view === 'member' ? (
        <section>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
            {query ? `${members.length} members` : 'Type a last name, state, or committee nickname'}
          </p>
          {members.length === 0 ? (
            <EmptySearch
              label={
                chamber !== 'all' || side !== 'all' || chairsOnly
                  ? 'No members match. Clear the chamber or majority filters — a leftover House filter will hide senators like Cruz.'
                  : 'No members match that search. Try a last name, state, or committee nickname.'
              }
            />
          ) : (
            <ul className="divide-y divide-border/40 rounded-xl border border-border/60 bg-card/60">
              {members.map((m) => (
                <li key={m.id}>
                  <Link
                    href={`/committees/m/${m.id}`}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors"
                  >
                    <PartyPill party={m.party} />
                    <span className="font-semibold">
                      {m.last}, {m.first}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {m.chamber === 'house' ? 'Rep.' : 'Sen.'} {m.party}-{m.state}
                      {m.district != null ? `-${m.district}` : ''}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}

      {view === 'committee' ? (
        <section className="space-y-8">
          {(['house', 'senate', 'joint'] as const).map((group) => {
            const rows = grouped[group]
            if (rows.length === 0) return null
            return (
              <div key={group}>
                <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                  {chamberLabel(group)}
                </h2>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {rows.map((c) => {
                    const lead = getLeadership(c.id)
                    return (
                      <li key={c.id}>
                        <Link
                          href={`/committees/c/${c.id}`}
                          className="block rounded-xl border border-border/60 bg-card/60 px-4 py-3 hover:border-primary/50 transition-colors h-full"
                        >
                          <p className="font-semibold leading-snug">{c.shortName}</p>
                          {c.nicknames[0] && c.nicknames[0] !== c.shortName ? (
                            <p className="text-[11px] uppercase tracking-wider text-accent mt-0.5">{c.nicknames[0]}</p>
                          ) : null}
                          {lead.chair ? (
                            <p className="text-sm text-muted-foreground mt-1">
                              Chair {lead.chair.member.last} ({lead.chair.member.party}-{lead.chair.member.state})
                            </p>
                          ) : (
                            <p className="text-sm text-muted-foreground mt-1">{c.name}</p>
                          )}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
          {committees.length === 0 ? <EmptySearch label="No committees match those filters." /> : null}
        </section>
      ) : null}

      {view === 'issue' ? (
        <section className="space-y-4">
          <div className="flex flex-wrap gap-2 print:hidden">
            {issues.map((item) => (
              <FilterChip
                key={item.topicId}
                active={issue === item.topicId || (!issue && item.topicId === issues[0]?.topicId)}
                onClick={() => setParams({ issue: item.topicId, view: 'issue' })}
              >
                {topicTitle(item.topicId)}
              </FilterChip>
            ))}
          </div>
          <WhoHoldsTheGavel topicId={issue || issues[0]?.topicId || 'pro-life'} variant="page" />
        </section>
      ) : null}

      <OfficialFooter />
    </div>
  )
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-1 text-xs font-semibold transition-colors',
        active
          ? 'border-accent bg-accent/20 text-foreground'
          : 'border-border/70 bg-card/40 text-muted-foreground hover:text-foreground',
      )}
    >
      {children}
    </button>
  )
}

function EmptySearch({ label }: { label: string }) {
  return (
    <p className="rounded-xl border border-dashed border-border/70 px-4 py-8 text-center text-sm text-muted-foreground">
      {label}
    </p>
  )
}

function OfficialFooter() {
  return (
    <footer className="print:hidden pt-6 text-xs text-muted-foreground leading-relaxed space-y-1">
      <p>
        119th Congress roster compiled from{' '}
        <a className="underline hover:text-foreground" href="https://github.com/unitedstates/congress-legislators">
          unitedstates/congress-legislators
        </a>
        . Cross-check the{' '}
        <a className="underline hover:text-foreground" href="https://clerk.house.gov/">
          Clerk of the House
        </a>
        ,{' '}
        <a className="underline hover:text-foreground" href="https://www.senate.gov/committees/">
          Senate.gov
        </a>
        , and{' '}
        <a className="underline hover:text-foreground" href="https://www.congress.gov/committees">
          congress.gov/committees
        </a>
        . Assignments move mid-Congress.
      </p>
      <p>
        CCCP can reuse member IDs from{' '}
        <a className="underline hover:text-foreground" href="/data/committees.json">
          /data/committees.json
        </a>{' '}
        and link back here.       This is not a hearings, video, or vote-score product.
      </p>
    </footer>
  )
}
