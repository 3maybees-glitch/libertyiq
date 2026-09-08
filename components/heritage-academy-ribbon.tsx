'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ExternalLink } from 'lucide-react'
import {
  HERITAGE_ACADEMY,
  heritageExternalRel,
  isHeritageAcademyApplyOpen,
} from '@/lib/heritage-academy'

const HIDDEN_PATHS = new Set(['/', '/heritage-academy'])

export function HeritageAcademyRibbon() {
  const pathname = usePathname()
  if (!pathname || HIDDEN_PATHS.has(pathname)) return null

  const applyOpen = isHeritageAcademyApplyOpen()

  return (
    <div className="print:hidden border-b border-[#009CDE]/40 bg-[#0b1c2e]">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2 sm:px-6 lg:px-8">
        <Link href="/heritage-academy" className="shrink-0">
          <Image
            src={HERITAGE_ACADEMY.assets.eagle}
            alt=""
            width={40}
            height={40}
            className="size-10 rounded-sm object-cover"
          />
        </Link>
        <p className="min-w-0 flex-1 text-xs sm:text-sm leading-snug text-white">
          <span className="font-semibold">{HERITAGE_ACADEMY.name}</span>
          <span className="text-white/80"> — {HERITAGE_ACADEMY.tagline}. </span>
          {applyOpen ? (
            <span className="font-bold text-[#7FD2F3]">{HERITAGE_ACADEMY.applyBy}</span>
          ) : (
            <span className="text-white/80">Fall 2026 applications have closed.</span>
          )}
        </p>
        <div className="flex shrink-0 items-center gap-3 text-xs font-semibold">
          <Link href="/heritage-academy" className="text-[#7FD2F3] hover:underline underline-offset-2">
            Flyer
          </Link>
          <a
            href={applyOpen ? HERITAGE_ACADEMY.applyUrl : HERITAGE_ACADEMY.learnMoreUrl}
            target="_blank"
            rel={heritageExternalRel}
            className="inline-flex items-center gap-1 text-white hover:text-[#7FD2F3] underline-offset-2 hover:underline"
          >
            {applyOpen ? 'APPLY NOW' : 'Heritage'}
            <ExternalLink className="size-3" aria-hidden />
          </a>
        </div>
      </div>
    </div>
  )
}
