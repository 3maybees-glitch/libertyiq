import Image from 'next/image'
import Link from 'next/link'
import { Download, ExternalLink } from 'lucide-react'
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
  secondary = 'invitation',
}: {
  className?: string
  size?: 'default' | 'lg'
  secondary?: 'invitation' | 'flyer' | 'learn-more' | 'none'
}) {
  const applyOpen = isHeritageAcademyApplyOpen()

  return (
    <div className={cn('flex flex-col sm:flex-row gap-2 sm:gap-3', className)}>
      <Button
        asChild
        size={size}
        className="font-semibold text-white hover:opacity-90"
        style={{ backgroundColor: HERITAGE_ACADEMY.brandBlue }}
      >
        <a
          href={applyOpen ? HERITAGE_ACADEMY.applyUrl : HERITAGE_ACADEMY.learnMoreUrl}
          target="_blank"
          rel={heritageExternalRel}
        >
          {applyOpen ? HERITAGE_ACADEMY.applyNow : 'See Heritage Academy'}
          <ExternalLink className="size-4" aria-hidden />
        </a>
      </Button>
      {secondary === 'invitation' && (
        <Button asChild size={size} variant="outline" className="font-semibold">
          <Link href="/heritage-academy">See the official flyer</Link>
        </Button>
      )}
      {secondary === 'flyer' && (
        <Button asChild size={size} variant="outline" className="font-semibold">
          <a href={HERITAGE_ACADEMY.flyerPdf} download>
            Download the flyer
            <Download className="size-4" aria-hidden />
          </a>
        </Button>
      )}
      {secondary === 'learn-more' && (
        <Button asChild size={size} variant="outline" className="font-semibold">
          <a
            href={HERITAGE_ACADEMY.learnMoreUrl}
            target="_blank"
            rel={heritageExternalRel}
          >
            {HERITAGE_ACADEMY.printedUrl}
            <ExternalLink className="size-4" aria-hidden />
          </a>
        </Button>
      )}
    </div>
  )
}

function OfficialPoster({
  src,
  alt,
  href,
  priority = false,
  width,
  height,
  className,
}: {
  src: string
  alt: string
  href: string
  priority?: boolean
  width: number
  height: number
  className?: string
}) {
  const external = href.startsWith('http')
  const image = (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className="h-auto w-full"
    />
  )

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel={heritageExternalRel}
        className={cn(
          'block overflow-hidden rounded-lg border border-white/15 bg-black shadow-lg transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#009CDE]',
          className,
        )}
      >
        {image}
      </a>
    )
  }

  return (
    <Link
      href={href}
      className={cn(
        'block overflow-hidden rounded-lg border border-white/15 bg-black shadow-lg transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#009CDE]',
        className,
      )}
    >
      {image}
    </Link>
  )
}

export function HeritageAcademyFeatured({ className }: { className?: string }) {
  const applyOpen = isHeritageAcademyApplyOpen()
  const applyHref = applyOpen ? HERITAGE_ACADEMY.applyUrl : HERITAGE_ACADEMY.learnMoreUrl

  return (
    <aside
      className={cn('overflow-hidden rounded-2xl border border-[#009CDE]/40 bg-[#0b1c2e] shadow-lg', className)}
      aria-labelledby="heritage-academy-ad-heading"
    >
      <div className="grid gap-0 lg:grid-cols-2">
        <OfficialPoster
          src={HERITAGE_ACADEMY.assets.libertyBell}
          alt="Heritage Academy official flyer: an online public policy fellowship. Applications now open. Apply by September 13. heritage.org/heritage-academy"
          href={applyHref}
          priority
          width={1400}
          height={1750}
        />
        <OfficialPoster
          src={HERITAGE_ACADEMY.assets.onlineFellowship}
          alt="Heritage Academy official flyer featuring a lecture, Why Be a Conservative?, with Dr. Kevin Roberts, President of The Heritage Foundation. Applications now open. Apply by September 13."
          href="/heritage-academy"
          width={1400}
          height={1750}
          className="hidden sm:block"
        />
      </div>
      <div className="px-5 py-4 sm:px-6 sm:py-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7FD2F3]">
          {HERITAGE_ACADEMY.org} flyer
        </p>
        <h2
          id="heritage-academy-ad-heading"
          className="mt-1 font-serif text-2xl font-bold tracking-tight text-white"
        >
          {HERITAGE_ACADEMY.name}
        </h2>
        <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-white/85">
          {HERITAGE_ACADEMY.tagline}
        </p>
        <p className="mt-2 text-sm text-white/90">
          {applyOpen ? HERITAGE_ACADEMY.applicationsOpen : 'See Heritage Academy for the next term.'}{' '}
          <span className="font-bold">{applyOpen ? HERITAGE_ACADEMY.applyBy : ''}</span>
        </p>
        <HeritageAcademyApplyButtons className="mt-4" />
      </div>
    </aside>
  )
}
