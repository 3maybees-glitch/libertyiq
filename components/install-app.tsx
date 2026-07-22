'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { Download, Smartphone, Share, MoreVertical, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

const DISMISS_KEY = 'libertyiq-pwa-install-dismissed'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

type Platform = 'ios' | 'android' | 'desktop'

type InstallAppContextValue = {
  isStandalone: boolean
  platform: Platform
  openGuide: () => void
  canNativeInstall: boolean
  nativeInstall: () => Promise<void>
}

const InstallAppContext = createContext<InstallAppContextValue | null>(null)

function isStandaloneDisplay() {
  if (typeof window === 'undefined') return false
  const media = window.matchMedia('(display-mode: standalone)').matches
  const iosStandalone =
    'standalone' in window.navigator &&
    Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone)
  return media || iosStandalone
}

function detectPlatform(): Platform {
  if (typeof window === 'undefined') return 'desktop'
  const ua = window.navigator.userAgent
  if (/iPad|iPhone|iPod/.test(ua) || (ua.includes('Mac') && 'ontouchend' in document)) {
    return 'ios'
  }
  if (/Android/i.test(ua)) return 'android'
  return 'desktop'
}

export function useInstallApp() {
  const ctx = useContext(InstallAppContext)
  if (!ctx) {
    throw new Error('useInstallApp must be used within InstallAppProvider')
  }
  return ctx
}

export function InstallAppProvider({ children }: { children: ReactNode }) {
  const [isStandalone, setIsStandalone] = useState(false)
  const [platform, setPlatform] = useState<Platform>('desktop')
  const [guideOpen, setGuideOpen] = useState(false)
  const [bannerVisible, setBannerVisible] = useState(false)
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    const standalone = isStandaloneDisplay()
    setIsStandalone(standalone)
    setPlatform(detectPlatform())
    if (standalone) return

    let dismissed = false
    try {
      dismissed = localStorage.getItem(DISMISS_KEY) === '1'
    } catch {
      // ignore storage errors
    }

    let timer: number | undefined
    if (!dismissed) {
      // Soft nudge after a beat so it doesn't fight the first paint.
      timer = window.setTimeout(() => {
        if (!isStandaloneDisplay()) setBannerVisible(true)
      }, 1800)
    }

    const onBeforeInstall = (event: Event) => {
      event.preventDefault()
      setDeferred(event as BeforeInstallPromptEvent)
      if (!dismissed) setBannerVisible(true)
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    return () => {
      if (timer !== undefined) window.clearTimeout(timer)
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
    }
  }, [])

  const openGuide = useCallback(() => {
    setGuideOpen(true)
  }, [])

  const dismissBanner = useCallback(() => {
    setBannerVisible(false)
    try {
      localStorage.setItem(DISMISS_KEY, '1')
    } catch {
      // ignore
    }
  }, [])

  const nativeInstall = useCallback(async () => {
    if (!deferred) return
    await deferred.prompt()
    await deferred.userChoice
    setDeferred(null)
    setBannerVisible(false)
    setGuideOpen(false)
  }, [deferred])

  const value = useMemo(
    () => ({
      isStandalone,
      platform,
      openGuide,
      canNativeInstall: Boolean(deferred),
      nativeInstall,
    }),
    [isStandalone, platform, openGuide, deferred, nativeInstall],
  )

  return (
    <InstallAppContext.Provider value={value}>
      {children}
      {!isStandalone && (
        <>
          {bannerVisible && (
            <InstallBanner
              platform={platform}
              canNativeInstall={Boolean(deferred)}
              onInstall={() => void nativeInstall()}
              onHow={openGuide}
              onDismiss={dismissBanner}
            />
          )}
          <InstallGuideSheet
            open={guideOpen}
            onOpenChange={setGuideOpen}
            platform={platform}
            canNativeInstall={Boolean(deferred)}
            onInstall={() => void nativeInstall()}
          />
        </>
      )}
    </InstallAppContext.Provider>
  )
}

function InstallBanner({
  platform,
  canNativeInstall,
  onInstall,
  onHow,
  onDismiss,
}: {
  platform: Platform
  canNativeInstall: boolean
  onInstall: () => void
  onHow: () => void
  onDismiss: () => void
}) {
  const blurb =
    platform === 'ios'
      ? 'Put LibertyIQ on your home screen — tap How for 3 quick steps.'
      : platform === 'android'
        ? 'Install LibertyIQ like an app — tap How for step-by-step help.'
        : 'Add LibertyIQ to your device for one-tap access to the library and quizzes.'

  return (
    <div
      role="region"
      aria-label="Install LibertyIQ on your phone"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(0,0,0,0.08)]"
    >
      <div className="mx-auto flex max-w-3xl items-start gap-3 sm:items-center">
        <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-[color:#3C3B6E] text-white sm:mt-0">
          <Smartphone className="size-4" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">Use LibertyIQ on your phone</p>
          <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{blurb}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {canNativeInstall && (
            <Button size="sm" className="font-semibold" onClick={onInstall}>
              Install
            </Button>
          )}
          <Button size="sm" variant={canNativeInstall ? 'secondary' : 'default'} className="font-semibold" onClick={onHow}>
            How
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="size-8"
            onClick={onDismiss}
            aria-label="Dismiss install tip"
          >
            <X className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function Step({ n, children }: { n: number; children: ReactNode }) {
  return (
    <li className="flex gap-3">
      <span
        className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[color:#3C3B6E] text-[11px] font-bold text-white"
        aria-hidden
      >
        {n}
      </span>
      <p className="text-sm text-foreground leading-relaxed pt-0.5">{children}</p>
    </li>
  )
}

function InstallGuideSheet({
  open,
  onOpenChange,
  platform,
  canNativeInstall,
  onInstall,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  platform: Platform
  canNativeInstall: boolean
  onInstall: () => void
}) {
  const title =
    platform === 'ios'
      ? 'Add LibertyIQ on iPhone'
      : platform === 'android'
        ? 'Install LibertyIQ on Android'
        : 'Install LibertyIQ'

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-2xl px-5 pb-8 pt-2">
        <SheetHeader className="text-left pb-2">
          <SheetTitle className="font-serif text-2xl">{title}</SheetTitle>
          <SheetDescription>
            Keep the library and quizzes one tap away. Works best when you open this site in your phone&apos;s
            browser (Safari on iPhone, Chrome on Android).
          </SheetDescription>
        </SheetHeader>

        {canNativeInstall && (
          <div className="mb-5">
            <Button className="w-full font-semibold gap-2" size="lg" onClick={onInstall}>
              <Download className="size-4" aria-hidden />
              Install now
            </Button>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Or follow the steps below if Install doesn&apos;t appear.
            </p>
          </div>
        )}

        {platform === 'ios' && (
          <ol className="space-y-4">
            <Step n={1}>
              Tap the <Share className="inline size-3.5 align-text-bottom mx-0.5" aria-hidden />{' '}
              <span className="font-semibold">Share</span> button at the bottom of Safari.
            </Step>
            <Step n={2}>
              Scroll the sheet and tap{' '}
              <span className="font-semibold">Add to Home Screen</span>.
            </Step>
            <Step n={3}>
              Tap <span className="font-semibold">Add</span>. LibertyIQ will show up on your home screen
              like an app.
            </Step>
          </ol>
        )}

        {platform === 'android' && (
          <ol className="space-y-4">
            <Step n={1}>
              Tap the <MoreVertical className="inline size-3.5 align-text-bottom mx-0.5" aria-hidden />{' '}
              <span className="font-semibold">menu</span> (three dots) in Chrome.
            </Step>
            <Step n={2}>
              Tap <span className="font-semibold">Install app</span> or{' '}
              <span className="font-semibold">Add to Home screen</span>.
            </Step>
            <Step n={3}>
              Confirm — then open LibertyIQ from your home screen anytime, even offline for pages you&apos;ve
              already visited.
            </Step>
          </ol>
        )}

        {platform === 'desktop' && (
          <div className="space-y-5">
            <ol className="space-y-4">
              <Step n={1}>
                In Chrome or Edge, look for an <span className="font-semibold">install icon</span> in the
                address bar, or open the browser menu.
              </Step>
              <Step n={2}>
                Choose <span className="font-semibold">Install LibertyIQ</span> /{' '}
                <span className="font-semibold">Install app</span>.
              </Step>
            </ol>
            <div className="border-t border-border pt-4">
              <p className="text-sm font-semibold text-foreground mb-3">On your phone instead</p>
              <ol className="space-y-4">
                <Step n={1}>Open https://libertyiq.org in Safari (iPhone) or Chrome (Android).</Step>
                <Step n={2}>
                  iPhone: Share → <span className="font-semibold">Add to Home Screen</span>. Android: menu →{' '}
                  <span className="font-semibold">Install app</span>.
                </Step>
              </ol>
            </div>
          </div>
        )}

        <p className="mt-6 text-xs text-muted-foreground leading-relaxed">
          Tip: if you opened LibertyIQ inside Instagram, Facebook, or another in-app browser, tap{' '}
          <span className="font-medium text-foreground">Open in browser</span> first — then install from
          there.
        </p>
      </SheetContent>
    </Sheet>
  )
}

type InstallAppButtonProps = {
  className?: string
  fullWidth?: boolean
  variant?: 'default' | 'secondary' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
}

/** Always-visible entry point so visitors can learn how to install even after dismissing the banner. */
export function InstallAppButton({
  className,
  fullWidth,
  variant = 'outline',
  size = 'default',
}: InstallAppButtonProps) {
  const { isStandalone, openGuide, platform } = useInstallApp()

  if (isStandalone) return null

  const label =
    platform === 'ios'
      ? 'Add to Home Screen'
      : platform === 'android'
        ? 'Install on phone'
        : 'Get the app'

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={cn('font-semibold gap-2', fullWidth && 'w-full', className)}
      onClick={openGuide}
    >
      <Smartphone className="size-4 shrink-0" aria-hidden />
      {label}
    </Button>
  )
}

/** Mobile home CTA styled like the other stacked action rows. */
export function InstallAppHomeLink({ className }: { className?: string }) {
  const { isStandalone, openGuide, platform } = useInstallApp()

  if (isStandalone) return null

  const label =
    platform === 'ios'
      ? 'Add to Home Screen'
      : platform === 'android'
        ? 'Install on your phone'
        : 'Get LibertyIQ on your phone'

  return (
    <button
      type="button"
      onClick={openGuide}
      className={cn(
        'w-full flex items-center justify-center gap-2 border border-border text-foreground rounded-xl py-3 px-4 font-semibold text-sm active:opacity-90 transition-opacity',
        className,
      )}
    >
      <Smartphone className="h-4 w-4 shrink-0" aria-hidden />
      {label}
    </button>
  )
}
