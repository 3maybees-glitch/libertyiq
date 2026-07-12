'use client'

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

type EntitlementState = {
  isPro: boolean
  configured: boolean
  loading: boolean
  customerId?: string
  refresh: () => Promise<void>
  startCheckout: (plan: 'monthly' | 'yearly') => Promise<void>
  openPortal: () => Promise<void>
}

const EntitlementContext = createContext<EntitlementState | null>(null)

async function readEntitlement(): Promise<{
  isPro: boolean
  configured: boolean
  customerId?: string
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
      setIsPro(Boolean(data.isPro))
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

  const startCheckout = useCallback(async (plan: 'monthly' | 'yearly') => {
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
      value={{ isPro, configured, loading, customerId, refresh, startCheckout, openPortal }}
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
