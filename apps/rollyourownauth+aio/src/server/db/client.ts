import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schemas';
import { env } from '../env';

// Initialize SQLite database
const sqlite = new Database(
  env.DATABASE_URL.replace('sqlite:', '')
);

// Create database instance
export const db = drizzle(sqlite, { schema });

// Export schema for use in other parts of the application
export { schema }; 