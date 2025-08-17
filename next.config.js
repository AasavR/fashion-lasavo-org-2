/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { appDir: true },
  reactStrictMode: true,
  transpilePackages: ['undici'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        undici: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
