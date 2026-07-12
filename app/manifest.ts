import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.title,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#2a3050',
    theme_color: '#c0392b',
    icons: [
      {
        src: '/libertyiq-logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
