'use client'

import { useState } from 'react'
import { useEntitlement } from '@/hooks/use-entitlement'
import { Button } from '@/components/ui/button'

export function RedeemPassForm({ className }: { className?: string }) {
  const { redeemCode } = useEntitlement()
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError(null)
    setMessage(null)
    try {
      await redeemCode(code)
      setMessage('This device now has a seat on that pass.')
      setCode('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to redeem that code')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={(event) => void onSubmit(event)} className={className}>
      <label htmlFor="pass-code" className="block text-sm font-semibold">
        Family or group code
      </label>
      <p className="mt-1 text-sm text-muted-foreground">
        The buyer receives one code. Each student redeems it once, on their own device.
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          id="pass-code"
          name="code"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          placeholder="LIQ-XXXX-XXXX"
          className="h-10 flex-1 rounded-md border border-input bg-background px-3 text-sm tracking-wide"
        />
        <Button type="submit" className="font-semibold" disabled={busy || code.trim().length < 4}>
          {busy ? 'Checking…' : 'Redeem'}
        </Button>
      </div>
      {message && (
        <p className="mt-3 text-sm text-foreground" role="status">
          {message}
        </p>
      )}
      {error && (
        <p className="mt-3 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </form>
  )
}
