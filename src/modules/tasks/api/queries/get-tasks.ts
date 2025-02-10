import { db } from 'db'
import { tasks } from '../../../server/db/schema'
import { desc } from 'drizzle-orm'

export async function getTasks() {
  'use server'

  const tasksList = await db
    .select()
    .from(tasks)
    .orderBy(desc(tasks.createdAt))

  return tasksList
} 