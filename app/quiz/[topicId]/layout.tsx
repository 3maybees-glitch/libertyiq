import type { Metadata } from 'next';
import { getQuizByTopicId, getAllTopicIds } from '@/lib/quiz-data';
import { createPageMetadata, learningResourceJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/json-ld';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ topicId: string }>;
}

export function generateStaticParams() {
  return getAllTopicIds().map((topicId) => ({ topicId }));
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { topicId } = await params;
  const quiz = getQuizByTopicId(topicId);

  if (!quiz) {
    return { title: 'Quiz Not Found' };
  }

  return createPageMetadata({
    title: `${quiz.topicTitle} Quiz — Test Your Knowledge`,
    description: `Take the ${quiz.topicTitle} quiz on LibertyIQ.org. Three difficulty levels with explanations. Earn ranks from Intern Analyst to Chief Strategist.`,
    path: `/quiz/${topicId}`,
    keywords: [quiz.topicTitle, 'conservative quiz', 'LibertyIQ quiz', 'debate knowledge test'],
  });
}

export default async function QuizLayout({ children, params }: LayoutProps) {
  const { topicId } = await params;
  const quiz = getQuizByTopicId(topicId);

  return (
    <>
      {quiz && (
        <JsonLd
          data={learningResourceJsonLd({
            name: `${quiz.topicTitle} Quiz`,
            description: `Knowledge quiz for ${quiz.topicTitle} with easy, medium, and hard difficulty levels.`,
            path: `/quiz/${topicId}`,
          })}
        />
      )}
      {children}
    </>
  );
}
