import { drizzle } from "drizzle-orm/better-sqlite3"
import Database from "better-sqlite3"
import { join } from "path"

// Ensure this only runs on the server
if (typeof window !== "undefined") {
  throw new Error("Database can only be accessed on the server")
}

declare global {
  var sqlite: Database.Database | undefined
  var db: ReturnType<typeof drizzle> | undefined
}

const dbPath = join(process.cwd(), "local.db")

let db: ReturnType<typeof drizzle>

// In production, we want to reuse connections
if (process.env.NODE_ENV === "production") {
  if (!global.sqlite) {
    global.sqlite = new Database(dbPath)
    global.db = drizzle(global.sqlite)
  }
  db = global.db!
} else {
  // In development, create a new connection
  const sqlite = new Database(dbPath)
  db = drizzle(sqlite)
}

export { db }

