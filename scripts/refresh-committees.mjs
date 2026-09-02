#!/usr/bin/env node
/**
 * Fetch unitedstates/congress-legislators current files and compact them
 * into LibertyIQ roster JSON. Does not scrape on page view.
 *
 *   pnpm committees:refresh
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DATA_DIR = join(ROOT, 'data')
const PUBLIC_DATA = join(ROOT, 'public', 'data')
const NICKNAMES_PATH = join(ROOT, 'lib/committees/nicknames.json')
const ISSUE_MAP_PATH = join(ROOT, 'lib/committees/issue-map.json')

const SOURCES = {
  committees: 'https://unitedstates.github.io/congress-legislators/committees-current.json',
  membership: 'https://unitedstates.github.io/congress-legislators/committee-membership-current.json',
  legislators: 'https://unitedstates.github.io/congress-legislators/legislators-current.json',
}

const PARTY_LETTER = {
  Republican: 'R',
  Democrat: 'D',
  Independent: 'I',
}

function stripCommitteePrefix(name) {
  return name
    .replace(/^House Permanent Select Committee on /i, '')
    .replace(/^House Select Subcommittee to /i, '')
    .replace(/^House Select Committee on (the )?/i, '')
    .replace(/^House Committee on the /i, '')
    .replace(/^House Committee on /i, '')
    .replace(/^Senate Select Committee on /i, '')
    .replace(/^Senate Special Committee on /i, '')
    .replace(/^Senate Committee on the /i, '')
    .replace(/^Senate Committee on /i, '')
    .replace(/^United States Senate Caucus on /i, '')
    .replace(/^Joint Committee of Congress on the /i, '')
    .replace(/^Joint Committee on /i, '')
    .replace(/^Commission on /i, '')
    .trim()
}

function normalizeTitle(raw) {
  if (!raw) return null
  const s = String(raw).toLowerCase()
  if (s.includes('ex officio')) return 'exOfficio'
  if (s.includes('ranking')) return 'ranking'
  if (s.includes('vice')) return 'vice'
  if (s.includes('cochair') || s.includes('co-chair') || s.includes('cochairman')) return 'coChair'
  if (s.includes('chair')) return 'chair'
  return 'other'
}

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { 'user-agent': 'LibertyIQ.org committees refresh (https://libertyiq.org)' },
  })
  if (!res.ok) throw new Error(`Fetch ${url} failed: ${res.status} ${res.statusText}`)
  return res.json()
}

function currentTerm(legislator) {
  const terms = legislator.terms || []
  return terms[terms.length - 1] || null
}

function buildRoster({ committees, membership, legislators, nicknames, generatedAt }) {
  const members = []
  const memberById = new Map()

  for (const leg of legislators) {
    const term = currentTerm(leg)
    if (!term) continue
    const bioguide = leg.id?.bioguide
    if (!bioguide) continue
    const chamber = term.type === 'sen' ? 'senate' : 'house'
    const record = {
      id: bioguide,
      first: leg.name?.first || '',
      last: leg.name?.last || '',
      name: leg.name?.official_full || `${leg.name?.first || ''} ${leg.name?.last || ''}`.trim(),
      party: PARTY_LETTER[term.party] || term.party?.[0] || 'I',
      state: term.state,
      chamber,
      district: chamber === 'house' ? term.district ?? null : null,
      url: term.url || null,
    }
    members.push(record)
    memberById.set(bioguide, record)
  }

  members.sort((a, b) => a.last.localeCompare(b.last) || a.first.localeCompare(b.first))

  const committeeList = []
  const committeeById = new Map()

  for (const c of committees) {
    const id = c.thomas_id
    if (!id) continue
    const parent = {
      id,
      parentId: null,
      name: c.name,
      shortName: stripCommitteePrefix(c.name),
      type: c.type,
      url: c.url || null,
      minorityUrl: c.minority_url || null,
      jurisdiction: c.jurisdiction || null,
      nicknames: nicknames[id] || [],
    }
    committeeList.push(parent)
    committeeById.set(id, parent)

    for (const sub of c.subcommittees || []) {
      const subId = `${id}${sub.thomas_id}`
      const subRec = {
        id: subId,
        parentId: id,
        name: sub.name,
        shortName: sub.name,
        type: c.type,
        url: c.url || null,
        minorityUrl: c.minority_url || null,
        jurisdiction: null,
        nicknames: nicknames[subId] || [],
      }
      committeeList.push(subRec)
      committeeById.set(subId, subRec)
    }
  }

  const seats = []
  for (const [committeeId, rows] of Object.entries(membership)) {
    if (!committeeById.has(committeeId)) {
      // Membership file can include ids not in committees-current; keep a stub.
      committeeList.push({
        id: committeeId,
        parentId: null,
        name: committeeId,
        shortName: committeeId,
        type: committeeId.startsWith('HS') || committeeId.startsWith('HL') ? 'house'
          : committeeId.startsWith('SS') || committeeId.startsWith('SL') || committeeId.startsWith('SP') || committeeId.startsWith('SC') ? 'senate'
          : 'joint',
        url: null,
        minorityUrl: null,
        jurisdiction: null,
        nicknames: nicknames[committeeId] || [],
      })
      committeeById.set(committeeId, committeeList[committeeList.length - 1])
    }
    for (const row of rows) {
      if (!row.bioguide) continue
      seats.push({
        committeeId,
        memberId: row.bioguide,
        side: row.party === 'minority' ? 'minority' : 'majority',
        rank: Number.isFinite(row.rank) ? row.rank : 99,
        title: normalizeTitle(row.title),
      })
    }
  }

  seats.sort((a, b) => {
    if (a.committeeId !== b.committeeId) return a.committeeId.localeCompare(b.committeeId)
    if (a.side !== b.side) return a.side === 'majority' ? -1 : 1
    return a.rank - b.rank
  })

  return {
    congress: 119,
    generatedAt,
    sources: SOURCES,
    members,
    committees: committeeList,
    seats,
  }
}

function leadershipFor(seats, memberById) {
  const chairSeat = seats.find((s) => s.title === 'chair' || s.title === 'coChair')
  const rankingSeat = seats.find((s) => s.title === 'ranking')
  const pick = (seat) => {
    if (!seat) return null
    const m = memberById.get(seat.memberId)
    if (!m) return null
    return {
      id: m.id,
      name: m.name,
      party: m.party,
      state: m.state,
      chamber: m.chamber,
      district: m.district,
      title: seat.title,
    }
  }
  return { chair: pick(chairSeat), ranking: pick(rankingSeat) }
}

function buildCccpFeed(roster, origin) {
  const memberById = new Map(roster.members.map((m) => [m.id, m]))
  const committeeById = new Map(roster.committees.map((c) => [c.id, c]))
  const seatsByMember = new Map()
  const seatsByCommittee = new Map()

  for (const seat of roster.seats) {
    if (!seatsByMember.has(seat.memberId)) seatsByMember.set(seat.memberId, [])
    seatsByMember.get(seat.memberId).push(seat)
    if (!seatsByCommittee.has(seat.committeeId)) seatsByCommittee.set(seat.committeeId, [])
    seatsByCommittee.get(seat.committeeId).push(seat)
  }

  const members = roster.members.map((m) => {
    const standing = (seatsByMember.get(m.id) || []).filter((s) => {
      const c = committeeById.get(s.committeeId)
      return c && !c.parentId
    })
    return {
      bioguide: m.id,
      name: m.name,
      party: m.party,
      state: m.state,
      chamber: m.chamber,
      district: m.district,
      committees: standing.map((s) => {
        const c = committeeById.get(s.committeeId)
        return {
          id: s.committeeId,
          name: c?.shortName || s.committeeId,
          title: s.title,
          href: `${origin}/committees/c/${s.committeeId}`,
        }
      }),
      href: `${origin}/committees/m/${m.id}`,
    }
  })

  const committees = roster.committees
    .filter((c) => !c.parentId)
    .map((c) => {
      const { chair, ranking } = leadershipFor(seatsByCommittee.get(c.id) || [], memberById)
      return {
        id: c.id,
        name: c.shortName,
        fullName: c.name,
        chamber: c.type,
        url: c.url,
        href: `${origin}/committees/c/${c.id}`,
        chair,
        ranking,
      }
    })

  return {
    congress: roster.congress,
    updated: roster.generatedAt,
    directory: `${origin}/committees`,
    members,
    committees,
  }
}

function buildGavel(roster, issueMap) {
  const memberById = new Map(roster.members.map((m) => [m.id, m]))
  const committeeById = new Map(roster.committees.map((c) => [c.id, c]))
  const seatsByCommittee = new Map()
  for (const seat of roster.seats) {
    if (!seatsByCommittee.has(seat.committeeId)) seatsByCommittee.set(seat.committeeId, [])
    seatsByCommittee.get(seat.committeeId).push(seat)
  }

  const topics = {}
  for (const topic of issueMap.topics) {
    topics[topic.topicId] = {
      topicId: topic.topicId,
      headline: topic.headline,
      blurb: topic.blurb,
      committees: topic.committees.map((ref) => {
        const c = committeeById.get(ref.id)
        const { chair, ranking } = leadershipFor(seatsByCommittee.get(ref.id) || [], memberById)
        const focus = (ref.focusIds || []).map((fid) => {
          const fc = committeeById.get(fid)
          const lead = leadershipFor(seatsByCommittee.get(fid) || [], memberById)
          return {
            id: fid,
            name: fc?.shortName || fid,
            chair: lead.chair,
          }
        })
        return {
          id: ref.id,
          name: c?.shortName || ref.id,
          fullName: c?.name || ref.id,
          type: c?.type || 'house',
          parentId: c?.parentId || null,
          why: ref.why,
          chair,
          ranking,
          focus,
        }
      }),
    }
  }
  return { congress: roster.congress, generatedAt: roster.generatedAt, topics }
}

function buildDrills(roster) {
  const memberById = new Map(roster.members.map((m) => [m.id, m]))
  const seatsByCommittee = new Map()
  for (const seat of roster.seats) {
    if (!seatsByCommittee.has(seat.committeeId)) seatsByCommittee.set(seat.committeeId, [])
    seatsByCommittee.get(seat.committeeId).push(seat)
  }

  const standing = roster.committees.filter((c) => !c.parentId)
  return standing.map((c) => {
    const seats = seatsByCommittee.get(c.id) || []
    const { chair, ranking } = leadershipFor(seats, memberById)
    const subs = roster.committees
      .filter((s) => s.parentId === c.id)
      .map((s) => {
        const lead = leadershipFor(seatsByCommittee.get(s.id) || [], memberById)
        return { id: s.id, name: s.shortName, chair: lead.chair }
      })
    const majorityParty = chair?.party || 'R'
    return {
      id: c.id,
      name: c.shortName,
      fullName: c.name,
      chamber: c.type,
      majorityParty,
      chair,
      ranking,
      subcommittees: subs,
    }
  })
}

function validateIssueIds(roster, issueMap) {
  const ids = new Set(roster.committees.map((c) => c.id))
  const missing = []
  for (const topic of issueMap.topics) {
    for (const ref of topic.committees) {
      if (!ids.has(ref.id)) missing.push(`${topic.topicId}:${ref.id}`)
      for (const fid of ref.focusIds || []) {
        if (!ids.has(fid)) missing.push(`${topic.topicId}:focus:${fid}`)
      }
    }
  }
  if (missing.length) {
    throw new Error(`Issue map points at unknown committee ids:\n  ${missing.join('\n  ')}`)
  }
}

async function main() {
  const generatedAt = new Date().toISOString()
  console.log('Fetching congress-legislators current files…')
  const [committees, membership, legislators] = await Promise.all([
    fetchJson(SOURCES.committees),
    fetchJson(SOURCES.membership),
    fetchJson(SOURCES.legislators),
  ])
  const nicknames = JSON.parse(readFileSync(NICKNAMES_PATH, 'utf8'))
  const issueMap = JSON.parse(readFileSync(ISSUE_MAP_PATH, 'utf8'))

  const roster = buildRoster({ committees, membership, legislators, nicknames, generatedAt })
  validateIssueIds(roster, issueMap)

  mkdirSync(DATA_DIR, { recursive: true })
  mkdirSync(PUBLIC_DATA, { recursive: true })
  mkdirSync(join(ROOT, 'lib/committees'), { recursive: true })

  const rosterPath = join(DATA_DIR, 'congress-119.json')
  writeFileSync(rosterPath, JSON.stringify(roster))
  writeFileSync(join(DATA_DIR, 'gavel.json'), JSON.stringify(buildGavel(roster, issueMap)))
  writeFileSync(join(ROOT, 'lib/committees/drills.json'), JSON.stringify(buildDrills(roster)))

  const origin = 'https://libertyiq.org'
  writeFileSync(join(PUBLIC_DATA, 'committees.json'), JSON.stringify(buildCccpFeed(roster, origin)))

  const kb = (p) => `${(readFileSync(p).length / 1024).toFixed(1)} KB`
  console.log(`Wrote ${rosterPath} (${kb(rosterPath)})`)
  console.log(`  members=${roster.members.length} committees=${roster.committees.length} seats=${roster.seats.length}`)
  console.log(`  public/data/committees.json ${kb(join(PUBLIC_DATA, 'committees.json'))}`)
  console.log(`  data/gavel.json ${kb(join(DATA_DIR, 'gavel.json'))}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
