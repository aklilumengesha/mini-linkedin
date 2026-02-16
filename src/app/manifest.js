export default function manifest() {
  return {
    name: 'LinkedIn Clone',
    short_name: 'LinkedIn',
    description: 'A professional networking platform clone built with Next.js',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0a66c2',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
