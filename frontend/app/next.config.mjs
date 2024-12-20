/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['localhost'],
		remotePatterns: [
      {
        protocol: "https",
        hostname: 'localhost',
        port: '443',
        pathname: '/pictures/**'
      },
    ],
    
  },
  webpack: (config) => {
    config.resolve = {
      ...config.resolve,
      fallback: {
        fs: false,
        
      },
    };
    return config;
  },
};

export default nextConfig;
