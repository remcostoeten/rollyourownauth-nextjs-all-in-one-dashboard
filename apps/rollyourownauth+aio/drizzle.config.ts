import { env } from '@repo/env'
import type { Config } from 'drizzle-kit'

export default {
	schema: './src/server/db/schema.ts',
	out: './src/server/db/migrations',
	driver: 'better-sqlite',
	dbCredentials: {
		url: env.DATABASE_URL
	},
	verbose: true,
	strict: true,
} satisfies Config
