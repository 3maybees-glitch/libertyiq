/**
 * Official Heritage Academy Fall 2026 marketing materials.
 * Copy and creatives come from The Heritage Foundation flyer and graphics
 * shared with LibertyIQ for distribution.
 */

export const HERITAGE_ACADEMY = {
  name: 'Heritage Academy',
  org: 'The Heritage Foundation',
  tagline: 'An online public policy fellowship',
  headline: 'Want to help restore America?',
  subhead: 'Take your next step as a Heritage Academy Fellow.',
  description:
    'The Heritage Academy is an eight-week, online fellowship focused on America’s founding principles, the history of the conservative movement, and the most pressing public policy issues of our time. Gain the knowledge, skills, and network you need to win the battle of ideas.',
  applicationsOpen: 'Applications Now Open!',
  applyBy: 'APPLY BY SEPTEMBER 13',
  applyNow: 'APPLY NOW!',
  printedUrl: 'heritage.org/heritage-academy',
  learnMoreUrl: 'https://www.heritage.org/heritage-academy',
  applyUrl:
    'https://jobs.crelate.com/portal/heritagejobbank/job/apply/wb83e359zdt3h54h5b3jwg5e9y?crt=1783344410120',
  flyerPdf: '/heritage-academy/Heritage-Academy-Flyer-2026.pdf',
  brandBlue: '#009CDE',
  assets: {
    libertyBell: '/heritage-academy/flyer-liberty-bell.jpg',
    onlineFellowship: '/heritage-academy/flyer-online-fellowship.jpg',
    eagle: '/heritage-academy/flyer-eagle.jpg',
    flyerPage1: '/heritage-academy/flyer-page-1.jpg',
    flyerPage2: '/heritage-academy/flyer-page-2.jpg',
  },
  pillars: [
    {
      title: 'On-demand policy lectures',
      body: 'Learn from America’s leading policy experts.',
    },
    {
      title: 'Live Q&A sessions',
      body: 'Interact with leaders in the conservative movement.',
    },
    {
      title: 'Small-group discussions',
      body: 'Connect with conservatives from across America.',
    },
  ],
  whoShouldApply: 'We are looking for talented conservatives of all ages.',
  tracks: [
    {
      title: 'High school students',
      body: 'Meet like-minded students and learn how you can defend your values.',
    },
    {
      title: 'College students',
      body: 'Gain the skills and contacts you need to land your first internship or job in the conservative movement.',
    },
    {
      title: 'Professionals & patriots',
      body: 'Connect with other professionals and engaged conservatives from all walks of life.',
    },
  ],
  lectures: [
    'America’s Founding',
    'The History of American Conservatism',
    'The Gender Ideology Takeover',
    'Immigration & National Security',
    'Holding Big Tech Accountable',
    'Defending Life',
  ],
} as const

/** Applications close at the end of September 13, 2026, Eastern Time. */
export const HERITAGE_ACADEMY_APPLY_DEADLINE = new Date('2026-09-13T23:59:59.999-04:00')

export function isHeritageAcademyApplyOpen(now: Date = new Date()): boolean {
  return now.getTime() <= HERITAGE_ACADEMY_APPLY_DEADLINE.getTime()
}

export const heritageExternalRel = 'noopener noreferrer' as const
