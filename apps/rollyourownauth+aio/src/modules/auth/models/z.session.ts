import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./z.user";

export const sessions = sqliteTable("sessions", {
  id: text("id", { length: 36 }).notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  activeToken: text("active_token").notNull(),
  expiresAt: integer("expires_at").notNull(),
  
  createdAt: integer("created_at").notNull().default(0),
  updatedAt: integer("updated_at").notNull().default(0),
}, (table) => ({
  pk: primaryKey(table.id),
})); 