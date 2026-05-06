/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['lh3.googleusercontent.com', 'picsum.photos'],
  },
  // If you want to use the src directory for common components
  // aliases are handled by tsconfig.json
};

export default nextConfig;
