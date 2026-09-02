import gavelFile from '@/data/gavel.json'
import issueMapFile from '@/lib/committees/issue-map.json'
import type { Chamber, Leadership } from '@/lib/committees/types'

export type GavelFocus = {
  id: string
  name: string
  chair: Leadership | null
}

export type GavelCommittee = {
  id: string
  name: string
  fullName: string
  type: Chamber
  parentId: string | null
  why: string
  chair: Leadership | null
  ranking: Leadership | null
  focus: GavelFocus[]
}

export type GavelTopic = {
  topicId: string
  headline: string
  blurb: string
  committees: GavelCommittee[]
}

export type IssueTopic = {
  topicId: string
  headline: string
  blurb: string
  committees: { id: string; why: string; focusIds?: string[] }[]
}

const gavel = gavelFile as {
  congress: number
  generatedAt: string
  topics: Record<string, GavelTopic>
}

const issueMap = issueMapFile as { congress: number; topics: IssueTopic[] }

export function getIssueTopics(): IssueTopic[] {
  return issueMap.topics
}

export function getGavelTopic(topicId: string): GavelTopic | undefined {
  return gavel.topics[topicId]
}

export function getGavelTopics(): GavelTopic[] {
  return issueMap.topics.map((t) => gavel.topics[t.topicId]).filter(Boolean)
}

export function getGavelGeneratedAt(): string {
  return gavel.generatedAt
}
