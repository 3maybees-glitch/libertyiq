'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { type TopicItem } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuizProgress } from '@/hooks/use-quiz-progress';
import { BookOpen, TrendingUp, Award, ArrowLeft } from 'lucide-react';

const RANK_COLORS: Record<string, string> = {
  none: 'bg-muted text-muted-foreground',
  intern: 'bg-blue-100 text-blue-700',
  fellow: 'bg-purple-100 text-purple-700',
  chief: 'bg-amber-100 text-amber-700',
};

const RANK_LABELS: Record<string, string> = {
  none: 'Not Started',
  intern: 'Intern Analyst',
  fellow: 'Senior Fellow',
  chief: 'Chief Strategist',
};

interface Props {
  topics: TopicItem[];
}

export function LibertyIQClient({ topics }: Props) {
  const [mounted, setMounted] = useState(false);
  const { isLoaded, getHighestRank, getAllProgress } = useQuizProgress();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Build topic list — before mount use 'none' for all ranks to avoid hydration mismatch
  const topicsWithRanks = topics.map((topic) => ({
    ...topic,
    rank: mounted && isLoaded ? getHighestRank(topic.id) : 'none',
  }));

  const allProgress = mounted && isLoaded ? getAllProgress() : {};

  const rankCounts = {
    chief: topicsWithRanks.filter((t) => t.rank === 'chief').length,
    fellow: topicsWithRanks.filter((t) => t.rank === 'fellow').length,
    intern: topicsWithRanks.filter((t) => t.rank === 'intern').length,
    started: Object.keys(allProgress).length,
  };

  return (
    <div className="min-h-screen">
      {/* Patriotic bar */}
      <div className="h-1.5 w-full" style={{ background: 'linear-gradient(to right, #B22234 33%, #FFFFFF 33%, #FFFFFF 66%, #3C3B6E 66%)' }} />

      {/* Header */}
      <div className="border-b border-white/10 bg-[#151d32] text-foreground py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-1.5 text-foreground/70 hover:text-foreground text-sm mb-4 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Library
          </Link>
          <div className="flex items-center gap-3 mb-1">
            <Award className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold font-serif">Test Your LibertyIQ</h1>
          </div>
          <p className="text-foreground/85 text-base sm:text-lg">
            Advance through the ranks by mastering each topic.
          </p>
        </div>
      </div>

      {/* Your progress */}
      <div className="parchment-surface border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
            Your progress
          </h2>
          {mounted && isLoaded && rankCounts.started > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-primary">{rankCounts.chief}</div>
                <div className="text-sm text-muted-foreground">Chief Strategist{rankCounts.chief !== 1 ? 's' : ''}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-secondary">{rankCounts.fellow}</div>
                <div className="text-sm text-muted-foreground">Senior Fellow{rankCounts.fellow !== 1 ? 's' : ''}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#2f4f8a]">{rankCounts.intern}</div>
                <div className="text-sm text-muted-foreground">Intern rank{rankCounts.intern !== 1 ? 's' : ''}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-card-foreground">{rankCounts.started}</div>
                <div className="text-sm text-muted-foreground">Topics started</div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-background/40 px-5 py-6 text-center sm:text-left sm:flex sm:items-center sm:justify-between sm:gap-6">
              <p className="text-base text-card-foreground leading-relaxed max-w-xl">
                You have not started a quiz yet. Pick any topic below, pass the easy quiz at 70%, and
                you will see your ranks here.
              </p>
              <p className="mt-3 sm:mt-0 text-sm text-muted-foreground shrink-0">
                Easy quizzes stay free — no pass required.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Topics Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Topics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {topicsWithRanks.map((topic) => {
            const rank = topic.rank as 'none' | 'intern' | 'fellow' | 'chief';
            return (
              <Card key={topic.id} className="overflow-hidden hover:shadow-md transition-shadow parchment-surface border-border/80">
                <div className="p-5 flex flex-col h-full">
                  <span className={`self-start mb-3 px-2.5 py-0.5 rounded-full text-xs font-medium ${RANK_COLORS[rank]}`}>
                    {RANK_LABELS[rank]}
                  </span>
                  <h3 className="text-lg font-bold mb-1 text-balance">{topic.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed flex-1">
                    {topic.shortDescription}
                  </p>

                  {rank !== 'none' && rank !== 'chief' && (
                    <div className="mb-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <TrendingUp className="h-3.5 w-3.5" />
                      Next: {RANK_LABELS[rank === 'intern' ? 'fellow' : 'chief']}
                    </div>
                  )}
                  {rank === 'chief' && (
                    <div className="mb-3 flex items-center gap-1.5 text-xs text-amber-600 font-medium">
                      <Award className="h-3.5 w-3.5" />
                      Topic Mastered
                    </div>
                  )}

                  <Link href={`/quiz/${topic.id}`} className="block mt-auto">
                    <Button className="w-full" variant={rank === 'chief' ? 'outline' : 'default'} size="sm">
                      {rank === 'none' ? 'Start Quiz' : rank === 'chief' ? 'Review' : 'Continue'}
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Rank Legend */}
      <div className="parchment-surface border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h3 className="text-base font-bold mb-5">Rank System</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { color: 'bg-blue-600', label: 'Intern Analyst', desc: 'Pass the Easy quiz at 70% or higher.' },
              { color: 'bg-purple-600', label: 'Senior Fellow', desc: 'Pass the Medium quiz at 75% or higher.' },
              { color: 'bg-amber-500', label: 'Chief Strategist', desc: 'Pass the Hard quiz at 80% or higher.' },
              { color: 'bg-muted-foreground', label: 'Not Started', desc: 'Begin your LibertyIQ journey.' },
            ].map(({ color, label, desc }) => (
              <div key={label}>
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
                  <span className="font-semibold text-sm">{label}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
