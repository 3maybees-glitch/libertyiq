import { randomBytes } from 'crypto'

/** Seat lists stored on a Stripe Checkout Session. No user database. */

export const ACCESS_CODE_ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'

const DEVICE_ID = /^[a-z0-9]{8,32}$/
const ACCESS_BODY = /^[0-9A-HJKMNP-TV-Z]{8}$/
const SESSION_ID = /^cs_(?:live|test)_[A-Za-z0-9]+$/

export const DAY_SECONDS = 24 * 60 * 60

export function normalizeDeviceId(raw: string | undefined | null): string | null {
  const deviceId = raw?.trim().toLowerCase() ?? ''
  if (!DEVICE_ID.test(deviceId)) return null
  return deviceId
}

export function parseDeviceList(value: string | undefined | null): string[] {
  if (!value) return []
  const seen = new Set<string>()
  for (const part of value.split(',')) {
    const deviceId = normalizeDeviceId(part)
    if (deviceId && !seen.has(deviceId)) seen.add(deviceId)
  }
  return [...seen]
}

export function claimDevice(
  existing: readonly string[],
  deviceId: string,
  seats: number,
): { ok: true; devices: string[]; added: boolean } | { ok: false; error: string } {
  const devices = [...existing]
  if (devices.includes(deviceId)) return { ok: true, devices, added: false }
  if (!Number.isFinite(seats) || seats < 1) {
    return { ok: false, error: 'This pass has no open seats.' }
  }
  if (devices.length >= seats) {
    return {
      ok: false,
      error: `All ${seats} seats on this pass are in use.`,
    }
  }
  return { ok: true, devices: [...devices, deviceId], added: true }
}

/** 365 days from the Checkout Session's created time, in unix seconds. */
export function passExpiresAt(createdUnix: number, durationDays: number): number {
  return createdUnix + durationDays * DAY_SECONDS
}

export function isPassCurrent(accessExpiresAt: number, nowUnix = Math.floor(Date.now() / 1000)): boolean {
  return accessExpiresAt > nowUnix
}

/**
 * Family and group codes look like LIQ-7K3Q-M9PD.
 * Returns the canonical form, or null when the text is not a code.
 */
export function normalizeAccessCode(raw: string): string | null {
  const compact = raw.toUpperCase().replace(/[^A-Z0-9]/g, '')
  const body = compact.startsWith('LIQ') ? compact.slice(3) : compact
  if (!ACCESS_BODY.test(body)) return null
  return `LIQ-${body.slice(0, 4)}-${body.slice(4)}`
}

export function normalizeCheckoutSessionId(raw: string): string | null {
  const id = raw.trim()
  if (!SESSION_ID.test(id)) return null
  return id
}

export function createAccessCode(randomByte?: (index: number) => number): string {
  const bytes = randomByte ? null : randomBytes(8)
  let body = ''
  for (let i = 0; i < 8; i++) {
    const value = randomByte ? randomByte(i) : (bytes?.[i] ?? 0)
    body += ACCESS_CODE_ALPHABET[value % ACCESS_CODE_ALPHABET.length]
  }
  return `LIQ-${body.slice(0, 4)}-${body.slice(4)}`
}
