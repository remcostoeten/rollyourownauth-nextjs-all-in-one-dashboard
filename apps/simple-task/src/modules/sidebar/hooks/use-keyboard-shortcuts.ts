import { useEffect } from 'react'
import { useSettingsStore } from '../../settings/state/settings'

export function useKeyboardShortcuts(onToggleSidebar: () => void) {
    const { keyboardShortcuts } = useSettingsStore()

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Toggle sidebar with Cmd/Ctrl + B
            if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
                e.preventDefault()
                onToggleSidebar()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [onToggleSidebar])
} 