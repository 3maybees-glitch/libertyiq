import Link from 'next/link'
import { CalendarDays, Clock, ExternalLink, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  HERITAGE_ACADEMY,
  heritageExternalRel,
  isHeritageAcademyApplyOpen,
} from '@/lib/heritage-academy'

export function HeritageAcademyApplyButtons({
  className,
  size = 'default',
  invert = false,
  secondary = 'invitation',
}: {
  className?: string
  size?: 'default' | 'lg'
  invert?: boolean
  secondary?: 'invitation' | 'learn-more' | 'none'
}) {
  const applyOpen = isHeritageAcademyApplyOpen()

  return (
    <div className={cn('flex flex-col sm:flex-row gap-2 sm:gap-3', className)}>
      {applyOpen ? (
        <Button asChild size={size} className="font-semibold">
          <a
            href={HERITAGE_ACADEMY.applyUrl}
            target="_blank"
            rel={heritageExternalRel}
          >
            Apply on Heritage&apos;s site
            <ExternalLink className="size-4" aria-hidden />
          </a>
        </Button>
      ) : (
        <Button asChild size={size} className="font-semibold">
          <a
            href={HERITAGE_ACADEMY.learnMoreUrl}
            target="_blank"
            rel={heritageExternalRel}
          >
            See upcoming terms
            <ExternalLink className="size-4" aria-hidden />
          </a>
        </Button>
      )}
      {secondary === 'invitation' && (
        <Button
          asChild
          size={size}
          variant="outline"
          className={cn(
            'font-semibold',
            invert && 'border-white/35 bg-transparent text-white hover:bg-white/10 hover:text-white',
          )}
        >
          <Link href="/heritage-academy">Read the invitation</Link>
        </Button>
      )}
      {secondary === 'learn-more' && (
        <Button
          asChild
          size={size}
          variant="outline"
          className={cn(
            'font-semibold',
            invert && 'border-white/35 bg-transparent text-white hover:bg-white/10 hover:text-white',
          )}
        >
          <a
            href={HERITAGE_ACADEMY.learnMoreUrl}
            target="_blank"
            rel={heritageExternalRel}
          >
            Learn more at Heritage
            <ExternalLink className="size-4" aria-hidden />
          </a>
        </Button>
      )}
    </div>
  )
}

export function HeritageAcademyTermPlate({ className }: { className?: string }) {
  const applyOpen = isHeritageAcademyApplyOpen()

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-[#C9A227]/45 bg-[#12121f]/80 px-4 py-4 sm:px-5',
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C9A227] to-transparent"
      />
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A227]">
        {HERITAGE_ACADEMY.termLabel} term plate
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-white/70">Program dates</p>
          <p className="mt-1 font-serif text-lg leading-snug text-white">
            {HERITAGE_ACADEMY.programRangeLabel}
          </p>
        </div>
        <div className="flex items-start gap-3 sm:border-l sm:border-white/15 sm:pl-4">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-wider text-white/70">
              {applyOpen ? 'Application deadline' : 'Applications'}
            </p>
            <p className="mt-1 font-serif text-lg leading-snug text-[#F3C6C9]">
              {applyOpen
                ? `Apply by ${HERITAGE_ACADEMY.deadlineLabel}`
                : 'Fall 2026 applications have closed'}
            </p>
          </div>
          <div
            aria-hidden
            className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#B22234] bg-[#8E1C2A] text-[9px] font-bold uppercase leading-tight tracking-wide text-white shadow-[0_0_0_3px_rgba(178,34,52,0.25)]"
          >
            {applyOpen ? (
              <span>
                Due
                <br />
                9/13
              </span>
            ) : (
              <span>Closed</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function HeritageAcademyFeatured({ className }: { className?: string }) {
  const applyOpen = isHeritageAcademyApplyOpen()

  return (
    <aside
      className={cn(
        'rounded-2xl border border-[#C9A227]/40 bg-card/80 shadow-lg overflow-hidden',
        className,
      )}
      aria-labelledby="heritage-academy-ad-heading"
    >
      <div
        className="h-1 w-full"
        style={{
          background:
            'linear-gradient(to right, #B22234 33%, #FFFFFF 33%, #FFFFFF 66%, #3C3B6E 66%)',
        }}
      />
      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A227]">
            A LibertyIQ family recommends
          </p>
          <h2
            id="heritage-academy-ad-heading"
            className="mt-2 font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground"
          >
            {HERITAGE_ACADEMY.name}
          </h2>
          <p className="mt-1 text-sm font-semibold text-accent">
            {HERITAGE_ACADEMY.track} · {HERITAGE_ACADEMY.format} · {HERITAGE_ACADEMY.termLabel}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-foreground/95 max-w-2xl">
            Our son completed this program and loved it. {HERITAGE_ACADEMY.org} asked
            families who believe in their mission to help other students find the{' '}
            {HERITAGE_ACADEMY.termLabel} High School Track — a free online fellowship
            on America&apos;s founding principles, the conservative movement, and the
            policy questions that will shape their future.
          </p>
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <li className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-3.5 text-[#C9A227]" aria-hidden />
              {HERITAGE_ACADEMY.programRangeLabel}
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5 text-[#C9A227]" aria-hidden />
              About {HERITAGE_ACADEMY.weeklyHoursLabel} a week
            </li>
            <li className="inline-flex items-center gap-1.5">
              <GraduationCap className="size-3.5 text-[#C9A227]" aria-hidden />
              High school students nationwide
            </li>
          </ul>
          <HeritageAcademyApplyButtons className="mt-5" />
          {!applyOpen && (
            <p className="mt-3 text-xs text-muted-foreground">
              The {HERITAGE_ACADEMY.termLabel} deadline has passed. Heritage&apos;s
              Academy page lists future terms when they open.
            </p>
          )}
        </div>
        <HeritageAcademyTermPlate />
      </div>
    </aside>
  )
}
