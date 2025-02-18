import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"
import { sql } from "drizzle-orm"
import { relations } from "drizzle-orm"
import { users } from "./user"

export const oauthConnections = sqliteTable("oauth_connections", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  provider: text("provider").notNull(), // e.g., 'github', 'google'
  providerUserId: text("provider_user_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  expiresAt: integer("expires_at"),
  createdAt: integer("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
})

export const oauthConnectionsRelations = relations(oauthConnections, ({ one }) => ({
  user: one(users, {
    fields: [oauthConnections.userId],
    references: [users.id],
  }),
})) 