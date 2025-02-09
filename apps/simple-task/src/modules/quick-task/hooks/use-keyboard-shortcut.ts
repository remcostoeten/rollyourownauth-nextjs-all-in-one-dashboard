import { useEffect } from 'react'
import { useSettingsStore } from '../store/settings'

type Settings = {
	shortcuts: Record<string, string>
}

type ShortcutKey = keyof Settings['shortcuts']

export function useKeyboardShortcut(
	shortcutKey: ShortcutKey,
	callback: () => void
) {
	const shortcut = useSettingsStore((state) => state.shortcuts[shortcutKey])

	useEffect(() => {
		if (!shortcut) return

		const keys = shortcut.split('+').map((k) => k.toLowerCase())

		const handleKeyDown = (e: KeyboardEvent) => {
			const pressedKey = e.key.toLowerCase()
			const modifiers = {
				ctrl: e.ctrlKey,
				meta: e.metaKey,
				alt: e.altKey,
				shift: e.shiftKey
			}

			const allKeysMatch = keys?.every((k: string) => {
				if (k === 'ctrl' || k === 'control') return modifiers.ctrl
				if (k === 'meta' || k === 'command') return modifiers.meta
				if (k === 'alt') return modifiers.alt
				if (k === 'shift') return modifiers.shift
				return k === pressedKey
			})

			if (allKeysMatch) {
				e.preventDefault()
				callback()
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [shortcut, callback])
}
