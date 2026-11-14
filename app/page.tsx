'use client';

import { useCallback, useRef, useState } from 'react';
import { topics } from '@/lib/types';
import { ArgumentAccordion } from '@/components/ArgumentAccordion';
import { DefenseTipsCard } from '@/components/DefenseTipsCard';
import { TopicIllustration } from '@/components/TopicIllustration';
import { TopicIcon } from '@/lib/topic-icons';
import { markInstallEngagement } from '@/components/install-app';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';
import { DebateOnePagerButton } from '@/components/debate-onepager-button';
import { WhoHoldsTheGavel } from '@/components/committees/who-holds-the-gavel';
import { HomeDesktopNav, HomeMobileNav } from '@/components/home-menu';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const PATRIOTIC_BAR =
  'linear-gradient(to right, #B22234 33%, #FFFFFF 33%, #FFFFFF 66%, #3C3B6E 66%)';

export default function Home() {
  const [selectedId, setSelectedId] = useState(topics[0]?.id ?? '');
  const detailRef = useRef<HTMLElement>(null);
  const selected = topics.find((t) => t.id === selectedId) ?? topics[0];

  const pickTopic = useCallback((id: string) => {
    setSelectedId(id);
    markInstallEngagement();
    requestAnimationFrame(() => {
      detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, []);

  return (
    <div className="min-h-screen">
      <div className="h-1.5 w-full" style={{ background: PATRIOTIC_BAR }} />

      {/* Site header */}
      <header className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 min-w-0">
          <Image
            src="/libertyiq-logo.png"
            alt="LibertyIQ logo"
            width={52}
            height={52}
            className="shrink-0 rounded-xl shadow-md size-[52px]"
            priority
          />
          <div className="min-w-0 hidden sm:block">
            <p className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-foreground leading-none">
              Liberty<span className="text-primary">IQ</span>
            </p>
            <p className="text-xs text-foreground/75 mt-0.5 hidden sm:block">
              Christian-conservative civic library
            </p>
          </div>
        </Link>
        <div className="hidden sm:block">
          <HomeDesktopNav />
        </div>
        <div className="sm:hidden">
          <HomeMobileNav compact />
        </div>
      </header>

      {/* Full-width Founding-era hero */}
      <section
        aria-labelledby="hero-heading"
        className="relative overflow-hidden border-y border-white/10"
      >
        <div className="absolute inset-0">
          <Image
            src="/hero-declaration-trumbull.jpg"
            alt=""
            fill
            priority
            className="object-cover object-[center_28%] scale-105"
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(105deg, rgba(21,29,50,0.94) 0%, rgba(30,42,69,0.82) 42%, rgba(21,29,50,0.55) 100%)',
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#f5d0d5]">
            Free library
          </p>
          <h1
            id="hero-heading"
            className="mt-3 max-w-3xl font-serif text-4xl font-bold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Study the issue. Practice the case.
          </h1>
          <p className="mt-4 max-w-2xl text-base sm:text-lg leading-relaxed text-white/90">
            A free Christian-conservative library of arguments, quizzes, and debate one-pagers on{' '}
            {topics.length} issues that shape American civic life.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              asChild
              size="lg"
              className="font-semibold text-base shadow-lg bg-primary hover:bg-primary/90"
            >
              <a href="#topics-grid">Start free</a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="font-semibold text-base border border-white/20 bg-white/10 text-white hover:bg-white/20"
            >
              <Link href="/libertyiq">Test your LibertyIQ</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Topic card grid */}
        <section id="topics-grid" className="scroll-mt-6" aria-labelledby="topics-heading">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                14 issues
              </p>
              <h2
                id="topics-heading"
                className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground"
              >
                Pick an issue to explore
              </h2>
            </div>
            <p className="text-sm text-foreground/80 max-w-md leading-relaxed">
              Structured arguments, Scripture, evidence, defense tips, and committee context — easy
              quizzes are always free.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {topics.map((t) => {
              const active = t.id === selectedId;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => pickTopic(t.id)}
                  className={cn(
                    'parchment-surface group rounded-xl border text-left transition-all',
                    'hover:shadow-md hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    active
                      ? 'border-primary shadow-md ring-1 ring-primary/20'
                      : 'border-border/80',
                  )}
                >
                  <div className="flex items-start gap-3 p-4">
                    <span
                      className={cn(
                        'flex size-10 shrink-0 items-center justify-center rounded-lg',
                        active ? 'bg-primary text-primary-foreground' : 'bg-secondary/10 text-secondary',
                      )}
                    >
                      <TopicIcon slug={t.slug} className="size-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-card-foreground text-base leading-snug group-hover:text-primary transition-colors">
                        {t.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {t.shortDescription}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 md:hidden">
            <Select value={selectedId} onValueChange={pickTopic}>
              <SelectTrigger className="w-full bg-card text-card-foreground">
                <SelectValue placeholder="Select a topic..." />
              </SelectTrigger>
              <SelectContent>
                {topics.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </section>

        {/* Topic detail — below the fold */}
        <section
          ref={detailRef}
          id="issues"
          className="scroll-mt-8 mt-14 pt-10 border-t border-white/15"
          aria-labelledby="detail-heading"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
            Issue deep dive
          </p>
          <h2
            id="detail-heading"
            className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-foreground"
          >
            {selected.title}
          </h2>

          <div className="mt-8 space-y-8 text-card-foreground">
            <div className="rounded-2xl border border-border overflow-hidden shadow-sm parchment-surface">
              <div className="relative w-full" style={{ height: '220px' }}>
                <div className="absolute inset-0">
                  <TopicIllustration slug={selected.slug} title={selected.title} />
                </div>
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(26,35,50,0.85) 35%, rgba(26,35,50,0.15) 100%)',
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-2xl font-bold font-serif text-white">{selected.title}</h3>
                  <p className="mt-1 text-sm text-white/90 leading-relaxed line-clamp-2">
                    {selected.shortDescription}
                  </p>
                </div>
              </div>

              <div className="px-5 py-4 flex items-center gap-4 justify-between overflow-x-auto border-t border-border/60">
                <div className="flex items-center gap-4 min-w-0 text-card-foreground">
                  <div className="shrink-0 flex items-center gap-2">
                    <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-full bg-primary/10 px-2 text-xl font-bold text-primary">
                      {selected.arguments.length}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      argument{selected.arguments.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  {selected.defenseTips && selected.defenseTips.length > 0 && (
                    <div className="shrink-0 flex items-center gap-2">
                      <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-full bg-primary/10 px-2 text-xl font-bold text-primary">
                        {selected.defenseTips.length}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        defense &amp; counter arg{selected.defenseTips.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                </div>
                <DebateOnePagerButton topicId={selected.id} className="shrink-0" />
              </div>

              {selected.overview && (
                <div className="border-t border-border/60 px-5 pb-5 pt-4">
                  <p className="text-base text-card-foreground leading-relaxed">{selected.overview}</p>
                </div>
              )}
            </div>

            <WhoHoldsTheGavel topicId={selected.id} />

            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-foreground/70 mb-4">
                Arguments
              </h3>
              <div className="space-y-4">
                {selected.arguments.map((arg, idx) => (
                  <ArgumentAccordion key={arg.id} argument={arg} index={idx} />
                ))}
              </div>
            </div>

            {selected.defenseTips && selected.defenseTips.length > 0 && (
              <DefenseTipsCard tips={selected.defenseTips} />
            )}
          </div>
        </section>

        <footer className="mt-16 pt-8 border-t border-white/15">
          <p className="text-sm text-foreground/80 text-center leading-relaxed max-w-2xl mx-auto">
            Use these arguments thoughtfully and compassionately. The goal is meaningful dialogue,
            not winning at all costs.
          </p>
          <p className="mt-3 text-center text-xs text-foreground/50">
            Hero: John Trumbull,{' '}
            <em>Declaration of Independence</em> (1819), public domain via{' '}
            <a
              href="https://commons.wikimedia.org/wiki/File:Declaration_of_Independence_(1819),_by_John_Trumbull.jpg"
              className="underline underline-offset-2 hover:text-foreground/70"
              target="_blank"
              rel="noopener noreferrer"
            >
              Wikimedia Commons
            </a>
            .
          </p>
        </footer>
      </div>
    </div>
  );
}