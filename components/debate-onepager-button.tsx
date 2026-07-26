'use client'

import { FileDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getDebateOnePager } from '@/lib/debate-onepagers'
import { cn } from '@/lib/utils'

type Props = {
  topicId: string
  /** Compact for stats rows; default is a normal button */
  size?: 'default' | 'sm' | 'lg'
  variant?: 'default' | 'outline' | 'secondary'
  className?: string
  fullWidth?: boolean
  label?: string
}

export function DebateOnePagerButton({
  topicId,
  size = 'sm',
  variant = 'outline',
  className,
  fullWidth,
  label,
}: Props) {
  const sheet = getDebateOnePager(topicId)
  if (!sheet) return null

  return (
    <Button
      asChild
      variant={variant}
      size={size}
      className={cn(
        'gap-2 font-semibold whitespace-nowrap',
        fullWidth && 'w-full',
        className
      )}
    >
      <a
        href={sheet.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`View ${sheet.title} debate one-pager (${sheet.acronym})`}
      >
        <FileDown className="h-4 w-4 shrink-0" />
        {label ?? `One-Pager (${sheet.acronym})`}
      </a>
    </Button>
  )
}
