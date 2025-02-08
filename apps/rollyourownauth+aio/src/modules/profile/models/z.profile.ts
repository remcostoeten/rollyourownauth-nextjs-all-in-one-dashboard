import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "@modules/auth/models/z.user";

export const profiles = sqliteTable("profiles", {
  id: text("id", { length: 36 }).notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  location: text("location"),
  website: text("website"),
  
  theme: text("theme").default("light"),
  language: text("language").default("en"),
  currency: text("currency").default("EUR"),

  createdAt: integer("created_at").notNull().default(0),
  updatedAt: integer("updated_at").notNull().default(0),
}, (table) => ({
  pk: primaryKey(table.id),
})); 