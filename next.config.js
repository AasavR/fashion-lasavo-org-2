// next.config.js
const withTM = require("next-transpile-modules")(["undici"]);

module.exports = withTM({
  experimental: { appDir: true },
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Optional safeguard: don’t try to polyfill undici on the client
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        undici: false,
      };
    }
    return config;
  },
});
