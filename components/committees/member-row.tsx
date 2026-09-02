import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { Member, SeatTitle, Side } from '@/lib/committees/types'
import { memberShortCitation, titleLabel } from '@/lib/committees/roster'

export function PartyPill({ party, className }: { party: Member['party']; className?: string }) {
  const label = party === 'R' ? 'R' : party === 'D' ? 'D' : 'I'
  return (
    <span
      className={cn(
        'inline-flex h-5 min-w-5 items-center justify-center rounded px-1 text-[10px] font-bold tracking-wide',
        party === 'R' && 'bg-[#B22234] text-white',
        party === 'D' && 'bg-[#3C3B6E] text-white',
        party === 'I' && 'bg-muted text-foreground',
        className,
      )}
    >
      {label}
    </span>
  )
}

export function SideRail({ side, children }: { side: Side; children: React.ReactNode }) {
  return (
    <section
      className={cn(
        'rounded-lg border border-border/60 bg-card/60 pl-3 pr-3 py-3',
        side === 'majority' ? 'committee-rail-majority' : 'committee-rail-minority',
      )}
    >
      {children}
    </section>
  )
}

export function MemberRow({
  member,
  href,
  title,
  compact,
}: {
  member: Member
  href?: string
  title?: SeatTitle | null
  compact?: boolean
}) {
  const label = titleLabel(title)
  const inner = (
    <>
      <PartyPill party={member.party} />
      <span className={cn('min-w-0', compact ? 'text-sm' : 'text-sm sm:text-[15px]')}>
        <span className="font-semibold text-foreground">{member.last}</span>
        <span className="text-muted-foreground">, {member.first}</span>
        <span className="text-muted-foreground"> · {memberShortCitation(member).split(' (')[1]?.replace(')', '')}</span>
      </span>
      {label ? (
        <span className="ml-auto shrink-0 text-[10px] font-bold uppercase tracking-wider text-accent">{label}</span>
      ) : null}
    </>
  )

  const className = cn(
    'flex items-center gap-2 py-1.5 border-b border-border/30 last:border-0',
    href && 'hover:bg-white/5 rounded-md px-1 -mx-1 transition-colors',
  )

  if (href) {
    return (
      <Link href={href} className={className}>
        {inner}
      </Link>
    )
  }

  return <div className={className}>{inner}</div>
}
