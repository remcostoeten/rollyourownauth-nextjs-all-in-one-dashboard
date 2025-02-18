/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't bundle better-sqlite3 on the client side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        "better-sqlite3": false,
        fs: false,
        path: false,
        util: false,
      }
    }
    return config
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig 