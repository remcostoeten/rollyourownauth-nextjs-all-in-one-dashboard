const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@repo/env", "@repo/ui", "@repo/helpers", "@repo/configuration"],
    webpack: (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            '@repo/env': path.resolve(__dirname, '../../packages/env'),
            '@repo/ui': path.resolve(__dirname, '../../packages/ui'),
            '@repo/helpers': path.resolve(__dirname, '../../packages/helpers'),
            '@repo/configuration': path.resolve(__dirname, '../../packages/configuration'),
        }
        return config
    }
}

module.exports = nextConfig 