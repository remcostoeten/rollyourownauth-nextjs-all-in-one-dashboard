/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
    typedRoutes: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@modules": "./src/modules",
      "@server": "./src/server",
    };
    return config;
  },
};

module.exports = nextConfig; 