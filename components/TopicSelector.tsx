'use client';

import { useState, useEffect } from 'react';
import { TopicItem } from '@/lib/types';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TopicSelectorProps {
  topics: TopicItem[];
}

export function TopicSelector({ topics }: TopicSelectorProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState<string>('');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-10 bg-muted rounded-md animate-pulse" />
    );
  }

  const selectedTopic = topics.find((t) => t.slug === selectedSlug);

  return (
    <div className="flex gap-2">
      <Select value={selectedSlug} onValueChange={setSelectedSlug}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Jump to a topic..." />
        </SelectTrigger>
        <SelectContent>
          {topics.map((topic) => (
            <SelectItem key={topic.id} value={topic.slug}>
              {topic.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedTopic && (
        <Link href={`/topic/${selectedTopic.slug}`} className="inline-block">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors whitespace-nowrap">
            Go
          </button>
        </Link>
      )}
    </div>
  );
}
