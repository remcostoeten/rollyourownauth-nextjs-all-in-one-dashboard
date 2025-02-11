import type { Config } from 'drizzle-kit';
import baseConfig from '../../shared/db/drizzle.config';

export default {
  ...baseConfig,
  // Override only what's needed
  out: './src/server/db/migrations',
} satisfies Config;
