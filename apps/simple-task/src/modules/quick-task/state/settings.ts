'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Settings {
	shortcuts: {
		newTask: string
	}
	setShortcut: (key: keyof Settings['shortcuts'], value: string) => void
}

export const useSettingsStore = create<Settings>()(
	persist(
		(set) => ({
			shortcuts: {
				newTask: 'Alt+N'
			},
			setShortcut: (key, value) =>
				set((state) => ({
					shortcuts: {
						...state.shortcuts,
						[key]: value
					}
				}))
		}),
		{
			name: 'quick-task-settings'
		}
	)
)
