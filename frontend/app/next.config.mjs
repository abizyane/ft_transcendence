/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
    images: {
    domains: ['localhost'],
		remotePatterns: [
      {
        protocol: "https",
        hostname: 'localhost',
        port: '8000',
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
