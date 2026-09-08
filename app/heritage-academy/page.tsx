import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Download, ExternalLink } from 'lucide-react'
import { HeritageAcademyApplyButtons } from '@/components/heritage-academy-ad'
import { Button } from '@/components/ui/button'
import {
  HERITAGE_ACADEMY,
  heritageExternalRel,
  isHeritageAcademyApplyOpen,
} from '@/lib/heritage-academy'

export const metadata: Metadata = {
  title: 'Heritage Academy — Official Fall 2026 Flyer | LibertyIQ',
  description:
    'Official Heritage Foundation flyer: Heritage Academy is an online public policy fellowship. Applications now open. Apply by September 13. heritage.org/heritage-academy',
  alternates: { canonical: '/heritage-academy' },
  openGraph: {
    title: 'Heritage Academy — An online public policy fellowship',
    description: 'Applications now open. Apply by September 13. heritage.org/heritage-academy',
    url: 'https://libertyiq.org/heritage-academy',
    images: [
      {
        url: '/heritage-academy/og.jpg',
        width: 1200,
        height: 630,
        alt: 'Heritage Academy official flyer',
      },
    ],
  },
}

export default function HeritageAcademyPage() {
  const applyOpen = isHeritageAcademyApplyOpen()
  const applyHref = applyOpen ? HERITAGE_ACADEMY.applyUrl : HERITAGE_ACADEMY.learnMoreUrl

  return (
    <div className="min-h-screen">
      <div
        className="h-1.5 w-full"
        style={{
          background:
            'linear-gradient(to right, #B22234 33%, #FFFFFF 33%, #FFFFFF 66%, #3C3B6E 66%)',
        }}
      />

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to library
        </Link>

        <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7FD2F3]">
          Official {HERITAGE_ACADEMY.org} materials
        </p>
        <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
          {HERITAGE_ACADEMY.name}
        </h1>
        <p className="mt-2 text-sm font-semibold uppercase tracking-[0.16em] text-white/80">
          {HERITAGE_ACADEMY.tagline}
        </p>
        <p className="mt-4 text-lg font-serif leading-snug text-foreground">
          {HERITAGE_ACADEMY.headline}
          <br />
          {HERITAGE_ACADEMY.subhead}
        </p>
        <p className="mt-4 text-sm sm:text-base leading-relaxed text-foreground/95">
          {HERITAGE_ACADEMY.description}
        </p>

        <HeritageAcademyApplyButtons className="mt-6" size="lg" secondary="flyer" />
        <p className="mt-3 text-xs text-muted-foreground">
          {applyOpen ? HERITAGE_ACADEMY.applyBy : 'Fall 2026 applications have closed.'} ·{' '}
          <a
            href={HERITAGE_ACADEMY.learnMoreUrl}
            target="_blank"
            rel={heritageExternalRel}
            className="underline underline-offset-2 hover:text-[#7FD2F3]"
          >
            {HERITAGE_ACADEMY.printedUrl}
          </a>
        </p>

        <section className="mt-10">
          <h2 className="font-serif text-2xl font-bold tracking-tight">Official flyer</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The two-page flyer Heritage asked families to share.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <a
              href={applyHref}
              target="_blank"
              rel={heritageExternalRel}
              className="overflow-hidden rounded-lg border border-white/15 bg-black shadow-lg"
            >
              <Image
                src={HERITAGE_ACADEMY.assets.flyerPage1}
                alt="Heritage Academy official flyer, page 1: Want to help restore America? Take your next step as a Heritage Academy Fellow. Apply today. heritage.org/heritage-academy"
                width={864}
                height={1296}
                className="h-auto w-full"
                priority
              />
            </a>
            <a
              href={HERITAGE_ACADEMY.learnMoreUrl}
              target="_blank"
              rel={heritageExternalRel}
              className="overflow-hidden rounded-lg border border-white/15 bg-black shadow-lg"
            >
              <Image
                src={HERITAGE_ACADEMY.assets.flyerPage2}
                alt="Heritage Academy official flyer, page 2: Who should apply — high school students, college students, professionals and patriots — and policy lecture topics. Apply now. heritage.org/heritage-academy"
                width={864}
                height={1296}
                className="h-auto w-full"
              />
            </a>
          </div>
          <Button asChild variant="outline" className="mt-4 font-semibold">
            <a href={HERITAGE_ACADEMY.flyerPdf} download>
              Download Heritage Academy Flyer 2026 (PDF)
              <Download className="size-4" aria-hidden />
            </a>
          </Button>
        </section>

        <section className="mt-12">
          <h2 className="font-serif text-2xl font-bold tracking-tight">Official graphics</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <a
              href={applyHref}
              target="_blank"
              rel={heritageExternalRel}
              className="overflow-hidden rounded-lg border border-white/15 bg-black shadow-lg"
            >
              <Image
                src={HERITAGE_ACADEMY.assets.libertyBell}
                alt="Heritage Academy Liberty Bell graphic. Applications now open. Apply by September 13."
                width={1400}
                height={1750}
                className="h-auto w-full"
              />
            </a>
            <a
              href={applyHref}
              target="_blank"
              rel={heritageExternalRel}
              className="overflow-hidden rounded-lg border border-white/15 bg-black shadow-lg"
            >
              <Image
                src={HERITAGE_ACADEMY.assets.onlineFellowship}
                alt="Heritage Academy online fellowship graphic with Dr. Kevin Roberts lecture, Why Be a Conservative? Apply by September 13."
                width={1400}
                height={1750}
                className="h-auto w-full"
              />
            </a>
            <a
              href={HERITAGE_ACADEMY.learnMoreUrl}
              target="_blank"
              rel={heritageExternalRel}
              className="overflow-hidden rounded-lg border border-white/15 bg-black shadow-lg"
            >
              <Image
                src={HERITAGE_ACADEMY.assets.eagle}
                alt="Heritage Academy eagle graphic. An online public policy fellowship. Applications now open. Apply by September 13."
                width={1200}
                height={1200}
                className="h-auto w-full"
              />
            </a>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-serif text-2xl font-bold tracking-tight">From the flyer</h2>
          <ul className="mt-5 space-y-3">
            {HERITAGE_ACADEMY.pillars.map((item) => (
              <li key={item.title} className="rounded-xl border border-[#009CDE]/30 bg-[#0b1c2e]/80 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#7FD2F3]">{item.title}</p>
                <p className="mt-1 text-sm text-white">{item.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="font-serif text-2xl font-bold tracking-tight">Who should apply?</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {HERITAGE_ACADEMY.whoShouldApply} We have three dedicated discussion tracks for:
          </p>
          <ul className="mt-5 space-y-3">
            {HERITAGE_ACADEMY.tracks.map((track) => (
              <li key={track.title} className="rounded-xl border border-border bg-card/60 px-4 py-3">
                <p className="font-semibold uppercase tracking-wide text-sm">{track.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{track.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="font-serif text-2xl font-bold tracking-tight">Policy lectures include</h2>
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {HERITAGE_ACADEMY.lectures.map((lecture) => (
              <li
                key={lecture}
                className="rounded-lg border border-border bg-card/60 px-4 py-3 text-sm font-semibold"
              >
                {lecture}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12 rounded-2xl px-5 py-6 sm:px-7" style={{ backgroundColor: HERITAGE_ACADEMY.brandBlue }}>
          <p className="text-2xl font-bold text-white">{HERITAGE_ACADEMY.applicationsOpen}</p>
          <p className="mt-1 text-lg font-bold uppercase tracking-wide text-[#0b1c2e]">
            {HERITAGE_ACADEMY.applyBy}
          </p>
          <p className="mt-2 text-sm text-white/90">{HERITAGE_ACADEMY.printedUrl}</p>
          <HeritageAcademyApplyButtons className="mt-5" secondary="learn-more" />
        </section>

        <footer className="mt-16 border-t border-border/40 pt-6 text-xs leading-relaxed text-muted-foreground">
          <p>
            Flyers and graphics © {HERITAGE_ACADEMY.org}. LibertyIQ is sharing these official
            materials at Heritage&apos;s request. Applications are submitted on Heritage&apos;s
            site.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button asChild variant="outline" size="sm" className="font-semibold">
              <a href={HERITAGE_ACADEMY.learnMoreUrl} target="_blank" rel={heritageExternalRel}>
                {HERITAGE_ACADEMY.printedUrl}
                <ExternalLink className="size-3.5" aria-hidden />
              </a>
            </Button>
            <Button asChild variant="ghost" size="sm" className="font-semibold">
              <Link href="/">Return to LibertyIQ</Link>
            </Button>
          </div>
        </footer>
      </div>
    </div>
  )
}
