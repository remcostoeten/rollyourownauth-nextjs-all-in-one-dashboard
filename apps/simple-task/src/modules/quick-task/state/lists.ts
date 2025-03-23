'use client'

import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'

export interface Category {
	id: string
	name: string
	emoji?: string
}

export interface List {
	id: string
	name: string
	emoji?: string
	categoryId?: string
	createdAt: string
	tasks?: any[] // TODO: Add proper Task type
}

interface ListsState {
	lists: List[]
	categories: Category[]
	addList: (list: List) => void
	removeList: (id: string) => void
	updateList: (id: string, updates: Partial<List>) => void
	addCategory: (category: Category) => void
	removeCategory: (id: string) => void
	updateCategory: (id: string, updates: Partial<Category>) => void
}

export const useListsStore = create<ListsState>((set) => ({
	lists: [],
	categories: [],
	addList: (list) => set((state) => ({ lists: [...state.lists, list] })),
	removeList: (id) =>
		set((state) => ({
			lists: state.lists.filter((list) => list.id !== id)
		})),
	updateList: (id, updates) =>
		set((state) => ({
			lists: state.lists.map((list) =>
				list.id === id ? { ...list, ...updates } : list
			)
		})),
	addCategory: (category) => 
		set((state) => ({ 
			categories: [...state.categories, category] 
		})),
	removeCategory: (id) =>
		set((state) => ({
			categories: state.categories.filter((cat) => cat.id !== id),
			// Remove category from lists
			lists: state.lists.map((list) => 
				list.categoryId === id ? { ...list, categoryId: undefined } : list
			)
		})),
	updateCategory: (id, updates) =>
		set((state) => ({
			categories: state.categories.map((cat) =>
				cat.id === id ? { ...cat, ...updates } : cat
			)
		}))
}))
