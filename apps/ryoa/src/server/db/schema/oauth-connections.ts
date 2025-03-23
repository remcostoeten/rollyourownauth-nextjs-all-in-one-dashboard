import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"
import { sql } from "drizzle-orm"
import { users } from "./users"

export const oauthConnections = sqliteTable("oauth_connections", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  provider: text("provider").notNull(),
  providerUserId: text("provider_user_id").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`CURRENT_TIMESTAMP`),
}) 