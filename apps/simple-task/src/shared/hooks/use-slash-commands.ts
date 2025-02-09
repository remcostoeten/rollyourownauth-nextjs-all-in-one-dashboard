'use client'

import { useState, useCallback, useEffect } from 'react'
import type { Command } from '../../modules/slash/models/z.command'

export function useSlashCommands() {
	const [isOpen, setIsOpen] = useState(false)
	const [commands, setCommands] = useState<Command[]>([])
	const [isFocused, setIsFocused] = useState(false)

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Alt + N to focus
			if (e.altKey && e.key.toLowerCase() === 'n') {
				e.preventDefault()
				setIsFocused(true)
			}
			// Escape to cancel focus
			else if (e.key === 'Escape') {
				setIsFocused(false)
				setIsOpen(false)
			}
		}

		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [])

	const registerCommand = useCallback((command: Command) => {
		setCommands((prev) => [...prev, command])
	}, [])

	const unregisterCommand = useCallback((commandId: string) => {
		setCommands((prev) => prev.filter((cmd) => cmd.id !== commandId))
	}, [])

	return {
		isOpen,
		setIsOpen,
		isFocused,
		setIsFocused,
		commands,
		registerCommand,
		unregisterCommand
	}
}
