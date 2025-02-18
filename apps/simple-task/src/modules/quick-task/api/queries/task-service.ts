// import { create } from 'zustand'
// import { v4 as uuidv4 } from 'uuid'
// import type { Task, TaskCreate, TaskUpdate } from '../types/task'

// export interface TaskStorageAdapter {
// 	getTasks(): Promise<Task[]>
// 	getTask(id: string): Promise<Task | null>
// 	createTask(task: TaskCreate): Promise<Task>
// 	updateTask(id: string, update: TaskUpdate): Promise<Task>
// 	deleteTask(id: string): Promise<void>
// }

// class ZustandTaskStorage implements TaskStorageAdapter {
// 	private store = create<{ tasks: Task[] }>(() => ({
// 		tasks: []
// 	}))

// 	async getTasks(): Promise<Task[]> {
// 		return this.store.getState().tasks
// 	}

// 	async getTask(id: string): Promise<Task | null> {
// 		const task = this.store.getState().tasks.find((t) => t.id === id)
// 		return task || null
// 	}

// 	async createTask(task: TaskCreate): Promise<Task> {
// 		const newTask: Task = {
// 			id: uuidv4(),
// 			createdAt: new Date().toISOString(),
// 			updatedAt: new Date().toISOString(),
// 			completed: false,
// 			subtasks: [],
// 			...task
// 		}

// 		this.store.setState((state) => ({
// 			tasks: [...state.tasks, newTask]
// 		}))

// 		return newTask
// 	}

// 	async updateTask(id: string, update: TaskUpdate): Promise<Task> {
// 		let updatedTask: Task | null = null

// 		this.store.setState((state) => {
// 			const tasks = state.tasks.map((task) => {
// 				if (task.id === id) {
// 					updatedTask = {
// 						...task,
// 						...update,
// 						updatedAt: new Date().toISOString()
// 					}
// 					return updatedTask
// 				}
// 				return task
// 			})
// 			return { tasks }
// 		})

// 		if (!updatedTask) {
// 			throw new Error(`Task with id ${id} not found`)
// 		}

// 		return updatedTask
// 	}

// 	async deleteTask(id: string): Promise<void> {
// 		this.store.setState((state) => ({
// 			tasks: state.tasks.filter((task) => task.id !== id)
// 		}))
// 	}
// }

// export class TaskService {
// 	constructor(private storage: TaskStorageAdapter) {}

// 	async getTasks() {
// 		return this.storage.getTasks()
// 	}

// 	async getTask(id: string) {
// 		return this.storage.getTask(id)
// 	}

// 	async createTask(task: TaskCreate) {
// 		return this.storage.createTask(task)
// 	}

// 	async updateTask(id: string, update: TaskUpdate) {
// 		return this.storage.updateTask(id, update)
// 	}

// 	async deleteTask(id: string) {
// 		return this.storage.deleteTask(id)
// 	}
// }

// export const taskService = new TaskService(new ZustandTaskStorage())
import type { Task } from '../types/task'

// Simulating an API call with a delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Simulating a database of tasks
let tasks: Task[] = [
	{
		id: '1',
		title: 'Learn Next.js',
		completed: false,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	},
	{
		id: '2',
		title: 'Build a project',
		completed: false,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	},
	{
		id: '3',
		title: 'Deploy to Vercel',
		completed: false,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	}
]

export const taskService = {
	async getTasks(): Promise<Task[]> {
		await delay(500) // Simulating network delay
		return [...tasks]
	},

	async getTask(id: string): Promise<Task | null> {
		await delay(500) // Simulating network delay
		return tasks.find((task) => task.id === id) || null
	},

	async createTask(taskData: { title: string }): Promise<Task> {
		await delay(500) // Simulating network delay
		const newTask: Task = {
			id: Date.now().toString(),
			title: taskData.title,
			completed: false,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		}
		tasks.push(newTask)
		return newTask
	},

	async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
		await delay(500) // Simulating network delay
		const taskIndex = tasks.findIndex((task) => task.id === id)
		if (taskIndex === -1) {
			throw new Error('Task not found')
		}
		tasks[taskIndex] = { ...tasks[taskIndex], ...updates }
		return tasks[taskIndex]
	},

	async deleteTask(id: string): Promise<void> {
		await delay(500) // Simulating network delay
		tasks = tasks.filter((task) => task.id !== id)
	}
}
