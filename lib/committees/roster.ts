import rosterFile from '@/data/congress-119.json'
import { getGavelTopics, type GavelTopic } from '@/lib/committees/gavel'
import type {
  Chamber,
  Committee,
  DirectoryFilters,
  Member,
  RosterFile,
  Seat,
  SeatTitle,
} from '@/lib/committees/types'

const roster = rosterFile as RosterFile

export function getCongress(): number {
  return roster.congress
}

export function getGeneratedAt(): string {
  return roster.generatedAt
}

export function getSources() {
  return roster.sources
}

export function getMembers(): Member[] {
  return roster.members
}

export function getCommittees(): Committee[] {
  return roster.committees
}

export function getStandingCommittees(): Committee[] {
  return roster.committees.filter((c) => !c.parentId)
}

export function getMember(id: string): Member | undefined {
  return memberById.get(id)
}

export function getCommittee(id: string): Committee | undefined {
  return committeeById.get(id)
}

export { getGavelTopic, getGavelTopics, getIssueTopics } from '@/lib/committees/gavel'
export type { GavelCommittee, GavelTopic, IssueTopic } from '@/lib/committees/gavel'

const memberById = new Map(roster.members.map((m) => [m.id, m]))
const committeeById = new Map(roster.committees.map((c) => [c.id, c]))
const seatsByMember = new Map<string, Seat[]>()
const seatsByCommittee = new Map<string, Seat[]>()

for (const seat of roster.seats) {
  const memberSeats = seatsByMember.get(seat.memberId)
  if (memberSeats) memberSeats.push(seat)
  else seatsByMember.set(seat.memberId, [seat])

  const committeeSeats = seatsByCommittee.get(seat.committeeId)
  if (committeeSeats) committeeSeats.push(seat)
  else seatsByCommittee.set(seat.committeeId, [seat])
}

const TITLE_LABEL: Record<SeatTitle, string> = {
  chair: 'Chair',
  ranking: 'Ranking',
  vice: 'Vice Chair',
  exOfficio: 'Ex officio',
  coChair: 'Co-chair',
  other: '',
}

export function titleLabel(title: SeatTitle | null | undefined): string | null {
  if (!title || title === 'other') return null
  return TITLE_LABEL[title]
}

export function isChairTitle(title: SeatTitle | null | undefined): boolean {
  return title === 'chair' || title === 'coChair'
}

export function partyName(party: Member['party']): string {
  if (party === 'R') return 'Republican'
  if (party === 'D') return 'Democrat'
  return 'Independent'
}

export function chamberLabel(chamber: Chamber): string {
  if (chamber === 'house') return 'House'
  if (chamber === 'senate') return 'Senate'
  return 'Joint'
}

export function formatUpdated(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

export function memberCitation(member: Pick<Member, 'name' | 'party' | 'state' | 'chamber' | 'district'>): string {
  if (member.chamber === 'house' && member.district != null) {
    return `${member.name} (${member.party}-${member.state}-${member.district})`
  }
  return `${member.name} (${member.party}-${member.state})`
}

export function memberShortCitation(member: Pick<Member, 'last' | 'party' | 'state' | 'chamber' | 'district'>): string {
  if (member.chamber === 'house' && member.district != null) {
    return `${member.last} (${member.party}-${member.state}-${member.district})`
  }
  return `${member.last} (${member.party}-${member.state})`
}

export type OccupiedSeat = Seat & {
  member: Member
}

export function getCommitteeSeats(committeeId: string): OccupiedSeat[] {
  return (seatsByCommittee.get(committeeId) || [])
    .map((seat) => {
      const member = memberById.get(seat.memberId)
      if (!member) return null
      return { ...seat, member }
    })
    .filter((row): row is OccupiedSeat => Boolean(row))
}

export function splitSides(seats: OccupiedSeat[]): { majority: OccupiedSeat[]; minority: OccupiedSeat[] } {
  return {
    majority: seats.filter((s) => s.side === 'majority'),
    minority: seats.filter((s) => s.side === 'minority'),
  }
}

export function getLeadership(committeeId: string): { chair: OccupiedSeat | null; ranking: OccupiedSeat | null } {
  const seats = getCommitteeSeats(committeeId)
  const chair = seats.find((s) => isChairTitle(s.title)) || null
  const ranking = seats.find((s) => s.title === 'ranking') || null
  return { chair, ranking }
}

export type MemberAssignment = OccupiedSeat & {
  committee: Committee
}

export function getMemberAssignments(memberId: string): MemberAssignment[] {
  return (seatsByMember.get(memberId) || [])
    .map((seat) => {
      const committee = committeeById.get(seat.committeeId)
      if (!committee) return null
      return { ...seat, committee }
    })
    .filter((row): row is MemberAssignment => Boolean(row))
    .sort((a, b) => {
      const ap = a.committee.parentId ? 1 : 0
      const bp = b.committee.parentId ? 1 : 0
      if (ap !== bp) return ap - bp
      return a.committee.shortName.localeCompare(b.committee.shortName)
    })
}

export function getSubcommittees(parentId: string): Committee[] {
  return roster.committees.filter((c) => c.parentId === parentId)
}

export function issuesForCommittee(committeeId: string): GavelTopic[] {
  const committee = committeeById.get(committeeId)
  const parentId = committee?.parentId
  return getGavelTopics().filter((topic) =>
    topic.committees.some((c) => {
      if (c.id === committeeId || c.id === parentId) return true
      return c.focus.some((f) => f.id === committeeId)
    }),
  )
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function haystackForMember(member: Member): string {
  const assignments = getMemberAssignments(member.id)
  const committeeBits = assignments.flatMap((a) => [
    a.committee.id,
    a.committee.name,
    a.committee.shortName,
    ...(a.committee.nicknames || []),
  ])
  return normalize(
    [
      member.last,
      member.first,
      member.name,
      member.party,
      partyName(member.party),
      member.state,
      member.chamber,
      chamberLabel(member.chamber),
      member.district != null ? String(member.district) : '',
      member.id,
      ...committeeBits,
    ].join(' '),
  )
}

function haystackForCommittee(committee: Committee): string {
  const parent = committee.parentId ? committeeById.get(committee.parentId) : null
  return normalize(
    [
      committee.id,
      committee.name,
      committee.shortName,
      committee.type,
      chamberLabel(committee.type),
      parent?.name || '',
      parent?.shortName || '',
      ...(committee.nicknames || []),
      ...(parent?.nicknames || []),
    ].join(' '),
  )
}

const memberHaystack = new Map(roster.members.map((m) => [m.id, haystackForMember(m)]))
const committeeHaystack = new Map(roster.committees.map((c) => [c.id, haystackForCommittee(c)]))

function matchesQuery(haystack: string, query: string): boolean {
  const tokens = normalize(query).split(' ').filter(Boolean)
  if (tokens.length === 0) return true
  return tokens.every((token) => haystack.includes(token))
}

function memberMatchesFilters(member: Member, filters: DirectoryFilters): boolean {
  if (filters.chamber !== 'all' && member.chamber !== filters.chamber) return false
  const assignments = getMemberAssignments(member.id)
  if (filters.side !== 'all' && !assignments.some((a) => a.side === filters.side && !a.committee.parentId)) {
    return false
  }
  if (filters.chairsOnly && !assignments.some((a) => isChairTitle(a.title) && !a.committee.parentId)) {
    return false
  }
  return matchesQuery(memberHaystack.get(member.id) || '', filters.query)
}

function committeeMatchesFilters(committee: Committee, filters: DirectoryFilters): boolean {
  if (filters.chamber !== 'all' && committee.type !== filters.chamber) return false
  if (filters.side !== 'all') {
    const seats = getCommitteeSeats(committee.id)
    if (!seats.some((s) => s.side === filters.side)) return false
  }
  if (filters.chairsOnly) {
    const { chair } = getLeadership(committee.id)
    if (!chair) return false
  }
  return matchesQuery(committeeHaystack.get(committee.id) || '', filters.query)
}

export function searchMembers(filters: DirectoryFilters, limit = 40): Member[] {
  return roster.members.filter((m) => memberMatchesFilters(m, filters)).slice(0, limit)
}

export function searchCommittees(filters: DirectoryFilters, standingOnly = true): Committee[] {
  const pool = standingOnly ? getStandingCommittees() : roster.committees
  return pool.filter((c) => committeeMatchesFilters(c, filters))
}

export function searchAll(filters: DirectoryFilters): {
  members: Member[]
  committees: Committee[]
  issues: GavelTopic[]
} {
  const q = normalize(filters.query)
  const issues = getGavelTopics().filter((topic) => {
    if (!q) return true
    const blob = normalize(
      [
        topic.topicId,
        topic.headline,
        topic.blurb,
        ...topic.committees.flatMap((c) => [c.id, c.name, c.why]),
      ].join(' '),
    )
    return q.split(' ').filter(Boolean).every((token) => blob.includes(token))
  })
  return {
    members: searchMembers(filters),
    committees: searchCommittees(filters, true),
    issues,
  }
}

export const OFFICIAL_LINKS = {
  houseClerk: 'https://clerk.house.gov/committee_info/commfaq',
  senate: 'https://www.senate.gov/committees/',
  congress: 'https://www.congress.gov/committees',
  sourceRepo: 'https://github.com/unitedstates/congress-legislators',
} as const
