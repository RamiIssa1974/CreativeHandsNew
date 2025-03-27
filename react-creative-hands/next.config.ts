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
    },
};

export default nextConfig;
