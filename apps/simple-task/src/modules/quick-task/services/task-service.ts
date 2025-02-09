'use client'

import { v4 as uuidv4 } from 'uuid'
import type { Task } from '@/types/task'

// Private tasks state
const tasks: Task[] = []

export const taskService = {
	getTasks: async (): Promise<Task[]> => {
		return tasks
	},

	createTask: async (data: { title: string }): Promise<Task> => {
		const newTask: Task = {
			id: uuidv4(),
			title: data.title,
			completed: false,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		}
		tasks.push(newTask)
		return newTask
	},

	updateTask: async (id: string, updates: Partial<Task>): Promise<Task> => {
		const taskIndex = tasks.findIndex((task) => task.id === id)
		if (taskIndex === -1) {
			throw new Error('Task not found')
		}

		const updatedTask = {
			...tasks[taskIndex],
			...updates,
			updatedAt: new Date().toISOString()
		}
		tasks[taskIndex] = updatedTask
		return updatedTask
	},

	deleteTask: async (id: string): Promise<void> => {
		const taskIndex = tasks.findIndex((task) => task.id === id)
		if (taskIndex === -1) {
			throw new Error('Task not found')
		}
		tasks.splice(taskIndex, 1)
	}
}
