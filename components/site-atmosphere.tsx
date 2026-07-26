/**
 * Fixed decorative backdrop for LibertyIQ.
 * Keeps page content readable while replacing the flat navy + dotted fill.
 */
export function SiteAtmosphere() {
  return (
    <div
      aria-hidden="true"
      className="site-atmosphere pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="site-atmosphere__base" />
      <div className="site-atmosphere__wash site-atmosphere__wash--crimson" />
      <div className="site-atmosphere__wash site-atmosphere__wash--indigo" />
      <div className="site-atmosphere__beam" />
      <div className="site-atmosphere__stars" />
      <div className="site-atmosphere__grid" />
      <div className="site-atmosphere__grain" />
      <div className="site-atmosphere__vignette" />
    </div>
  )
}
