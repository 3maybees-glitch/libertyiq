/** One device id per pass, stored on the Stripe Checkout Session. No user database. */

const DEVICE_ID = /^[a-z0-9]{8,32}$/
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
      error: 'This pass is already in use on another device.',
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

export function normalizeCheckoutSessionId(raw: string): string | null {
  const id = raw.trim()
  if (!SESSION_ID.test(id)) return null
  return id
}
