import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

let userConfig = undefined
try {
	userConfig = await import('./v0-user-next.config')
} catch (e) {
	// ignore error
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
	eslint: {
		ignoreDuringBuilds: true
	},
	typescript: {
		ignoreBuildErrors: true
	},
	images: {
		unoptimized: true
	},
	experimental: {
		webpackBuildWorker: true,
		parallelServerBuildTraces: true,
		parallelServerCompiles: true
	},
	webpack: (config) => {
		config.resolve.alias = {
			...config.resolve.alias,
			'@': resolve(__dirname, './src'),
			'@/components': resolve(__dirname, './src/components'),
			'@/modules': resolve(__dirname, './src/modules'),
			'@/shared': resolve(__dirname, './src/shared'),
			'@/views': resolve(__dirname, './src/views'),
			'@/types': resolve(__dirname, './src/types'),
			'@/lib': resolve(__dirname, './src/lib'),
			'@/styles': resolve(__dirname, './src/styles'),
			'@/server': resolve(__dirname, './src/server'),
			'@/utils': resolve(__dirname, './src/utils'),
			'@/hooks': resolve(__dirname, './src/hooks'),
			'@/api': resolve(__dirname, './src/api'),
			'@/constants': resolve(__dirname, './src/constants'),
			'@/features': resolve(__dirname, './src/features')
		}
		return config
	}
}

mergeConfig(nextConfig, userConfig)

function mergeConfig(nextConfig, userConfig) {
	if (!userConfig) {
		return
	}

	for (const key in userConfig) {
		if (
			typeof nextConfig[key] === 'object' &&
			!Array.isArray(nextConfig[key])
		) {
			nextConfig[key] = {
				...nextConfig[key],
				...userConfig[key]
			}
		} else {
			nextConfig[key] = userConfig[key]
		}
	}
}

export default nextConfig
