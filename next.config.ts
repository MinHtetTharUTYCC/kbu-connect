import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    reactCompiler: true,

    // async rewrites() {
    //     return [
    //         {
    //             source: '/api/:path*',
    //             destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
    //         },
    //     ];
    // },

    // TODO: remove at prod, only for dev
    // TODO:: remove this after backend api intentially set: 'Secure:false'___coming-on-next-release
    allowedDevOrigins: ['3053-167-179-244-231.ngrok-free.app']
};

export default nextConfig;
