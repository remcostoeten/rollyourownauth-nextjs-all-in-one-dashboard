/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.externals = [...(config.externals || []), "fs"]
    }
    return config
  },
}

module.exports = nextConfig

