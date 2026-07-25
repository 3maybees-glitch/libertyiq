import Link from 'next/link'
import { ArrowLeft, FileDown } from 'lucide-react'
import { debateOnePagers } from '@/lib/debate-onepagers'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Debate One-Pagers | LibertyIQ',
  description:
    'Printable one-page talking points for every LibertyIQ issue — acronym paths and They say → You say counters.',
}

export default function DebateOnePagersPage() {
  return (
    <div className="min-h-screen bg-background">
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

        <header className="mt-6 mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-primary tracking-tight">
            Debate One-Pagers
          </h1>
          <p className="mt-2 text-muted-foreground leading-relaxed max-w-2xl">
            One printable page per issue: memory-hook acronym, debate path with
            arrows, and They say → You say counters.
          </p>
        </header>

        <ul className="space-y-3">
          {debateOnePagers.map((sheet, index) => (
            <li
              key={sheet.topicId}
              className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-border bg-card px-4 py-3"
            >
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <span className="shrink-0 mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground leading-snug">
                    {sheet.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Memory hook:{' '}
                    <span className="font-bold text-accent tracking-wide">
                      {sheet.acronym}
                    </span>
                  </p>
                </div>
              </div>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="gap-2 font-semibold shrink-0 w-full sm:w-auto"
              >
                <a
                  href={sheet.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FileDown className="h-4 w-4" />
                  View PDF
                </a>
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
