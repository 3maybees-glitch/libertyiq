'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ExternalLink } from 'lucide-react'
import { HERITAGE_ACADEMY, heritageExternalRel, isHeritageAcademyApplyOpen } from '@/lib/heritage-academy'

const HIDDEN_PATHS = new Set(['/', '/heritage-academy'])

export function HeritageAcademyRibbon() {
  const pathname = usePathname()
  if (!pathname || HIDDEN_PATHS.has(pathname)) return null

  const applyOpen = isHeritageAcademyApplyOpen()

  return (
    <div className="print:hidden border-b border-[#C9A227]/30 bg-[#12121f]/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="text-xs sm:text-sm leading-snug text-white">
          <span className="font-semibold text-[#C9A227]">
            {HERITAGE_ACADEMY.name} · {HERITAGE_ACADEMY.track}
          </span>
          <span className="text-white/80">
            {' '}
            — free virtual fellowship, {HERITAGE_ACADEMY.programRangeLabel}.{' '}
            {applyOpen
              ? `Applications close ${HERITAGE_ACADEMY.deadlineLabel}.`
              : 'Fall 2026 applications have closed.'}
          </span>
        </p>
        <div className="flex shrink-0 items-center gap-3 text-xs font-semibold">
          <Link href="/heritage-academy" className="text-[#C9A227] hover:underline underline-offset-2">
            Invitation
          </Link>
          <a
            href={applyOpen ? HERITAGE_ACADEMY.applyUrl : HERITAGE_ACADEMY.learnMoreUrl}
            target="_blank"
            rel={heritageExternalRel}
            className="inline-flex items-center gap-1 text-white hover:text-[#F3C6C9] underline-offset-2 hover:underline"
          >
            {applyOpen ? 'Apply' : 'Heritage Academy'}
            <ExternalLink className="size-3" aria-hidden />
          </a>
        </div>
      </div>
    </div>
  )
}
