'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import {
  ChevronDown,
  FileText,
  Gavel,
  GraduationCap,
  List,
  Menu,
  Mic,
  Smartphone,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useInstallApp } from '@/components/install-app'
import ReferencesButton from '@/components/references-button'
import { cn } from '@/lib/utils'

export function IssuesJumpButton({
  className,
  fullWidth = false,
}: {
  className?: string
  fullWidth?: boolean
}) {
  return (
    <Button asChild variant="outline" className={cn('font-semibold gap-2', fullWidth && 'w-full', className)}>
      <a href="#issues">
        <List className="size-4" aria-hidden />
        Issues
      </a>
    </Button>
  )
}

function InstallAppMenuItem() {
  const { isStandalone, openGuide, platform } = useInstallApp()
  if (isStandalone) return null

  const label =
    platform === 'ios'
      ? 'Add to Home Screen'
      : platform === 'android'
        ? 'Install on phone'
        : 'Get the app'

  return (
    <DropdownMenuItem onSelect={() => openGuide()}>
      <Smartphone className="size-4" aria-hidden />
      {label}
    </DropdownMenuItem>
  )
}

export function SiteMenu({
  align = 'end',
  fullWidth = false,
}: {
  align?: 'start' | 'end'
  fullWidth?: boolean
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn('font-semibold gap-2', fullWidth && 'w-full')}
        >
          <Menu className="size-4" aria-hidden />
          Menu
          <ChevronDown className="size-4 opacity-70" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-64">
        <DropdownMenuItem asChild>
          <Link href="/libertyiq">
            <GraduationCap className="size-4" aria-hidden />
            Test Your LibertyIQ
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/speaking-trainer">
            <Mic className="size-4" aria-hidden />
            Speaking Trainer
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/pricing">
            <Sparkles className="size-4" aria-hidden />
            Pricing
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/debate-onepagers">
            <FileText className="size-4" aria-hidden />
            Debate One-Pagers
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/committees">
            <Gavel className="size-4" aria-hidden />
            Committees
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/heritage-academy">
            <GraduationCap className="size-4" aria-hidden />
            Heritage Academy
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <InstallAppMenuItem />
        <div className="p-1">
          <ReferencesButton fullWidth />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** Desktop header actions: Issues jump + compact menu. */
export function HomeDesktopNav() {
  return (
    <div className="flex items-center gap-2 shrink-0 pt-1">
      <IssuesJumpButton />
      <SiteMenu />
    </div>
  )
}

/** Mobile actions: keep the Academy CTA, then Issues, quiz, and the menu. */
export function HomeMobileNav({ academyCta }: { academyCta: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 w-full pt-1">
      {academyCta}
      <IssuesJumpButton fullWidth className="rounded-xl py-3 h-auto" />
      <Link href="/libertyiq" className="block w-full">
        <div className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl py-3 px-4 font-semibold text-sm shadow-md active:opacity-90 transition-opacity">
          <GraduationCap className="h-4 w-4 shrink-0" />
          Test Your LibertyIQ
        </div>
      </Link>
      <SiteMenu align="center" fullWidth />
    </div>
  )
}
