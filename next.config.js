/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { appDir: true },
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Exclude undici from client-side bundling
    if (!isServer) {
      config.externals = [...(config.externals || []), 'undici'];
    }
    return config;
  },
};

module.exports = nextConfig;
