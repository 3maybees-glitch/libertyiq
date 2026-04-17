'use client';

import { useState } from 'react';
import { topics } from '@/lib/types';
import { ArgumentAccordion } from '@/components/ArgumentAccordion';
import { DefenseTipsCard } from '@/components/DefenseTipsCard';
import { TopicIllustration } from '@/components/TopicIllustration';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { GraduationCap } from 'lucide-react';
import ReferencesButton from '@/components/references-button';
import Image from 'next/image';

export default function Home() {
  const [selectedId, setSelectedId] = useState(topics[0]?.id ?? '');
  const selected = topics.find((t) => t.id === selectedId) ?? topics[0];

  return (
    <div className="min-h-screen bg-background">
      {/* Patriotic top bar */}
      <div className="h-1.5 w-full" style={{ background: 'linear-gradient(to right, #B22234 33%, #FFFFFF 33%, #FFFFFF 66%, #3C3B6E 66%)' }} />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Header — stacked on mobile, side-by-side on desktop */}
        <div className="mb-10">

          {/* Mobile layout: centered stack */}
          <div className="flex flex-col items-center text-center sm:hidden gap-3 pb-2">
            <Image
              src="/libertyiq-logo.png"
              alt="LibertyIQ logo"
              width={110}
              height={110}
              className="rounded-2xl shadow-lg"
              priority
            />
            <div>
              <h1 className="text-5xl font-bold tracking-tight font-serif leading-tight">
                <span style={{ color: '#ffffff', WebkitTextStroke: '1px rgba(0,0,0,0.25)', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>Liberty</span>
                <span style={{ color: 'var(--color-primary)', WebkitTextStroke: '1px rgba(255,255,255,0.35)', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>IQ</span>
              </h1>
              <p className="text-base text-accent font-semibold mt-1">Conservative Arguments Library</p>
              <p className="text-xs text-muted-foreground leading-relaxed mt-1 px-2">
                Structured arguments, biblical foundations, scientific evidence, and defense tips.
              </p>
            </div>
            <div className="flex flex-col gap-2 w-full pt-1">
              <Link href="/libertyiq" className="block w-full">
                <div className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl py-3 px-4 font-semibold text-sm shadow-md active:opacity-90 transition-opacity">
                  <GraduationCap className="h-4 w-4 shrink-0" />
                  Test Your LibertyIQ
                </div>
              </Link>
              <ReferencesButton fullWidth />
            </div>
          </div>

          {/* Desktop layout: logo + text left, buttons right */}
          <div className="hidden sm:flex items-start justify-between gap-6">
            <div className="flex items-center gap-5">
              <Image
                src="/libertyiq-logo.png"
                alt="LibertyIQ logo"
                width={96}
                height={96}
                className="shrink-0 w-24 h-24 rounded-xl shadow-md"
                priority
              />
              <div>
                <h1 className="text-6xl font-bold tracking-tight font-serif">
                  <span style={{ color: '#ffffff', WebkitTextStroke: '1px rgba(0,0,0,0.25)', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>Liberty</span>
                  <span style={{ color: 'var(--color-primary)', WebkitTextStroke: '1px rgba(255,255,255,0.35)', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>IQ</span>
                </h1>
                <p className="text-lg text-accent font-semibold">Conservative Arguments Library</p>
                <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed pt-1">
                  Select a topic to explore structured arguments, biblical foundations, scientific evidence, and defense tips.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 pt-1">
              <ReferencesButton />
              <Link href="/libertyiq">
                <Button variant="default" size="default" className="gap-2 whitespace-nowrap font-semibold">
                  <GraduationCap className="h-5 w-5" />
                  Test Your LibertyIQ
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile dropdown */}
        <div className="mb-6 md:hidden">
          <Select value={selectedId} onValueChange={setSelectedId}>
            <SelectTrigger className="w-full">
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

        {/* Split panel */}
        <div className="grid gap-8 md:grid-cols-[280px_1fr]">

          {/* Sidebar — desktop only */}
          <aside className="hidden md:block">
            <div className="sticky top-6 space-y-2">
              {topics.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedId(t.id)}
                  className={cn(
                    'w-full rounded-xl border px-4 py-3 text-left transition-all',
                    selectedId === t.id
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border bg-card hover:bg-muted/50'
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={cn(
                      'text-sm font-semibold leading-snug',
                      selectedId === t.id ? 'text-primary' : 'text-foreground'
                    )}>
                      {t.title}
                    </span>
                    <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                      {t.arguments.length}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {t.shortDescription}
                  </p>
                </button>
              ))}
            </div>
          </aside>

          {/* Detail panel */}
          <section className="min-w-0 space-y-8">

            {/* Topic header — banner with illustration */}
            <div className="rounded-2xl border border-border overflow-hidden">
              {/* Illustration banner */}
              <div className="relative w-full" style={{ height: '220px' }}>
                <div style={{ position: 'absolute', inset: 0 }}>
                  <TopicIllustration slug={selected.slug} title={selected.title} />
                </div>
                {/* Gradient overlay for text legibility */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.72) 40%, rgba(0,0,0,0.15) 100%)' }} />
                {/* Title overlaid */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }} className="p-5">
                  <h2 className="text-2xl font-bold text-white">{selected.title}</h2>
                  <p className="mt-1 text-sm text-white/85 leading-relaxed line-clamp-2">{selected.shortDescription}</p>
                </div>
              </div>

              {/* Stats row */}
              <div className="bg-card px-5 py-4 flex items-center gap-4 justify-between overflow-x-auto">
                <div className="shrink-0">
                  <span className="text-2xl font-bold text-primary">{selected.arguments.length}</span>
                  <span className="ml-1.5 text-sm text-muted-foreground">argument{selected.arguments.length !== 1 ? 's' : ''}</span>
                </div>
                {selected.defenseTips && selected.defenseTips.length > 0 && (
                  <div className="shrink-0">
                    <span className="text-2xl font-bold text-primary">{selected.defenseTips.length}</span>
                    <span className="ml-1.5 text-sm text-muted-foreground">defense &amp; counter arg{selected.defenseTips.length !== 1 ? 's' : ''}</span>
                  </div>
                )}

              </div>

              {/* Overview */}
              {selected.overview && (
                <div className="bg-card border-t border-border/50 px-5 pb-5">
                  <p className="text-sm text-foreground leading-relaxed">{selected.overview}</p>
                </div>
              )}
            </div>

            {/* Arguments */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                Arguments
              </h3>
              <div className="space-y-4">
                {selected.arguments.map((arg, idx) => (
                  <ArgumentAccordion key={arg.id} argument={arg} index={idx} />
                ))}
              </div>
            </div>

            {/* Defense Tips */}
            {selected.defenseTips && selected.defenseTips.length > 0 && (
              <DefenseTipsCard tips={selected.defenseTips} />
            )}

          </section>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-border/30">
          <p className="text-sm text-muted-foreground text-center leading-relaxed">
            Use these arguments thoughtfully and compassionately. The goal is to engage in meaningful dialogue, not to win arguments.
          </p>
        </div>
      </div>
    </div>
  );
}
