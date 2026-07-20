import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Providers } from '@/components/providers'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://libertyiq.org'),
  title: 'LibertyIQ — Conservative Worldviews Library',
  description:
    'An interactive field guide to conservative worldviews on pro-life, immigration, constitutional rights, and more. Learn biblical foundations, scientific evidence, and debate strategies.',
  applicationName: 'LibertyIQ',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'LibertyIQ',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://libertyiq.org',
    siteName: 'LibertyIQ',
    title: 'LibertyIQ — Conservative Worldviews Library',
    description:
      'An interactive field guide to conservative worldviews on pro-life, immigration, constitutional rights, and more.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LibertyIQ — Conservative Worldviews Library',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LibertyIQ — Conservative Worldviews Library',
    description:
      'An interactive field guide to conservative worldviews on pro-life, immigration, constitutional rights, and more.',
    images: ['/og-image.png'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#3C3B6E',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
