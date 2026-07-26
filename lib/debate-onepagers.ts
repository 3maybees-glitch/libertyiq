/** Public PDF paths for debate one-pagers, keyed by topic id. */

export type DebateOnePager = {
  topicId: string
  title: string
  acronym: string
  filename: string
  href: string
}

export const debateOnePagers: DebateOnePager[] = [
  { topicId: 'pro-life', title: 'Pro-Life', acronym: 'ALIVE', filename: '01-pro-life.pdf' },
  { topicId: 'illegal-immigration', title: 'Illegal Immigration', acronym: 'BOLTS', filename: '02-illegal-immigration.pdf' },
  { topicId: 'second-amendment', title: 'Second Amendment', acronym: 'ARMED', filename: '03-second-amendment.pdf' },
  { topicId: 'marriage', title: 'Marriage: One Man & One Woman', acronym: 'CREED', filename: '04-marriage.pdf' },
  { topicId: 'two-sexes', title: 'Two Biological Sexes', acronym: 'FACTS', filename: '05-two-sexes.pdf' },
  { topicId: 'pro-israel', title: 'Pro-Israel', acronym: 'CLAIM', filename: '06-pro-israel.pdf' },
  { topicId: 'national-security', title: 'Strong National Security', acronym: 'GUARD', filename: '07-national-security.pdf' },
  { topicId: 'anti-climate-alarmism', title: 'Anti-Climate Alarmism', acronym: 'SENSE', filename: '08-anti-climate-alarmism.pdf' },
  { topicId: 'limited-government', title: 'Limited Government', acronym: 'LIMIT', filename: '09-limited-government.pdf' },
  { topicId: 'anti-crt', title: 'Anti-Critical Race Theory', acronym: 'LIGHT', filename: '10-anti-crt.pdf' },
  { topicId: 'crime-and-justice', title: 'Crime & Justice', acronym: 'SERVE', filename: '11-crime-and-justice.pdf' },
  { topicId: 'role-of-the-military', title: 'Role of the Military', acronym: 'FORCE', filename: '12-role-of-the-military.pdf' },
  { topicId: 'universal-healthcare', title: 'Against Universal Government Healthcare', acronym: 'CURES', filename: '13-universal-healthcare.pdf' },
  { topicId: 'ai-governance', title: 'AI Governance', acronym: 'HUMAN', filename: '14-ai-governance.pdf' },
].map((item) => ({
  ...item,
  href: `/debate-onepagers/${item.filename}`,
}))

const byTopicId = new Map(debateOnePagers.map((p) => [p.topicId, p]))

export function getDebateOnePager(topicId: string): DebateOnePager | undefined {
  return byTopicId.get(topicId)
}
