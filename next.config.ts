import type { NextConfig } from 'next';
import { publicApiUrl } from '@/lib/constants/app.config';

const nextConfig: NextConfig = {
    reactCompiler: true,

    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: `${publicApiUrl}/:path*`
            }
        ];
    },

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
