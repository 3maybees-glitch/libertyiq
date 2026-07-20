'use client'

/**
 * Small inline note for features that need a live network connection
 * (checkout, billing portal, speech recognition).
 */
export function OnlineOnlyNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs text-muted-foreground leading-relaxed">
      <span className="font-medium text-foreground">Online required.</span> {children}
    </p>
  )
}
