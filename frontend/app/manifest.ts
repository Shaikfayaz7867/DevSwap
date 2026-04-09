import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'DevSwap',
    short_name: 'DevSwap',
    description: 'Developer-only platform for matching, learning, and real-time chat.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f1522',
    theme_color: '#3b82f6',
    orientation: 'portrait',
    icons: [
      {
        src: '/icons/icon-192.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
      },
      {
        src: '/icons/icon-512.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
      },
    ],
  };
}
