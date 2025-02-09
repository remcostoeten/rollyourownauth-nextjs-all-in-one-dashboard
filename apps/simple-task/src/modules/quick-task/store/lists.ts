import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import type { Task } from '../types/task'

export interface List {
	id: string
	title: string
	icon?: string
	tabs: {
		id: string
		label: string
	}[]
	createdAt: Date
	tasks: Task[]
}

interface ListState {
	lists: List[]
	activeListId: string | null
	createList: () => void
	updateList: (id: string, updates: Partial<List>) => void
	deleteList: (id: string) => void
	setActiveList: (id: string | null) => void
	addTask: (listId: string, task: Omit<Task, 'id'>) => void
	updateTask: (listId: string, taskId: string, updates: Partial<Task>) => void
	deleteTask: (listId: string, taskId: string) => void
}

export const useListStore = create<ListState>((set) => ({
	lists: [],
	activeListId: null,
	createList: () => {
		const newList: List = {
			id: uuidv4(),
			title: 'Untitled list',
			tabs: [{ id: 'default', label: 'Tasks' }],
			createdAt: new Date(),
			tasks: []
		}
		set((state) => ({
			lists: [...state.lists, newList],
			activeListId: newList.id
		}))
	},
	updateList: (id, updates) => {
		set((state) => ({
			lists: state.lists.map((list) =>
				list.id === id ? { ...list, ...updates } : list
			)
		}))
	},
	deleteList: (id) => {
		set((state) => ({
			lists: state.lists.filter((list) => list.id !== id),
			activeListId: state.activeListId === id ? null : state.activeListId
		}))
	},
	setActiveList: (id) => {
		set({ activeListId: id })
	},
	addTask: (listId, task) => {
		set((state) => ({
			lists: state.lists.map((list) =>
				list.id === listId
					? {
							...list,
							tasks: [...list.tasks, { id: uuidv4(), ...task }]
						}
					: list
			)
		}))
	},
	updateTask: (listId, taskId, updates) => {
		set((state) => ({
			lists: state.lists.map((list) =>
				list.id === listId
					? {
							...list,
							tasks: list.tasks.map((task) =>
								task.id === taskId
									? { ...task, ...updates }
									: task
							)
						}
					: list
			)
		}))
	},
	deleteTask: (listId, taskId) => {
		set((state) => ({
			lists: state.lists.map((list) =>
				list.id === listId
					? {
							...list,
							tasks: list.tasks.filter(
								(task) => task.id !== taskId
							)
						}
					: list
			)
		}))
	}
}))
