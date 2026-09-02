export type Chamber = 'house' | 'senate' | 'joint'
export type Side = 'majority' | 'minority'
export type PartyLetter = 'R' | 'D' | 'I'
export type SeatTitle = 'chair' | 'ranking' | 'vice' | 'exOfficio' | 'coChair' | 'other'

export type Member = {
  id: string
  first: string
  last: string
  name: string
  party: PartyLetter
  state: string
  chamber: 'house' | 'senate'
  district: number | null
  url: string | null
}

export type Committee = {
  id: string
  parentId: string | null
  name: string
  shortName: string
  type: Chamber
  url: string | null
  minorityUrl: string | null
  jurisdiction: string | null
  nicknames: string[]
}

export type Seat = {
  committeeId: string
  memberId: string
  side: Side
  rank: number
  title: SeatTitle | null
}

export type RosterFile = {
  congress: number
  generatedAt: string
  sources: {
    committees: string
    membership: string
    legislators: string
  }
  members: Member[]
  committees: Committee[]
  seats: Seat[]
}

export type Leadership = {
  id: string
  name: string
  party: PartyLetter
  state: string
  chamber: 'house' | 'senate'
  district: number | null
  title: SeatTitle | null
}

export type DirectoryFilters = {
  query: string
  chamber: 'all' | Chamber
  side: 'all' | Side
  chairsOnly: boolean
}

export type DirectoryView = 'member' | 'committee' | 'issue'
