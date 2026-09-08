import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  ExternalLink,
  Mail,
  MessageCircle,
  Users,
} from 'lucide-react'
import {
  HeritageAcademyApplyButtons,
  HeritageAcademyTermPlate,
} from '@/components/heritage-academy-ad'
import { Button } from '@/components/ui/button'
import {
  HERITAGE_ACADEMY,
  HERITAGE_ACADEMY_SPEAKERS,
  heritageExternalRel,
  isHeritageAcademyApplyOpen,
} from '@/lib/heritage-academy'

export const metadata: Metadata = {
  title: 'Heritage Academy High School Track — Fall 2026 | LibertyIQ',
  description:
    'A LibertyIQ family recommendation: The Heritage Foundation’s free virtual High School Track. Fall 2026 runs September 28–November 23. Applications close September 13.',
  alternates: { canonical: '/heritage-academy' },
  openGraph: {
    title: 'The Heritage Academy — High School Track | LibertyIQ',
    description:
      'Free, virtual, eight-week fellowship on America’s founding principles. Fall 2026 applications close September 13.',
    url: 'https://libertyiq.org/heritage-academy',
  },
}

const FELLOWS_RECEIVE = [
  {
    title: 'Sixteen on-demand lectures',
    body: 'Policy talks you can watch when it fits a school night, a homeschool block, or a Saturday morning.',
    icon: BookOpen,
  },
  {
    title: 'Four live Q&As',
    body: 'Ask national conservative voices your questions. If you miss a session, Heritage counts the recording.',
    icon: MessageCircle,
  },
  {
    title: 'A High School Track discussion group',
    body: 'Small live conversations with students who share your values — the friendships are half the point.',
    icon: Users,
  },
  {
    title: 'A path beyond the term',
    body: 'Heritage notes that many Academy fellows later join its in-person summer High School Fellowship.',
    icon: CalendarDays,
  },
] as const

export default function HeritageAcademyPage() {
  const applyOpen = isHeritageAcademyApplyOpen()

  return (
    <div className="min-h-screen">
      <div
        className="h-1.5 w-full"
        style={{
          background:
            'linear-gradient(to right, #B22234 33%, #FFFFFF 33%, #FFFFFF 66%, #3C3B6E 66%)',
        }}
      />

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to library
        </Link>

        <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#C9A227]">
          {HERITAGE_ACADEMY.org} · {HERITAGE_ACADEMY.track} · {HERITAGE_ACADEMY.termLabel}
        </p>
        <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
          Know a student who would enjoy the Heritage Academy?
        </h1>
        <p className="mt-4 text-base sm:text-lg leading-relaxed text-foreground/95">
          The Heritage Academy is a free virtual fellowship. For eight weeks, high
          school students from across the country study America&apos;s founding
          principles, the conservative movement, and the public-policy fights that
          will shape their future — and they do it with peers who take those ideas
          seriously.
        </p>

        <HeritageAcademyTermPlate className="mt-8" />

        <HeritageAcademyApplyButtons className="mt-6" size="lg" secondary="learn-more" />

        <p className="mt-3 text-xs text-muted-foreground">
          Applications are submitted on The Heritage Foundation&apos;s site, not
          through LibertyIQ.{' '}
          <a
            href={HERITAGE_ACADEMY.learnMoreUrl}
            target="_blank"
            rel={heritageExternalRel}
            className="underline underline-offset-2 hover:text-accent"
          >
            Official program page
          </a>
          {' · '}
          <a
            href={HERITAGE_ACADEMY.faqUrl}
            target="_blank"
            rel={heritageExternalRel}
            className="underline underline-offset-2 hover:text-accent"
          >
            Academy FAQ
          </a>
        </p>

        <section className="mt-12 rounded-2xl border border-[#C9A227]/35 bg-card/70 px-5 py-6 sm:px-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A227]">
            A note from a LibertyIQ family
          </p>
          <blockquote className="mt-3 font-serif text-xl sm:text-2xl leading-snug text-foreground">
            Our son did the Heritage Academy and loved it.
          </blockquote>
          <p className="mt-4 text-sm leading-relaxed text-foreground/90">
            That is why this page exists. Heritage&apos;s student-programs team
            asked parents who have seen the Academy up close to tell other
            families, teachers, church friends, and homeschool groups. We are
            doing that here — in our own words — and sending every application
            straight to Heritage.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="font-serif text-2xl font-bold tracking-tight">What fellows actually do</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Heritage describes an eight-week, part-time fellowship. The High School
            Track is the discussion group built for students who want to defend
            their values in the classroom and find friends who share them.
          </p>
          <ul className="mt-6 space-y-4">
            {FELLOWS_RECEIVE.map((item) => (
              <li
                key={item.title}
                className="flex gap-3 rounded-xl border border-border bg-card/60 px-4 py-3"
              >
                <item.icon className="mt-0.5 size-5 shrink-0 text-[#C9A227]" aria-hidden />
                <div>
                  <p className="font-semibold text-foreground">{item.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="font-serif text-2xl font-bold tracking-tight">A typical week</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Heritage says fellows usually spend {HERITAGE_ACADEMY.weeklyHoursLabel}{' '}
            a week. {HERITAGE_ACADEMY.weeklyHoursDetail} Miss a live Q&amp;A, and
            the recording still counts. Miss a small-group meeting, and Heritage
            offers a short makeup assignment — the conversations themselves are
            not recorded.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="font-serif text-2xl font-bold tracking-tight">Who should apply</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            The High School Track is for students who already care about
            conservative ideas — club leaders, homeschoolers, and anyone who wants
            a serious place to study policy with peers. You need a reliable
            internet connection. Heritage has hosted Academy fellows from all 50
            states and more than 40 countries. Applications are reviewed in the
            two weeks before the term begins.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="font-serif text-2xl font-bold tracking-tight">Voices on the roster</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Heritage&apos;s Academy page currently lists these featured speakers.
            Confirm the live roster on their site before you apply.
          </p>
          <ul className="mt-5 divide-y divide-border/60 rounded-xl border border-border bg-card/60">
            {HERITAGE_ACADEMY_SPEAKERS.map((speaker) => (
              <li key={speaker.name} className="px-4 py-3">
                <p className="font-semibold text-foreground">{speaker.name}</p>
                <p className="text-sm text-muted-foreground">{speaker.role}</p>
              </li>
            ))}
          </ul>
          <a
            href={HERITAGE_ACADEMY.speakersUrl}
            target="_blank"
            rel={heritageExternalRel}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
          >
            Heritage&apos;s speaker list
            <ExternalLink className="size-3.5" aria-hidden />
          </a>
        </section>

        <section className="mt-12 rounded-2xl border border-primary/35 bg-primary/10 px-5 py-6 sm:px-7">
          <h2 className="font-serif text-2xl font-bold tracking-tight">
            {applyOpen ? 'Applications close September 13' : 'This term’s window has closed'}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-foreground/90">
            {applyOpen
              ? `The ${HERITAGE_ACADEMY.termLabel} High School Track runs ${HERITAGE_ACADEMY.programRangeLabel}. There is no tuition. If this is a student you would trust with a serious conversation about the country, send them Heritage’s application.`
              : `The ${HERITAGE_ACADEMY.termLabel} term was ${HERITAGE_ACADEMY.programRangeLabel}. Check Heritage’s Academy page for the next application window.`}
          </p>
          <HeritageAcademyApplyButtons className="mt-5" secondary="learn-more" />
        </section>

        <section className="mt-12">
          <h2 className="font-serif text-2xl font-bold tracking-tight">Questions</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Program questions go to Heritage, not LibertyIQ.
          </p>
          <p className="mt-3 inline-flex items-center gap-2 text-sm font-semibold">
            <Mail className="size-4 text-[#C9A227]" aria-hidden />
            <a
              href={`mailto:${HERITAGE_ACADEMY.contactEmail}`}
              className="hover:text-accent hover:underline"
            >
              {HERITAGE_ACADEMY.contactEmail}
            </a>
          </p>
        </section>

        <footer className="mt-16 border-t border-border/40 pt-6 text-xs leading-relaxed text-muted-foreground">
          <p>
            LibertyIQ is an independent site. This page is a family
            recommendation, shared after Heritage asked parents who know the
            Academy to tell other families. {HERITAGE_ACADEMY.name} is a program
            of {HERITAGE_ACADEMY.org}. Names and trademarks belong to their
            owners. We do not collect Academy applications.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button asChild variant="outline" size="sm" className="font-semibold">
              <a href={HERITAGE_ACADEMY.learnMoreUrl} target="_blank" rel={heritageExternalRel}>
                heritage.org/the-academy
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
