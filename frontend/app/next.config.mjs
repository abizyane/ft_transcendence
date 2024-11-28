/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
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
}
};

export default nextConfig;
