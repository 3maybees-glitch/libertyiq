'use client'

import { useEffect, useState } from 'react'
import { Download, Share, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const DISMISS_KEY = 'libertyiq-pwa-install-dismissed'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

function isStandaloneDisplay() {
  if (typeof window === 'undefined') return false
  const media = window.matchMedia('(display-mode: standalone)').matches
  const iosStandalone =
    'standalone' in window.navigator &&
    Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone)
  return media || iosStandalone
}

function isIosSafari() {
  if (typeof window === 'undefined') return false
  const ua = window.navigator.userAgent
  const iOS = /iPad|iPhone|iPod/.test(ua) || (ua.includes('Mac') && 'ontouchend' in document)
  const webkit = /WebKit/.test(ua)
  const chromeOrCriOS = /CriOS|FxiOS|EdgiOS|OPiOS|Chrome/.test(ua)
  return iOS && webkit && !chromeOrCriOS
}

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)
  const [iosHint, setIosHint] = useState(false)

  useEffect(() => {
    if (isStandaloneDisplay()) return
    try {
      if (localStorage.getItem(DISMISS_KEY) === '1') return
    } catch {
      // ignore storage errors
    }

    if (isIosSafari()) {
      setIosHint(true)
      setVisible(true)
      return
    }

    const onBeforeInstall = (event: Event) => {
      event.preventDefault()
      setDeferred(event as BeforeInstallPromptEvent)
      setVisible(true)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall)
  }, [])

  function dismiss() {
    setVisible(false)
    setDeferred(null)
    try {
      localStorage.setItem(DISMISS_KEY, '1')
    } catch {
      // ignore
    }
  }

  async function install() {
    if (!deferred) return
    await deferred.prompt()
    await deferred.userChoice
    setDeferred(null)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="region"
      aria-label="Install LibertyIQ"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(0,0,0,0.08)]"
    >
      <div className="mx-auto flex max-w-3xl items-start gap-3 sm:items-center">
        <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-[color:#3C3B6E] text-white sm:mt-0">
          {iosHint ? <Share className="size-4" aria-hidden /> : <Download className="size-4" aria-hidden />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">Install LibertyIQ</p>
          <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
            {iosHint ? (
              <>
                Tap Share, then <span className="font-medium text-foreground">Add to Home Screen</span> for
                one-tap access to the library and quizzes.
              </>
            ) : (
              <>Add to your home screen for faster access. Library and quizzes work offline after you visit them.</>
            )}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {!iosHint && deferred && (
            <Button size="sm" className="font-semibold" onClick={() => void install()}>
              Install
            </Button>
          )}
          <Button
            size="icon"
            variant="ghost"
            className="size-8"
            onClick={dismiss}
            aria-label="Dismiss install prompt"
          >
            <X className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
