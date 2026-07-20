import withSerwistInit from '@serwist/next'

const withSerwist = withSerwistInit({
  swSrc: 'app/sw.ts',
  swDest: 'public/sw.js',
  // Cache navigations via next/link so library/quiz pages work offline after a visit.
  cacheOnNavigation: true,
  // Avoid SW noise during Turbopack/webpack HMR; production builds still register.
  disable: process.env.NODE_ENV === 'development',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
}

export default withSerwist(nextConfig)
