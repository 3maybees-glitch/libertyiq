'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ExternalLink, X } from 'lucide-react'
import { HERITAGE_ACADEMY, heritageExternalRel } from '@/lib/heritage-academy'

const HIDDEN_PATHS = new Set(['/', '/heritage-academy'])
const DISMISS_KEY = 'libertyiq-heritage-ribbon-dismissed'

export function HeritageAcademyRibbon() {
  const pathname = usePathname()
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    try {
      setDismissed(localStorage.getItem(DISMISS_KEY) === '1')
    } catch {
      setDismissed(false)
    }
  }, [])

  if (!pathname || HIDDEN_PATHS.has(pathname) || dismissed) return null

  function dismiss() {
    setDismissed(true)
    try {
      localStorage.setItem(DISMISS_KEY, '1')
    } catch {
      // ignore
    }
  }

  return (
    <div className="print:hidden border-b border-[#009CDE]/30 bg-[#0b1c2e]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-3 py-1.5 sm:px-6 lg:px-8">
        <Link href="/heritage-academy" className="shrink-0 hidden sm:block">
          <Image
            src={HERITAGE_ACADEMY.assets.eagle}
            alt=""
            width={28}
            height={28}
            className="size-7 rounded-sm object-cover"
          />
        </Link>
        <p className="min-w-0 flex-1 text-[11px] sm:text-xs leading-snug text-white/90">
          <span className="font-semibold text-white">{HERITAGE_ACADEMY.name}</span>
          <span className="text-white/75"> — {HERITAGE_ACADEMY.promoLead}</span>
        </p>
        <div className="flex shrink-0 items-center gap-2 text-[11px] font-semibold">
          <Link
            href="/heritage-academy"
            className="text-[#7FD2F3] hover:underline underline-offset-2 whitespace-nowrap"
          >
            Learn more
          </Link>
          <a
            href={HERITAGE_ACADEMY.applyUrl}
            target="_blank"
            rel={heritageExternalRel}
            className="hidden sm:inline-flex items-center gap-0.5 text-white/90 hover:text-[#7FD2F3] underline-offset-2 hover:underline whitespace-nowrap"
          >
            Apply
            <ExternalLink className="size-2.5" aria-hidden />
          </a>
          <button
            type="button"
            onClick={dismiss}
            className="rounded-md p-1 text-white/70 hover:bg-white/10 hover:text-white"
            aria-label="Dismiss Heritage Academy banner"
          >
            <X className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}