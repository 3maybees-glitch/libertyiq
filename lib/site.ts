export const siteConfig = {
  name: 'LibertyIQ',
  title: 'LibertyIQ — Conservative Arguments Library',
  description:
    'LibertyIQ.org is a free conservative arguments library and quiz platform. Study pro-life, immigration, constitutional rights, and nine more debate topics with biblical foundations, scientific evidence, defense tips, and knowledge quizzes.',
  url: 'https://libertyiq.org',
  ogImage: '/libertyiq-logo.png',
  locale: 'en_US',
  keywords: [
    'LibertyIQ',
    'conservative arguments',
    'debate topics',
    'pro-life arguments',
    'second amendment',
    'immigration debate',
    'conservative quiz',
    'public speaking practice',
    'biblical foundations',
    'political debate guide',
  ],
} as const;

export const SITE_FAQS = [
  {
    question: 'What is LibertyIQ?',
    answer:
      'LibertyIQ is a free online conservative arguments library and quiz platform at LibertyIQ.org. It provides structured debate topics with biblical foundations, scientific evidence, defense tips, knowledge quizzes, and a public speaking trainer.',
  },
  {
    question: 'What topics does LibertyIQ cover?',
    answer:
      'LibertyIQ covers eleven conservative debate topics: Pro-Life, Illegal Immigration, Second Amendment, Marriage, Two Sexes, Pro-Israel, National Security, Anti-Climate Alarmism, Limited Government, Anti-CRT, and Crime & Justice.',
  },
  {
    question: 'How does the LibertyIQ quiz work?',
    answer:
      'Each topic has Easy, Medium, and Hard quiz levels. Pass Easy to earn Intern Analyst, Medium for Senior Fellow, and Hard for Chief Strategist. Quizzes include explanations for every answer. Progress is saved locally in your browser.',
  },
  {
    question: 'Is LibertyIQ free to use?',
    answer:
      'Yes. LibertyIQ is completely free. No account, subscription, or payment is required. Quiz progress is stored locally in your browser using localStorage.',
  },
  {
    question: 'What is the LibertyIQ speaking trainer?',
    answer:
      'The speaking trainer at LibertyIQ.org/speaking-trainer uses browser speech recognition to transcribe your practice speeches, analyze filler words, and provide coaching tips to improve clarity and confidence.',
  },
] as const;
