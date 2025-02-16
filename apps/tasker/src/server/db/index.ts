import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema'
import { env } from '@repo/env'
import { createClient } from "@libsql/client"

const client = createClient({ 
  url: env.DATABASE_URL
})

export const db = drizzle(env.DATABASE_URL, { schema })

