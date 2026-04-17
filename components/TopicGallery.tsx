'use client';

import { TopicItem } from '@/lib/types';
import { TopicCard } from './TopicCard';

interface TopicGalleryProps {
  topics: TopicItem[];
  isLoading?: boolean;
}

export function TopicGallery({ topics, isLoading }: TopicGalleryProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {topics.map((topic) => (
        <TopicCard key={topic.id} topic={topic} />
      ))}
    </div>
  );
}
