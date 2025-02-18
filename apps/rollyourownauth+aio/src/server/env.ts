import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
	server: {
		DATABASE_URL: z.string().min(1).default('file:local.db'),
		NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
	},
	client: {
		// Add client-side environment variables here if needed
	},
	runtimeEnv: {
		DATABASE_URL: process.env.DATABASE_URL,
		NODE_ENV: process.env.NODE_ENV,
	},
	skipValidation: process.env.SKIP_ENV_VALIDATION === 'true',
	emptyStringAsUndefined: true,
})
