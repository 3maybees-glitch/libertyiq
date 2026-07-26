/**
 * Fixed decorative backdrop for LibertyIQ.
 * Civic aurora: clearly visible patriotic light sheets, drifting orbs,
 * and a living star field — ambient motion that reads at a glance.
 */
export function SiteAtmosphere() {
  return (
    <div
      aria-hidden="true"
      className="site-atmosphere pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="site-atmosphere__base" />
      <div className="site-atmosphere__aurora site-atmosphere__aurora--crimson" />
      <div className="site-atmosphere__aurora site-atmosphere__aurora--indigo" />
      <div className="site-atmosphere__aurora site-atmosphere__aurora--silver" />
      <div className="site-atmosphere__orb site-atmosphere__orb--crimson" />
      <div className="site-atmosphere__orb site-atmosphere__orb--indigo" />
      <div className="site-atmosphere__orb site-atmosphere__orb--ember" />
      <div className="site-atmosphere__sweep" />
      <div className="site-atmosphere__stars" />
      <div className="site-atmosphere__stars site-atmosphere__stars--far" />
      <div className="site-atmosphere__grid" />
      <div className="site-atmosphere__grain" />
      <div className="site-atmosphere__vignette" />
    </div>
  )
}
