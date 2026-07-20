import type { NextConfig } from 'next';
import { publicApiUrl } from '@/lib/constants/app.config';

const nextConfig: NextConfig = {
    /* config options here */
    reactCompiler: true,

    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: `${publicApiUrl}/:path*`
            }
        ];
    },

    // TODO: remove at prod, only for dev
    // TODO:: remove this after backend api intentially set: 'Secure:false'___coming-on-next-release
    // allowedDevOrigins: ['3053-167-179-244-231.ngrok-free.app'],

    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'pub-ffed265156c74ec384ca0dbff4696c02.r2.dev',
                port: '',
                pathname: '/**'
            }
        ]
    }
};

export default nextConfig;
