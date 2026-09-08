import { ImageResponse } from 'next/og'

export const alt =
  'The Heritage Academy High School Track — Fall 2026, recommended by a LibertyIQ family'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(165deg, #2a2a52 0%, #16162e 48%, #12121f 100%)',
          color: '#ffffff',
          padding: 64,
        }}
      >
        <div
          style={{
            display: 'flex',
            height: 8,
            width: '100%',
            background: 'linear-gradient(to right, #B22234 33%, #FFFFFF 33%, #FFFFFF 66%, #3C3B6E 66%)',
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            style={{
              fontSize: 22,
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: '#C9A227',
              fontWeight: 600,
            }}
          >
            A LibertyIQ family recommends
          </div>
          <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.05 }}>
            The Heritage Academy
          </div>
          <div style={{ fontSize: 28, color: '#F3C6C9' }}>
            High School Track · Free · Virtual · Fall 2026
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ color: '#C9A227', fontSize: 16, letterSpacing: 2 }}>TERM</div>
            <div>September 28 – November 23, 2026</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ color: '#C9A227', fontSize: 16, letterSpacing: 2 }}>APPLY BY</div>
            <div>September 13, 2026</div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
