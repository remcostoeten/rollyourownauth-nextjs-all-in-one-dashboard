import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { createId } from '@paralleldrive/cuid2'
import { users } from '@/src/modules/auth/schema'

export const oauthConnections = sqliteTable('oauth_connections', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  provider: text('provider').notNull(),
  providerUserId: text('provider_user_id').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
}) 