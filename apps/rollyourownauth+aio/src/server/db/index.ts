import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import * as schema from './schema'
import { env } from '../env'

// Initialize SQLite database
const sqlite = new Database(env.DATABASE_URL.replace('file:', ''))

// Create Drizzle instance
export const db = drizzle(sqlite, { schema })

// Export close method
export const closeDb = () => sqlite.close()

// Export schema for use in other files
export { schema }
