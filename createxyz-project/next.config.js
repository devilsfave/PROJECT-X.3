/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    esmExternals: 'loose'  // Enable experimental ESM support
  },
  webpack: (config, { isServer }) => {
    // Externalize 'canvas' for server-side rendering
    config.externals = [...config.externals, { canvas: "canvas" }];

    // Add fallback for browser-only modules when using TensorFlow.js
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,        // File system module (not needed in browser)
        path: false,      // Path module (not needed in browser)
        crypto: false,    // Crypto module (handled differently in browser)
      };
    }

    return config;
  },
};

module.exports = nextConfig;
