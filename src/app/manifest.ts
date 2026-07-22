import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'KBU Connect',
        short_name: 'KBU Connect',
        description: 'Connect with KBU students',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#1a1a1a',
        icons: [
            {
                src: '/pwa/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png'
            },
            {
                src: '/pwa/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png'
            },
            {
                src: '/pwa/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable'
            }
        ]
    };
}
