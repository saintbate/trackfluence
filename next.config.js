/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  // keep/restore any options you actually need:
  // images: { domains: ['lh3.googleusercontent.com'] },
  // experimental: { serverActions: true },
};

module.exports = nextConfig;