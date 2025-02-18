'use client'

import { useState, useCallback } from 'react'
import type { Category } from '../models/z.category'

export function useCategories() {
	const [categories, setCategories] = useState<Category[]>([])

	const addCategory = useCallback((category: Category) => {
		setCategories((prev) => [...prev, category])
	}, [])

	const removeCategory = useCallback((categoryId: string) => {
		setCategories((prev) => prev.filter((cat) => cat.id !== categoryId))
	}, [])

	const updateCategory = useCallback(
		(categoryId: string, updates: Partial<Category>) => {
			setCategories((prev) =>
				prev.map((cat) =>
					cat.id === categoryId ? { ...cat, ...updates } : cat
				)
			)
		},
		[]
	)

	return {
		categories,
		addCategory,
		removeCategory,
		updateCategory
	}
}
