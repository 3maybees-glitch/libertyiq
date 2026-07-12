import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site';
import { topics } from '@/lib/types';
import { getAllTopicIds } from '@/lib/quiz-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteConfig.url}/libertyiq`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/speaking-trainer`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  const topicRoutes: MetadataRoute.Sitemap = topics.map((topic) => ({
    url: `${siteConfig.url}/topic/${topic.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const quizRoutes: MetadataRoute.Sitemap = getAllTopicIds().map((topicId) => ({
    url: `${siteConfig.url}/quiz/${topicId}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...topicRoutes, ...quizRoutes];
}
