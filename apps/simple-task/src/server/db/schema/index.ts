import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const tasks = sqliteTable('tasks', {
	id: text('id').primaryKey(),
	title: text('title').notNull(),
	description: text('description'),
	completed: integer('completed', { mode: 'boolean' }).notNull().default(false),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
})

export const lists = sqliteTable('lists', {
	id: text('id').primaryKey(),
	title: text('title').notNull(),
	description: text('description'),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
})
