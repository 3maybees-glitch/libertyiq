#!/usr/bin/env node
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import assert from 'node:assert/strict'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

function load(rel) {
  return JSON.parse(readFileSync(join(ROOT, rel), 'utf8'))
}

function normalize(value) {
  return value.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, ' ').trim()
}

const roster = load('data/congress-119.json')
const gavel = load('data/gavel.json')
const issues = load('lib/committees/issue-map.json')
const nicknames = load('lib/committees/nicknames.json')
const cccp = load('public/data/committees.json')
const drills = load('lib/committees/drills.json')

assert.equal(roster.congress, 119)
assert.ok(roster.members.length >= 520, `expected ~535 members, got ${roster.members.length}`)
assert.ok(roster.committees.length >= 200, `expected 200+ committee rows, got ${roster.committees.length}`)
assert.ok(roster.seats.length >= 3000, `expected thousands of seats, got ${roster.seats.length}`)
assert.ok(roster.generatedAt)

const byId = new Map(roster.committees.map((c) => [c.id, c]))
for (const must of ['HSJU', 'HSIF', 'HSWM', 'SSHR', 'SSJU', 'HLIG', 'SLIN', 'HSHM']) {
  assert.ok(byId.has(must), `missing committee ${must}`)
}

assert.ok((byId.get('SSHR').nicknames || []).includes('HELP'))
assert.ok((byId.get('HLIG').nicknames || []).includes('HPSCI'))
assert.ok((byId.get('HSWM').nicknames || []).includes('Ways and Means'))

for (const topic of issues.topics) {
  assert.ok(gavel.topics[topic.topicId], `gavel missing ${topic.topicId}`)
  for (const ref of topic.committees) {
    assert.ok(byId.has(ref.id), `issue ${topic.topicId} unknown committee ${ref.id}`)
    for (const fid of ref.focusIds || []) {
      assert.ok(byId.has(fid), `issue ${topic.topicId} unknown focus ${fid}`)
    }
  }
}

const cruz = roster.members.find((m) => m.last === 'Cruz' && m.first === 'Ted')
assert.ok(cruz, 'Ted Cruz missing')
assert.equal(cruz.party, 'R')
assert.equal(cruz.state, 'TX')
assert.equal(cruz.chamber, 'senate')

const jordanSeat = roster.seats.find((s) => s.committeeId === 'HSJU' && s.title === 'chair')
assert.ok(jordanSeat, 'House Judiciary chair missing')
const jordan = roster.members.find((m) => m.id === jordanSeat.memberId)
assert.equal(jordan?.last, 'Jordan')

const cruzHay = normalize(`${cruz.last} ${cruz.first} ${cruz.name} ${cruz.state}`)
assert.ok(cruzHay.includes('cruz') && cruzHay.includes('tx'))

const helpHit = roster.committees.find((c) => (c.nicknames || []).some((n) => normalize(n) === 'help'))
assert.equal(helpHit?.id, 'SSHR')

const ways = roster.committees.find((c) => (c.nicknames || []).some((n) => normalize(n).includes('ways and means')))
assert.equal(ways?.id, 'HSWM')

assert.equal(cccp.members.length, roster.members.length)
assert.ok(cccp.directory.endsWith('/committees'))
const cccpCruz = cccp.members.find((m) => m.bioguide === cruz.id)
assert.ok(cccpCruz.href.includes(`/committees/m/${cruz.id}`))
assert.ok(cccpCruz.committees.some((c) => c.id === 'SSCM' && c.title === 'chair'))

assert.ok(drills.some((d) => d.id === 'HSIF' && d.chair))
assert.equal(Object.keys(gavel.topics).length, 14)

assert.ok(Object.keys(nicknames).length > 20)

console.log('committees validate: ok')
console.log(`  members=${roster.members.length} committees=${roster.committees.length} seats=${roster.seats.length}`)
console.log(`  generatedAt=${roster.generatedAt}`)
