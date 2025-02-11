import type { Config } from 'drizzle-kit';
import { env } from '../config/env';

export default {
  schema: './shared/db/schema/index.ts',
  driver: 'better-sqlite',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  // Each app can override these in their own drizzle.config.ts
  out: './shared/db/migrations',
  verbose: true,
  strict: true,
} satisfies Config; 