/**
 * Fixed decorative backdrop — calm deep navy with a warm parchment glow
 * at the horizon (no aurora / dashboard motion).
 */
export function SiteAtmosphere() {
  return (
    <div
      aria-hidden="true"
      className="site-atmosphere pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="site-atmosphere__base" />
      <div className="site-atmosphere__parchment-glow" />
      <div className="site-atmosphere__grain" />
      <div className="site-atmosphere__vignette" />
    </div>
  )
}