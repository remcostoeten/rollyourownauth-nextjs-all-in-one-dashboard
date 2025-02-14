const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@repo/env", "@repo/ui", "@repo/helpers", "@repo/configuration"],
    webpack: (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            '@repo/env': path.resolve(__dirname, '../../packages/env/src/index.ts'),
        }
        return config
    }
}

module.exports = nextConfig 