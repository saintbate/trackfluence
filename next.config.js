/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async redirects() {
    return [
      {
        source: "/",
        destination: "/signin",
        permanent: false, // 307 Temporary Redirect
      },
    ];
  },
};

module.exports = nextConfig;