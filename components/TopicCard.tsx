'use client';

import { TopicItem } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface TopicCardProps {
  topic: TopicItem;
}

export function TopicCard({ topic }: TopicCardProps) {
  return (
    <Link href={`/topic/${topic.slug}`}>
      <Card className="h-full cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 border-border hover:border-accent/50 bg-card">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-lg leading-snug">{topic.title}</CardTitle>
              <CardDescription className="mt-1.5 line-clamp-2 text-sm leading-relaxed">
                {topic.shortDescription}
              </CardDescription>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>
              <span className="font-semibold text-foreground">{topic.arguments.length}</span>{' '}
              argument{topic.arguments.length !== 1 ? 's' : ''}
            </span>
            {topic.defenseTips && topic.defenseTips.length > 0 && (
              <span>
                <span className="font-semibold text-foreground">{topic.defenseTips.length}</span>{' '}
                defense &amp; counter arg{topic.defenseTips.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
