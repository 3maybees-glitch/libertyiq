import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ExternalLink } from 'lucide-react'
import { CommitteesShell } from '@/components/committees/committees-shell'
import { PartyPill } from '@/components/committees/member-row'
import {
  chamberLabel,
  getMember,
  getMemberAssignments,
  getMembers,
  isChairTitle,
  issuesForCommittee,
  memberCitation,
  partyName,
  titleLabel,
} from '@/lib/committees/roster'
import { topics } from '@/lib/types'

type Props = { params: Promise<{ bioguide: string }> }

export function generateStaticParams() {
  return getMembers().map((m) => ({ bioguide: m.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { bioguide } = await params
  const member = getMember(bioguide)
  if (!member) return { title: 'Member not found | LibertyIQ' }
  const standing = getMemberAssignments(bioguide).filter((a) => !a.committee.parentId)
  const names = standing.map((a) => a.committee.shortName).join('; ')
  return {
    title: `${member.name} committees | LibertyIQ`,
    description: `${memberCitation(member)} — ${partyName(member.party)}. Committees: ${names || 'none listed'}.`,
  }
}

export default async function MemberPage({ params }: Props) {
  const { bioguide } = await params
  const member = getMember(bioguide)
  if (!member) notFound()

  const assignments = getMemberAssignments(member.id)
  const standing = assignments.filter((a) => !a.committee.parentId)
  const subs = assignments.filter((a) => a.committee.parentId)

  const issueIds = new Set<string>()
  for (const a of standing) {
    for (const topic of issuesForCommittee(a.committee.id)) issueIds.add(topic.topicId)
  }

  return (
    <CommitteesShell
      kicker={`${member.chamber === 'house' ? 'Representative' : 'Senator'} · ${member.id}`}
      title={member.name}
      description={`${partyName(member.party)} · ${member.chamber === 'house' ? `House ${member.state}-${member.district}` : `Senate ${member.state}`}`}
      actions={
        <Link href="/committees?view=member" className="text-sm font-semibold text-accent hover:underline">
          All members
        </Link>
      }
    >
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <PartyPill party={member.party} className="h-7 min-w-7 text-sm" />
        <p className="text-sm text-muted-foreground">{memberCitation(member)}</p>
        {member.url ? (
          <a
            href={member.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-accent hover:underline print:hidden"
          >
            Official site <ExternalLink className="h-3.5 w-3.5" />
          </a>
        ) : null}
      </div>

      <section>
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
          Standing committees
        </h2>
        {standing.length === 0 ? (
          <p className="text-sm text-muted-foreground">No standing committee assignments in this roster.</p>
        ) : (
          <ul className="divide-y divide-border/40 rounded-xl border border-border/60 bg-card/60">
            {standing.map((a) => (
              <li key={a.committeeId}>
                <Link
                  href={`/committees/c/${a.committee.id}`}
                  className="flex flex-wrap items-center gap-2 px-4 py-3 hover:bg-white/5"
                >
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground w-16">
                    {chamberLabel(a.committee.type)}
                  </span>
                  <span className="font-semibold">{a.committee.shortName}</span>
                  <span className="text-sm text-muted-foreground capitalize">{a.side}</span>
                  {titleLabel(a.title) ? (
                    <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-accent">
                      {titleLabel(a.title)}
                    </span>
                  ) : isChairTitle(a.title) ? (
                    <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-accent">Chair</span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {subs.length > 0 ? (
        <section className="mt-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
            Subcommittees
          </h2>
          <ul className="divide-y divide-border/40 rounded-xl border border-border/60 bg-card/60">
            {subs.map((a) => (
              <li key={a.committeeId}>
                <Link
                  href={`/committees/c/${a.committee.id}`}
                  className="flex flex-wrap items-center gap-2 px-4 py-3 hover:bg-white/5"
                >
                  <span className="font-semibold">{a.committee.shortName}</span>
                  {titleLabel(a.title) ? (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-accent">
                      {titleLabel(a.title)}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {issueIds.size > 0 ? (
        <section className="mt-8 print:hidden">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
            Related LibertyIQ issues
          </h2>
          <ul className="flex flex-wrap gap-2">
            {[...issueIds].map((id) => {
              const title = topics.find((t) => t.id === id)?.title ?? id
              return (
                <li key={id}>
                  <Link
                    href={`/committees?view=issue&issue=${id}`}
                    className="inline-flex rounded-full border border-border/70 bg-card/60 px-3 py-1 text-sm font-semibold hover:border-primary/50"
                  >
                    {title}
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      ) : null}
    </CommitteesShell>
  )
}
