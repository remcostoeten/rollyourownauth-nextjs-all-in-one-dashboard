'use client'

import { useEffect } from 'react'

type KeyboardShortcut = string | string[]

export function useKeyboardShortcut(
	shortcut: KeyboardShortcut,
	callback: () => void
) {
	useEffect(() => {
		const shortcuts = Array.isArray(shortcut) ? shortcut : [shortcut]

		const handleKeyDown = (event: KeyboardEvent) => {
			const { key, ctrlKey, altKey, shiftKey, metaKey } = event

			const isShortcutPressed = shortcuts.some((sc) => {
				const keys = sc.toLowerCase().split('+')
				const modifiers = {
					ctrl: keys.includes('ctrl'),
					alt: keys.includes('alt'),
					shift: keys.includes('shift'),
					meta: keys.includes('meta')
				}

				const mainKey = keys.find(
					(k) => !['ctrl', 'alt', 'shift', 'meta'].includes(k)
				)

				return (
					key.toLowerCase() === mainKey &&
					ctrlKey === modifiers.ctrl &&
					altKey === modifiers.alt &&
					shiftKey === modifiers.shift &&
					metaKey === modifiers.meta
				)
			})

			if (isShortcutPressed) {
				event.preventDefault()
				callback()
			}
		}

		window.addEventListener('keydown', handleKeyDown)

		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [shortcut, callback])
}
