'use client'

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import type { PaidPlan } from '@/lib/pricing'

const DEVICE_KEY = 'li_device'
const DEVICE_ALPHABET = '0123456789abcdefghjkmnpqrstvwxyz'

export function getOrCreateDeviceId(): string {
  const existing = localStorage.getItem(DEVICE_KEY)
  if (existing && /^[a-z0-9]{8,32}$/.test(existing)) return existing
  const bytes = crypto.getRandomValues(new Uint8Array(8))
  let id = ''
  for (const byte of bytes) id += DEVICE_ALPHABET[byte % DEVICE_ALPHABET.length]
  localStorage.setItem(DEVICE_KEY, id)
  return id
}

type EntitlementState = {
  isPro: boolean
  topics: string[]
  configured: boolean
  loading: boolean
  customerId?: string
  plan?: string
  accessExpiresAt: number | null
  legacySubscription: boolean
  refresh: () => Promise<void>
  startCheckout: (plan: PaidPlan, topicId?: string) => Promise<void>
  openPortal: () => Promise<void>
}

const EntitlementContext = createContext<EntitlementState | null>(null)

type EntitlementResponse = {
  isPro?: boolean
  topics?: string[]
  configured?: boolean
  customerId?: string
  plan?: string
  accessExpiresAt?: number | null
  legacySubscription?: boolean
  error?: string
}

async function readEntitlement(): Promise<EntitlementResponse> {
  const res = await fetch('/api/entitlement', { credentials: 'include' })
  if (!res.ok) return { isPro: false, topics: [], configured: true }
  return res.json()
}

function applyResponse(
  data: EntitlementResponse,
  setters: {
    setIsPro: (value: boolean) => void
    setTopics: (value: string[]) => void
    setConfigured: (value: boolean) => void
    setCustomerId: (value: string | undefined) => void
    setPlan: (value: string | undefined) => void
    setAccessExpiresAt: (value: number | null) => void
    setLegacySubscription: (value: boolean) => void
  },
) {
  setters.setIsPro(Boolean(data.isPro))
  setters.setTopics(Array.isArray(data.topics) ? data.topics : [])
  setters.setConfigured(data.configured !== false)
  setters.setCustomerId(data.customerId)
  setters.setPlan(data.plan)
  setters.setAccessExpiresAt(data.accessExpiresAt ?? null)
  setters.setLegacySubscription(Boolean(data.legacySubscription))
}

export function EntitlementProvider({ children }: { children: ReactNode }) {
  const [isPro, setIsPro] = useState(false)
  const [topics, setTopics] = useState<string[]>([])
  const [configured, setConfigured] = useState(true)
  const [loading, setLoading] = useState(true)
  const [customerId, setCustomerId] = useState<string | undefined>()
  const [plan, setPlan] = useState<string | undefined>()
  const [accessExpiresAt, setAccessExpiresAt] = useState<number | null>(null)
  const [legacySubscription, setLegacySubscription] = useState(false)

  const refresh = useCallback(async () => {
    try {
      const data = await readEntitlement()
      applyResponse(data, {
        setIsPro,
        setTopics,
        setConfigured,
        setCustomerId,
        setPlan,
        setAccessExpiresAt,
        setLegacySubscription,
      })
    } catch {
      setIsPro(false)
      setTopics([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const startCheckout = useCallback(async (planId: PaidPlan, topicId?: string) => {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: planId, topicId }),
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
        topics,
        configured,
        loading,
        customerId,
        plan,
        accessExpiresAt,
        legacySubscription,
        refresh,
        startCheckout,
        openPortal,
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
