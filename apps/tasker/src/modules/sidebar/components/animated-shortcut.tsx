import { useSettingsStore } from '@/modules/quick-task/state/settings'
import { motion, AnimatePresence } from 'framer-motion'
import React from 'react'

interface ShortcutSettings {
	newTask: string;
	// add other shortcuts here if needed
}

interface AnimatedShortcutProps {
	shortcutKey: keyof ShortcutSettings
	isFocused?: boolean
	className?: string
}

export function AnimatedShortcut({
	shortcutKey,
	isFocused = false,
	className
}: AnimatedShortcutProps) {
	const shortcut = useSettingsStore((state) => state.shortcuts[shortcutKey])

	return (
		<kbd className={className}>
			<AnimatePresence mode="wait">
				{isFocused ? (
					<motion.span
						key="enter"
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.9 }}
						transition={{ duration: 0.2 }}
					>
						Enter
					</motion.span>
				) : (
					<motion.span
						key="shortcut"
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.9 }}
						transition={{ duration: 0.2 }}
					>
						{shortcut}
					</motion.span>
				)}
			</AnimatePresence>
		</kbd>
	)
}
