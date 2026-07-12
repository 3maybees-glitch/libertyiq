import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TopicPageClient } from '@/components/topic-page-client';
import { JsonLd } from '@/components/json-ld';
import { breadcrumbJsonLd, createPageMetadata, topicArticleJsonLd } from '@/lib/seo';
import { topics } from '@/lib/types';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return topics.map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const topic = topics.find((t) => t.slug === slug);

  if (!topic) {
    return { title: 'Topic Not Found' };
  }

  return createPageMetadata({
    title: `${topic.title} — Conservative Arguments`,
    description: `${topic.shortDescription} Explore ${topic.arguments.length} structured arguments with evidence and defense tips on LibertyIQ.org.`,
    path: `/topic/${topic.slug}`,
    keywords: [topic.title, 'conservative arguments', 'debate guide', 'LibertyIQ'],
  });
}

export default async function TopicPage({ params }: PageProps) {
  const { slug } = await params;
  const topic = topics.find((t) => t.slug === slug);

  if (!topic) {
    notFound();
  }

  return (
    <>
      <JsonLd
        data={[
          topicArticleJsonLd(topic),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: topic.title, path: `/topic/${topic.slug}` },
          ]),
        ]}
      />
      <TopicPageClient params={params} />
    </>
  );
}
