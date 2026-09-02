import Link from 'next/link'
import { ArrowLeft, Gavel } from 'lucide-react'
import { formatUpdated, getCongress, getGeneratedAt } from '@/lib/committees/roster'
import { cn } from '@/lib/utils'

type Props = {
  children: React.ReactNode
  kicker?: string
  title: string
  description?: string
  actions?: React.ReactNode
  className?: string
}

export function CommitteesShell({ children, kicker, title, description, actions, className }: Props) {
  const congress = getCongress()
  const updated = formatUpdated(getGeneratedAt())

  return (
    <div className={cn('min-h-screen committees-print-root', className)}>
      <div
        className="h-1.5 w-full print:hidden"
        style={{ background: 'linear-gradient(to right, #B22234 33%, #FFFFFF 33%, #FFFFFF 66%, #3C3B6E 66%)' }}
      />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="print:hidden flex flex-wrap items-center justify-between gap-3 mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to library
          </Link>
          {actions}
        </div>

        <header className="mb-8 border border-border/70 bg-card/80 px-5 py-5 sm:px-6 rounded-xl committees-nameplate">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
                {kicker ?? `${congress}th Congress`}
              </p>
              <h1 className="mt-1 text-3xl sm:text-4xl font-bold font-serif tracking-tight flex items-center gap-2">
                <Gavel className="h-7 w-7 text-primary print:hidden" />
                {title}
              </h1>
              {description ? (
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-2xl">{description}</p>
              ) : null}
            </div>
            <p className="text-xs text-muted-foreground shrink-0 border border-border/60 rounded-md px-3 py-2 bg-background/40">
              Last updated
              <span className="block font-semibold text-foreground">{updated}</span>
            </p>
          </div>
        </header>

        {children}
      </div>
    </div>
  )
}
