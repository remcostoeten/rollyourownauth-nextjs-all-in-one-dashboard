"use client"

import { create } from "zustand"
import { v4 as uuidv4 } from "uuid"

export interface List {
	id: string
	name: string
	tasks: unknown[]
}

interface ListsState {
	lists: List[]
	addList: (list: List) => void
	removeList: (id: string) => void
	updateList: (id: string, updates: Partial<List>) => void
	createList: () => void
}

export const useListsStore = create<ListsState>((set) => ({
	lists: [],
	addList: (list) => set((state) => ({ lists: [...state.lists, list] })),
	removeList: (id) => set((state) => ({ lists: state.lists.filter((list) => list.id !== id) })),
	createList: () => set((state) => ({ lists: [...state.lists, { id: uuidv4(), name: 'New List', tasks: [] }] })),
	updateList: (id, updates) =>
		set((state) => ({
			lists: state.lists.map((list) => (list.id === id ? { ...list, ...updates } : list))
		}))
}))
