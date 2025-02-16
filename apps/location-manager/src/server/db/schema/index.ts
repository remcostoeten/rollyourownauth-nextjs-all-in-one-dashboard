import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core"

export const locations = sqliteTable("locations", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  country: text("country").notNull(),
  status: text("status", { enum: ["active", "inactive", "pending"] }).notNull(),
  dateAdded: text("date_added").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  isFavorite: integer("is_favorite", { mode: "boolean" }).notNull().default(false),
})

