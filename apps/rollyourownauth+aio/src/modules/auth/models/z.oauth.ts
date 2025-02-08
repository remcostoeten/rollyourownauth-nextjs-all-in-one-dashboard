import { integer, primaryKey, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { users } from "./z.user";

export const OAuthProvider = {
  GITHUB: "GITHUB",
  GOOGLE: "GOOGLE",
} as const;

export const oauthAccounts = sqliteTable("oauth_accounts", {
  id: text("id", { length: 36 }).notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  provider: text("provider", { enum: ["GITHUB", "GOOGLE"] }).notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  providerUsername: text("provider_username"),
  
  createdAt: integer("created_at").notNull().default(0),
  updatedAt: integer("updated_at").notNull().default(0),
}, (table) => ({
  pk: primaryKey(table.id),
  unq1: unique().on(table.provider, table.providerAccountId),
  unq2: unique().on(table.userId, table.provider),
})); 