'use client'

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import type { PaidPlan } from '@/lib/pricing'

const SOFT_PRO_KEY = 'li_pro_soft'

type EntitlementState = {
  isPro: boolean
  configured: boolean
  loading: boolean
  customerId?: string
  refresh: () => Promise<void>
  startCheckout: (plan: PaidPlan) => Promise<void>
  openPortal: () => Promise<void>
  grantSoftPro: (sessionId: string) => void
}

const EntitlementContext = createContext<EntitlementState | null>(null)

function readSoftPro(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const raw = localStorage.getItem(SOFT_PRO_KEY)
    if (!raw) return false
    const parsed = JSON.parse(raw) as { sessionId?: string; at?: number }
    return Boolean(parsed.sessionId && String(parsed.sessionId).startsWith('cs_'))
  } catch {
    return false
  }
}

async function readEntitlement(): Promise<{
  isPro: boolean
  configured: boolean
  customerId?: string
  mode?: 'checkout_session' | 'payment_links' | 'none'
}> {
  const res = await fetch('/api/entitlement', { credentials: 'include' })
  if (!res.ok) return { isPro: false, configured: true }
  return res.json()
}

export function EntitlementProvider({ children }: { children: ReactNode }) {
  const [isPro, setIsPro] = useState(false)
  const [configured, setConfigured] = useState(true)
  const [loading, setLoading] = useState(true)
  const [customerId, setCustomerId] = useState<string | undefined>()

  const refresh = useCallback(async () => {
    try {
      const data = await readEntitlement()
      const soft = data.mode === 'payment_links' && readSoftPro()
      setIsPro(Boolean(data.isPro) || soft)
      setConfigured(data.configured !== false)
      setCustomerId(data.customerId)
    } catch {
      setIsPro(false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const grantSoftPro = useCallback((sessionId: string) => {
    if (!sessionId.startsWith('cs_')) return
    localStorage.setItem(
      SOFT_PRO_KEY,
      JSON.stringify({ sessionId, at: Date.now() }),
    )
    setIsPro(true)
  }, [])

  const startCheckout = useCallback(async (plan: PaidPlan) => {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    })
    const data = await res.json()
    if (!res.ok || !data.url) {
      throw new Error(data.error || 'Unable to start checkout')
    }
    window.location.href = data.url
  }, [])

  const openPortal = useCallback(async () => {
    const res = await fetch('/api/portal', { method: 'POST' })
    const data = await res.json()
    if (!res.ok || !data.url) {
      throw new Error(data.error || 'Unable to open billing portal')
    }
    window.location.href = data.url
  }, [])

  return (
    <EntitlementContext.Provider
      value={{
        isPro,
        configured,
        loading,
        customerId,
        refresh,
        startCheckout,
        openPortal,
        grantSoftPro,
      }}
    >
      {children}
    </EntitlementContext.Provider>
  )
}

export function useEntitlement(): EntitlementState {
  const ctx = useContext(EntitlementContext)
  if (!ctx) {
    throw new Error('useEntitlement must be used within EntitlementProvider')
  }
  return ctx
}
