import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface ShortcutSettings {
  newTask: string
  quickAdd: string
  toggleSidebar: string
}

interface SettingsState {
  shortcuts: ShortcutSettings
  updateShortcut: (key: keyof ShortcutSettings, value: string) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      shortcuts: {
        newTask: "⌘ + K",
        quickAdd: "⌘ + N",
        toggleSidebar: "⌘ + B",
      },
      updateShortcut: (key, value) =>
        set((state) => ({
          shortcuts: {
            ...state.shortcuts,
            [key]: value,
          },
        })),
    }),
    {
      name: "settings-storage",
    }
  )
) 