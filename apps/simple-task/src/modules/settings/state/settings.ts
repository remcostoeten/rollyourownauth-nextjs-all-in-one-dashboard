import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type KeyboardShortcut = {
    key: string
    description: string
    defaultShortcut: string
    currentShortcut: string
}

interface SettingsState {
    keyboardShortcuts: {
        toggleSidebar: KeyboardShortcut
    }
    updateShortcut: (id: keyof SettingsState['keyboardShortcuts'], shortcut: string) => void
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            keyboardShortcuts: {
                toggleSidebar: {
                    key: 'toggleSidebar',
                    description: 'Toggle sidebar visibility',
                    defaultShortcut: 'Cmd+B',
                    currentShortcut: 'Cmd+B'
                }
            },
            updateShortcut: (id, shortcut) =>
                set((state) => ({
                    keyboardShortcuts: {
                        ...state.keyboardShortcuts,
                        [id]: {
                            ...state.keyboardShortcuts[id],
                            currentShortcut: shortcut
                        }
                    }
                }))
        }),
        {
            name: 'settings-storage'
        }
    )
) 