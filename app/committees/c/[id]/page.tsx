import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CommitteesShell } from '@/components/committees/committees-shell'
import { CommitteeRoster } from '@/components/committees/committee-roster'
import {
  chamberLabel,
  getCommittee,
  getCommittees,
  getLeadership,
  issuesForCommittee,
} from '@/lib/committees/roster'
import { topics } from '@/lib/types'

type Props = { params: Promise<{ id: string }> }

export function generateStaticParams() {
  return getCommittees().map((c) => ({ id: c.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const committee = getCommittee(id)
  if (!committee) return { title: 'Committee not found | LibertyIQ' }
  const lead = getLeadership(id)
  const chair = lead.chair ? ` Chair: ${lead.chair.member.name}.` : ''
  return {
    title: `${chamberLabel(committee.type)} ${committee.shortName} | LibertyIQ`,
    description: `${committee.name} roster, ${congressWord()} Congress.${chair} Majority/minority members and subcommittees.`,
  }
}

function congressWord() {
  return '119th'
}

export default async function CommitteePage({ params }: Props) {
  const { id } = await params
  const committee = getCommittee(id)
  if (!committee) notFound()

  const related = issuesForCommittee(id)

  return (
    <CommitteesShell
      kicker={`${chamberLabel(committee.type)} · ${committee.id}`}
      title={committee.shortName}
      description={committee.name}
      actions={
        <Link href="/committees" className="text-sm font-semibold text-accent hover:underline">
          All committees
        </Link>
      }
    >
      <CommitteeRoster committee={committee} />

      {related.length > 0 ? (
        <section className="mt-10 print:hidden">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
            LibertyIQ issues this panel touches
          </h2>
          <ul className="flex flex-wrap gap-2">
            {related.map((topic) => {
              const title = topics.find((t) => t.id === topic.topicId)?.title ?? topic.topicId
              return (
                <li key={topic.topicId}>
                  <Link
                    href={`/committees?view=issue&issue=${topic.topicId}`}
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
