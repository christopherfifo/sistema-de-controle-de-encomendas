import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CondoDrop',
    short_name: 'CondoDrop',
    description: 'Gerenciamento inteligente de encomendas para o seu condomínio',
    start_url: '/',
    display: 'standalone',
    background_color: '#09090b',
    theme_color: '#09090b', // hsl(240, 10%, 3.9%) approx background dark
    icons: [
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
