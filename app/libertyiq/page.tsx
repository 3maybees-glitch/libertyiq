import type { Metadata } from 'next';
import { topics } from '@/lib/types';
import { LibertyIQClient } from './LibertyIQClient';
import { JsonLd } from '@/components/json-ld';
import { createPageMetadata, itemListJsonLd, absoluteUrl } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Test Your LibertyIQ — Quiz Dashboard',
  description:
    'Track your quiz progress across 11 conservative debate topics on LibertyIQ.org. Advance from Intern Analyst to Senior Fellow to Chief Strategist.',
  path: '/libertyiq',
  keywords: ['LibertyIQ quiz', 'conservative knowledge test', 'debate quiz dashboard', 'Intern Analyst'],
});

export default function LibertyIQPage() {
  const quizTopics = topics.map((topic) => ({
    name: `${topic.title} Quiz`,
    url: absoluteUrl(`/quiz/${topic.id}`),
    description: topic.shortDescription,
  }));

  return (
    <>
      <JsonLd data={itemListJsonLd(quizTopics)} />
      <LibertyIQClient topics={topics} />
    </>
  );
}
