import type { Metadata } from 'next';
import { HomePageClient } from '@/components/home-page-client';
import { HomeFaq } from '@/components/home-faq';
import { JsonLd } from '@/components/json-ld';
import { siteConfig, SITE_FAQS } from '@/lib/site';
import {
  absoluteUrl,
  createPageMetadata,
  faqJsonLd,
  itemListJsonLd,
} from '@/lib/seo';
import { topics } from '@/lib/types';

export const metadata: Metadata = createPageMetadata({
  title: siteConfig.title,
  description: siteConfig.description,
  path: '/',
});

export default function HomePage() {
  const topicListItems = topics.map((topic) => ({
    name: topic.title,
    url: absoluteUrl(`/topic/${topic.slug}`),
    description: topic.shortDescription,
  }));

  return (
    <>
      <JsonLd
        data={[
          faqJsonLd(SITE_FAQS),
          itemListJsonLd(topicListItems),
        ]}
      />
      <HomePageClient />
      <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <HomeFaq />
        <nav aria-label="Site map" className="mt-10 pt-6 border-t border-border/30">
          <h2 className="sr-only">Site sections</h2>
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <li><a href="/libertyiq" className="hover:text-primary">Quiz Dashboard</a></li>
            <li><a href="/speaking-trainer" className="hover:text-primary">Speaking Trainer</a></li>
            {topics.map((topic) => (
              <li key={topic.id}>
                <a href={`/topic/${topic.slug}`} className="hover:text-primary">{topic.title}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
