import { db } from 'db'
import { nanoid } from 'nanoid'
import { TaskCreate } from '../../models/z.task'

export async function createTask(data: TaskCreate) {
  'use server'
  
  const now = new Date()
  
  const task = await db.insert(tasks).values({
    id: nanoid(),
    title: data.title,
    description: data.description,
    completed: false,
    createdAt: now,
    updatedAt: now
  }).returning()

  return task[0]
} 