'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Gavel } from 'lucide-react'
import drills from '@/lib/committees/drills.json'
import { getGavelTopics } from '@/lib/committees/gavel'
import { topics } from '@/lib/types'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type Drill = (typeof drills)[number]

function topicTitle(id: string) {
  return topics.find((t) => t.id === id)?.title ?? id
}

function buildPrompt(issueId: string | null, committee: Drill, subcommitteeId: string | null): string {
  const issue = issueId ? topicTitle(issueId) : null
  const sub = committee.subcommittees.find((s) => s.id === subcommitteeId) || null
  const chair = committee.chair
  const ranking = committee.ranking
  const gavelName = chair
    ? `${chair.name} (${chair.party}-${chair.state})`
    : 'the chair'
  const rankingName = ranking ? `${ranking.name} (${ranking.party}-${ranking.state})` : 'the ranking member'
  const panel = sub ? `${committee.name} — ${sub.name}` : committee.name
  const subChair = sub?.chair
    ? ` The subcommittee chair is ${sub.chair.name} (${sub.chair.party}-${sub.chair.state}).`
    : ''
  const issueBit = issue
    ? ` You are arguing the LibertyIQ ${issue} brief.`
    : ''

  return `You have 90 seconds with a member of the ${committee.chamber === 'house' ? 'House' : committee.chamber === 'senate' ? 'Senate' : 'Joint'} ${panel} majority. Chair: ${gavelName}. Ranking: ${rankingName}.${subChair}${issueBit} Open with who holds the gavel, land one fact, then make the ask.`
}

export function CommitteeDrill({ onUsePrompt }: { onUsePrompt: (prompt: string) => void }) {
  const issueTopics = getGavelTopics()
  const [issueId, setIssueId] = useState<string>(issueTopics[0]?.topicId ?? 'pro-life')
  const [committeeId, setCommitteeId] = useState<string>('')
  const [subcommitteeId, setSubcommitteeId] = useState<string>('')

  const allowedIds = useMemo(() => {
    const topic = issueTopics.find((t) => t.topicId === issueId)
    const ids = new Set<string>()
    for (const c of topic?.committees || []) {
      ids.add(c.parentId || c.id)
      ids.add(c.id)
    }
    return ids
  }, [issueId, issueTopics])

  const standing = useMemo(
    () => drills.filter((d) => d.chamber !== 'joint' && (allowedIds.has(d.id) || allowedIds.size === 0)),
    [allowedIds],
  )

  const committee = standing.find((d) => d.id === committeeId) || standing[0]
  const activeCommitteeId = committee?.id || ''
  const prompt = committee ? buildPrompt(issueId, committee, subcommitteeId || null) : ''

  return (
    <div className="rounded-xl border border-border/70 bg-card/70 p-4 space-y-3">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent flex items-center gap-1.5">
        <Gavel className="h-3.5 w-3.5" />
        Committee drill
      </p>
      <p className="text-sm text-muted-foreground">
        Pick an issue and a panel. The prompt names the chair so you practice as if you have ninety seconds with the majority.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground space-y-1">
          <span>Issue</span>
          <Select
            value={issueId}
            onValueChange={(value) => {
              setIssueId(value)
              setCommitteeId('')
              setSubcommitteeId('')
            }}
          >
            <SelectTrigger className="w-full font-normal normal-case tracking-normal text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {issueTopics.map((t) => (
                <SelectItem key={t.topicId} value={t.topicId}>
                  {topicTitle(t.topicId)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground space-y-1">
          <span>Committee</span>
          <Select
            value={activeCommitteeId}
            onValueChange={(value) => {
              setCommitteeId(value)
              setSubcommitteeId('')
            }}
          >
            <SelectTrigger className="w-full font-normal normal-case tracking-normal text-sm">
              <SelectValue placeholder="Select a committee" />
            </SelectTrigger>
            <SelectContent>
              {standing.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.chamber === 'house' ? 'House' : 'Senate'} {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
      </div>
      {committee && committee.subcommittees.length > 0 ? (
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground space-y-1 block">
          <span>Subcommittee (optional)</span>
          <Select value={subcommitteeId || 'none'} onValueChange={(v) => setSubcommitteeId(v === 'none' ? '' : v)}>
            <SelectTrigger className="w-full font-normal normal-case tracking-normal text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Full committee</SelectItem>
              {committee.subcommittees.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
      ) : null}
      <p className="text-sm leading-relaxed bg-background/40 rounded-lg px-3 py-2">{prompt}</p>
      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" onClick={() => prompt && onUsePrompt(prompt)}>
          Use this prompt
        </Button>
        {committee ? (
          <Button asChild size="sm" variant="outline">
            <Link href={`/committees/c/${committee.id}`}>Open roster</Link>
          </Button>
        ) : null}
      </div>
    </div>
  )
}
