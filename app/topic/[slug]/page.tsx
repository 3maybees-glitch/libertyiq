'use client';

import { use } from 'react';
import { topics } from '@/lib/types';
import { ArgumentAccordion } from '@/components/ArgumentAccordion';
import { DefenseTipsCard } from '@/components/DefenseTipsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { TopicIllustration } from '@/components/TopicIllustration';
import ReferencesButton from '@/components/references-button';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function TopicPage({ params }: PageProps) {
  const { slug } = use(params);
  const topic = topics.find((t) => t.slug === slug);

  if (!topic) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Topic not found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              The topic you are looking for does not exist.
            </p>
            <Link
              href="/"
              className="mt-4 inline-flex items-center gap-2 text-primary hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to all topics
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all topics
          </Link>
          <ReferencesButton />
        </div>

        {/* Topic header with illustration */}
        <div className="mb-10 flex flex-col sm:flex-row gap-6 items-start">
          <div className="flex-1 min-w-0">
            <h1 className="text-4xl font-bold text-primary font-serif">{topic.title}</h1>
            <p className="mt-3 text-muted-foreground leading-relaxed">{topic.shortDescription}</p>
            {topic.overview && (
              <p className="mt-3 text-sm text-foreground leading-relaxed border-t border-border/50 pt-3">
                {topic.overview}
              </p>
            )}
          </div>
          <div className="shrink-0 w-full sm:w-56 rounded-xl overflow-hidden border border-border/40 shadow-md relative" style={{ height: '192px' }}>
            <div style={{ position: 'absolute', inset: 0 }}>
              <TopicIllustration slug={topic.slug} title={topic.title} />
            </div>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
            Arguments
          </h2>
          <div className="space-y-4">
            {topic.arguments.map((arg, idx) => (
              <ArgumentAccordion key={arg.id} argument={arg} index={idx} />
            ))}
          </div>
        </div>
        {topic.defenseTips && topic.defenseTips.length > 0 && (
          <DefenseTipsCard tips={topic.defenseTips} />
        )}
      </div>
    </div>
  );
}
