import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id", { length: 36 }).notNull(),
  email: text("email").notNull().unique(),
  password: text("password"),
  name: text("name"),
  
  createdAt: integer("created_at").notNull().default(0),
  updatedAt: integer("updated_at").notNull().default(0),
}, (table) => ({
  pk: primaryKey(table.id),
})); 