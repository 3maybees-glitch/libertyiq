/**
 * Fall 2026 Heritage Academy High School Track — facts for the LibertyIQ ad.
 *
 * Sources:
 * - Kirsten Holmberg email to LibertyIQ (Sep 8, 2026)
 * - https://www.heritage.org/the-academy
 * - https://www.heritage.org/academy-faq
 *
 * Copy on the site is original. Do not paste Heritage marketing text verbatim.
 */

export const HERITAGE_ACADEMY = {
  name: 'The Heritage Academy',
  track: 'High School Track',
  org: 'The Heritage Foundation',
  learnMoreUrl: 'https://www.heritage.org/the-academy',
  applyUrl:
    'https://jobs.crelate.com/portal/heritagejobbank/job/apply/wb83e359zdt3h54h5b3jwg5e9y?crt=1783344410120',
  faqUrl: 'https://www.heritage.org/academy-faq',
  speakersUrl: 'https://www.heritage.org/article/the-academy-speakers',
  contactEmail: 'theacademy@heritage.org',
  termLabel: 'Fall 2026',
  programStartLabel: 'September 28, 2026',
  programEndLabel: 'November 23, 2026',
  programRangeLabel: 'September 28 – November 23, 2026',
  deadlineLabel: 'September 13, 2026',
  weeklyHoursLabel: '2–3 hours',
  weeklyHoursDetail:
    'In a typical week, fellows watch two 30-minute lectures on their own time and join one live session.',
  format: 'Free, virtual, part-time fellowship',
  durationWeeks: 8,
  lectureCount: 16,
  liveQaCount: 4,
} as const

/** Applications close at the end of September 13, 2026, Eastern Time. */
export const HERITAGE_ACADEMY_APPLY_DEADLINE = new Date('2026-09-13T23:59:59.999-04:00')

export function isHeritageAcademyApplyOpen(now: Date = new Date()): boolean {
  return now.getTime() <= HERITAGE_ACADEMY_APPLY_DEADLINE.getTime()
}

export const HERITAGE_ACADEMY_SPEAKERS = [
  { name: 'Kevin D. Roberts, PhD', role: 'President, The Heritage Foundation' },
  {
    name: 'Dr. Christina Francis',
    role: 'Chief Executive Officer, American Association of Pro-Life Obstetricians and Gynecologists',
  },
  {
    name: 'Jay W. Richards, PhD',
    role: 'Vice President, Social and Domestic Policy, and William E. Simon Senior Research Fellow',
  },
  {
    name: 'Christopher Malagisi',
    role: 'Executive Director of Outreach, Hillsdale College (D.C.)',
  },
] as const

export const heritageExternalRel = 'noopener noreferrer' as const
