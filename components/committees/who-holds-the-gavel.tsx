import Link from 'next/link'
import { Gavel } from 'lucide-react'
import { getGavelTopic } from '@/lib/committees/gavel'
import { topics } from '@/lib/types'
import { PartyPill } from '@/components/committees/member-row'
import { cn } from '@/lib/utils'

function topicTitle(topicId: string): string {
  return topics.find((t) => t.id === topicId)?.title ?? topicId
}

function PersonLine({
  person,
  role,
}: {
  person: { id: string; name: string; party: 'R' | 'D' | 'I'; state: string } | null
  role: string
}) {
  if (!person) return null
  return (
    <Link href={`/committees/m/${person.id}`} className="inline-flex items-center gap-1.5 hover:underline">
      <PartyPill party={person.party} />
      <span>
        <span className="text-muted-foreground">{role} </span>
        <span className="font-semibold">{person.name}</span>
        <span className="text-muted-foreground"> ({person.party}-{person.state})</span>
      </span>
    </Link>
  )
}

export function WhoHoldsTheGavel({
  topicId,
  variant = 'panel',
}: {
  topicId: string
  variant?: 'panel' | 'page'
}) {
  const gavel = getGavelTopic(topicId)
  if (!gavel) return null

  return (
    <section
      className={cn(
        'rounded-xl border border-border/70 bg-card/70 overflow-hidden',
        variant === 'page' && 'mt-8',
      )}
    >
      <div className="px-5 py-4 border-b border-border/50 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent flex items-center gap-1.5">
            <Gavel className="h-3.5 w-3.5" />
            Who holds the gavel
          </p>
          <h3 className="mt-1 text-lg font-serif font-bold">{gavel.headline}</h3>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed max-w-3xl">{gavel.blurb}</p>
        </div>
        <Link
          href={`/committees?view=issue&issue=${topicId}`}
          className="text-sm font-semibold text-accent hover:underline shrink-0"
        >
          {topicTitle(topicId)} on the roster →
        </Link>
      </div>
      <ul className="divide-y divide-border/40">
        {gavel.committees.map((committee) => (
          <li key={committee.id} className="px-5 py-3 sm:px-5">
            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
              <div className="sm:w-56 shrink-0">
                <Link href={`/committees/c/${committee.id}`} className="font-semibold hover:underline leading-snug">
                  {committee.type === 'house' ? 'House' : committee.type === 'senate' ? 'Senate' : 'Joint'} {committee.name}
                </Link>
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <p className="text-sm text-foreground/90 leading-relaxed">{committee.why}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                  <PersonLine person={committee.chair} role="Chair" />
                  <PersonLine person={committee.ranking} role="Ranking" />
                </div>
                {committee.focus.length > 0 ? (
                  <p className="text-xs text-muted-foreground">
                    {committee.focus.map((f, i) => (
                      <span key={f.id}>
                        {i > 0 ? ' · ' : ''}
                        <Link href={`/committees/c/${f.id}`} className="hover:underline">
                          {f.name}
                        </Link>
                        {f.chair ? ` — ${f.chair.name}` : ''}
                      </span>
                    ))}
                  </p>
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
