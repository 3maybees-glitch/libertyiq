import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import type { Committee } from '@/lib/committees/types'
import {
  chamberLabel,
  getCommitteeSeats,
  getLeadership,
  getSubcommittees,
  splitSides,
  titleLabel,
} from '@/lib/committees/roster'
import { MemberRow, SideRail } from '@/components/committees/member-row'
import { cn } from '@/lib/utils'

export function CommitteeRoster({
  committee,
  showJurisdiction = true,
  showSubcommittees = true,
}: {
  committee: Committee
  showJurisdiction?: boolean
  showSubcommittees?: boolean
}) {
  const seats = getCommitteeSeats(committee.id)
  const { majority, minority } = splitSides(seats)
  const { chair, ranking } = getLeadership(committee.id)
  const subs = showSubcommittees ? getSubcommittees(committee.id) : []
  const parentHref = committee.parentId ? `/committees/c/${committee.parentId}` : null

  return (
    <article className="committee-roster space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {chamberLabel(committee.type)}
            {committee.parentId ? ' · Subcommittee' : ' · Standing'}
          </p>
          <h2 className="text-2xl font-serif font-bold mt-1">{committee.shortName}</h2>
          <p className="text-sm text-muted-foreground">{committee.name}</p>
          {parentHref ? (
            <Link href={parentHref} className="text-sm text-accent hover:underline mt-1 inline-block">
              Parent committee →
            </Link>
          ) : null}
        </div>
        <div className="text-sm space-y-1">
          {chair ? (
            <p>
              <span className="text-muted-foreground">Chair </span>
              <Link href={`/committees/m/${chair.member.id}`} className="font-semibold hover:underline">
                {chair.member.name}
              </Link>
              <span className="text-muted-foreground"> ({chair.member.party}-{chair.member.state})</span>
            </p>
          ) : null}
          {ranking ? (
            <p>
              <span className="text-muted-foreground">Ranking </span>
              <Link href={`/committees/m/${ranking.member.id}`} className="font-semibold hover:underline">
                {ranking.member.name}
              </Link>
              <span className="text-muted-foreground"> ({ranking.member.party}-{ranking.member.state})</span>
            </p>
          ) : null}
          {committee.url ? (
            <a
              href={committee.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-accent hover:underline print:hidden"
            >
              Official committee site <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : null}
        </div>
      </div>

      {showJurisdiction && committee.jurisdiction ? (
        <p className="text-sm leading-relaxed text-foreground/90 border-t border-border/40 pt-4">
          {committee.jurisdiction}
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <SideRail side="majority">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] mb-2">
            Majority · {majority.length}
          </h3>
          {majority.length === 0 ? (
            <p className="text-sm text-muted-foreground">No majority seats in this file.</p>
          ) : (
            majority.map((seat) => (
              <MemberRow
                key={`${seat.memberId}-${seat.rank}`}
                member={seat.member}
                title={seat.title}
                href={`/committees/m/${seat.member.id}`}
              />
            ))
          )}
        </SideRail>
        <SideRail side="minority">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] mb-2">
            Minority · {minority.length}
          </h3>
          {minority.length === 0 ? (
            <p className="text-sm text-muted-foreground">No minority seats in this file.</p>
          ) : (
            minority.map((seat) => (
              <MemberRow
                key={`${seat.memberId}-${seat.rank}`}
                member={seat.member}
                title={seat.title}
                href={`/committees/m/${seat.member.id}`}
              />
            ))
          )}
        </SideRail>
      </div>

      {subs.length > 0 ? (
        <div className="print:break-before-page">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Subcommittees</h3>
          <ul className="grid gap-2 sm:grid-cols-2">
            {subs.map((sub) => {
              const lead = getLeadership(sub.id)
              return (
                <li key={sub.id}>
                  <Link
                    href={`/committees/c/${sub.id}`}
                    className={cn(
                      'block rounded-lg border border-border/60 bg-card/50 px-3 py-3 hover:border-primary/50 transition-colors',
                    )}
                  >
                    <p className="font-semibold text-sm leading-snug">{sub.shortName}</p>
                    {lead.chair ? (
                      <p className="text-xs text-muted-foreground mt-1">
                        {titleLabel(lead.chair.title) || 'Chair'} {lead.chair.member.last} ({lead.chair.member.party}-{lead.chair.member.state})
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground mt-1">No chair listed</p>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ) : null}
    </article>
  )
}
