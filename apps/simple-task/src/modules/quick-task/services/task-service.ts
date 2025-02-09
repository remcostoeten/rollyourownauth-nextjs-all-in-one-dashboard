import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import type { Task, TaskCreate, TaskUpdate } from '../types/task'

export interface TaskStorageAdapter {
	getTasks(): Promise<Task[]>
	getTask(id: string): Promise<Task | null>
	createTask(task: TaskCreate): Promise<Task>
	updateTask(id: string, update: TaskUpdate): Promise<Task>
	deleteTask(id: string): Promise<void>
}

class ZustandTaskStorage implements TaskStorageAdapter {
	private store = create<{ tasks: Task[] }>(() => ({
		tasks: []
	}))

	async getTasks(): Promise<Task[]> {
		return this.store.getState().tasks
	}

	async getTask(id: string): Promise<Task | null> {
		const task = this.store.getState().tasks.find((t) => t.id === id)
		return task || null
	}

	async createTask(task: TaskCreate): Promise<Task> {
		const newTask: Task = {
			id: uuidv4(),
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			completed: false,
			subtasks: [],
			...task
		}

		this.store.setState((state) => ({
			tasks: [...state.tasks, newTask]
		}))

		return newTask
	}

	async updateTask(id: string, update: TaskUpdate): Promise<Task> {
		let updatedTask: Task | null = null

		this.store.setState((state) => {
			const tasks = state.tasks.map((task) => {
				if (task.id === id) {
					updatedTask = {
						...task,
						...update,
						updatedAt: new Date().toISOString()
					}
					return updatedTask
				}
				return task
			})
			return { tasks }
		})

		if (!updatedTask) {
			throw new Error(`Task with id ${id} not found`)
		}

		return updatedTask
	}

	async deleteTask(id: string): Promise<void> {
		this.store.setState((state) => ({
			tasks: state.tasks.filter((task) => task.id !== id)
		}))
	}
}

export class TaskService {
	constructor(private storage: TaskStorageAdapter) {}

	async getTasks() {
		return this.storage.getTasks()
	}

	async getTask(id: string) {
		return this.storage.getTask(id)
	}

	async createTask(task: TaskCreate) {
		return this.storage.createTask(task)
	}

	async updateTask(id: string, update: TaskUpdate) {
		return this.storage.updateTask(id, update)
	}

	async deleteTask(id: string) {
		return this.storage.deleteTask(id)
	}
}

export const taskService = new TaskService(new ZustandTaskStorage())
