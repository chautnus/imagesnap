/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      }
    ],
  },
  // If you want to use the src directory for common components
  // aliases are handled by tsconfig.json
};

export default nextConfig;
