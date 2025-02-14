'use client'

import type React from 'react'
import { useRef, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Kbd } from '@/shared/components/ui/kbd'

interface TaskInputProps {
	value: string
	onChange: (value: string) => void
	onFocus: () => void
	onBlur: () => void
	isFocused: boolean
	shortcutKey: string
	onSubmit: () => void
}

export function TaskInput({
	value,
	onChange,
	onFocus,
	onBlur,
	isFocused,
	shortcutKey,
	onSubmit
}: TaskInputProps) {
	const inputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		if (isFocused && inputRef.current) {
			inputRef.current.focus()
		} else if (!isFocused && inputRef.current) {
			inputRef.current.blur()
		}
	}, [isFocused])

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			onSubmit()
		}
	}

	return (
		<div className="flex items-center gap-2 w-full">
			<Plus className="w-4 h-4 text-muted-foreground" />
			<div className="relative flex items-center w-full">
				<AnimatePresence mode="wait">
					{!isFocused && !value && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.15 }}
							className="absolute inset-0 flex items-center pointer-events-none text-muted-foreground"
						>
							<span>Create task</span>
							<span className="mx-1">(</span>
							<Kbd>{shortcutKey}</Kbd>
							<span className="mx-1">for menu)</span>
						</motion.div>
					)}
					{isFocused && !value && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.15 }}
							className="absolute inset-0 flex items-center pointer-events-none text-muted-foreground"
						>
							...
						</motion.div>
					)}
				</AnimatePresence>
				<input
					ref={inputRef}
					type="text"
					value={value}
					onChange={(e) => onChange(e.target.value)}
					onFocus={onFocus}
					onBlur={onBlur}
					onKeyDown={handleKeyDown}
					className="w-full bg-transparent border-none outline-none placeholder:text-muted-foreground text-sm"
				/>
				<div className="absolute right-2 text-muted-foreground">
					<AnimatePresence mode="wait">
						{isFocused ? (
							<motion.div
								key="enter"
								initial={{ opacity: 0, y: -5 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 5 }}
							>
								<Kbd>enter ↵</Kbd>
							</motion.div>
						) : (
							<motion.div
								key="shortcut"
								initial={{ opacity: 0, y: -5 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 5 }}
							>
								<Kbd>{shortcutKey}</Kbd>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>
		</div>
	)
}
