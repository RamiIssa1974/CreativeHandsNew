import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'creativehandsco.com',
                port: '',
                pathname: '/assets/Images/**',
            },
        ],
        unoptimized: true,
    },
    //Skip TypeScript errors during build
    typescript: {
        ignoreBuildErrors: true,
    },

    //Skip ESLint errors during build
    eslint: {
        ignoreDuringBuilds: true,
    },   
    output: 'export',

};

export default nextConfig;
