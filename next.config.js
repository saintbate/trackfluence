/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // App Router is already being used; this is safe
    typedRoutes: true,
  },
};

module.exports = nextConfig;