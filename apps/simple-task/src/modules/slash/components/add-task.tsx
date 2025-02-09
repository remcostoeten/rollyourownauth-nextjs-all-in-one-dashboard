'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Plus, ListTodo, Calendar, Flag, AlertCircle, ListPlus } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { SlashMenu } from './slash-menu'
import { useSlashCommands } from '../hooks/use-slash-commands'
import { NewListDialog } from '../../quick-task/components/new-list-dialog'

interface AddTaskProps {
	onAddTask: (title: string, type?: string) => void
	onCreateList?: (name: string) => void
}

const slashMenuItems = [
	{
		id: 'task',
		title: 'Add Task',
		icon: <ListTodo className="w-4 h-4" />,
		description: 'Add a new task to your list'
	},
	{
		id: 'scheduled',
		title: 'Add Scheduled Task',
		icon: <Calendar className="w-4 h-4" />,
		description: 'Add a task with a due date'
	},
	{
		id: 'priority',
		title: 'Add Priority Task',
		icon: <Flag className="w-4 h-4" />,
		description: 'Add a high priority task'
	},
	{
		id: 'blocker',
		title: 'Add Blocker',
		icon: <AlertCircle className="w-4 h-4" />,
		description: 'Add a blocking issue'
	},
	{
		id: 'new-list',
		title: 'New List',
		icon: <ListPlus className="w-4 h-4" />,
		description: 'Create a new list'
	}
]

export function AddTask({ onAddTask, onCreateList }: AddTaskProps) {
	const inputRef = useRef<HTMLInputElement>(null)
	const [newTaskTitle, setNewTaskTitle] = useState('')
	const { isOpen, setIsOpen, isFocused, setIsFocused } = useSlashCommands()
	const [showNewListDialog, setShowNewListDialog] = useState(false)

	useEffect(() => {
		if (isFocused && inputRef.current) {
			inputRef.current.focus()
		} else if (!isFocused && inputRef.current) {
			inputRef.current.blur()
		}
	}, [isFocused])

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (newTaskTitle.trim()) {
			onAddTask(newTaskTitle)
			setNewTaskTitle('')
			setIsOpen(false)
		}
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		setNewTaskTitle(value)
		
		// Only show menu if input starts with /
		if (value.startsWith('/')) {
			setIsOpen(true)
		} else {
			setIsOpen(false)
		}
	}

	const handleMenuSelect = (item: { id: string; title: string }) => {
		if (item.id === 'new-list') {
			setShowNewListDialog(true)
			setIsOpen(false)
		} else {
			onAddTask(newTaskTitle.replace('/', ''), item.id)
			setNewTaskTitle('')
			setIsOpen(false)
		}
	}

	return (
		<>
			<form onSubmit={handleSubmit} className="my-4 relative w-full">
				<AnimatePresence>
					{isOpen && (
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 10 }}
							transition={{ duration: 0.15 }}
							className="absolute bottom-full left-0 w-full mb-2 z-50"
						>
							<SlashMenu
								items={slashMenuItems}
								onSelect={handleMenuSelect}
							/>
						</motion.div>
					)}
				</AnimatePresence>
				<div className="flex items-center gap-2 w-full">
					<Plus className="w-4 h-4 text-muted-foreground" />
					<div className="relative flex items-center w-full">
						<input
							ref={inputRef}
							type="text"
							value={newTaskTitle}
							onChange={handleInputChange}
							onFocus={() => setIsFocused(true)}
							onBlur={() => setIsFocused(false)}
							placeholder="Add a task... (Type / for menu)"
							className="w-full bg-transparent border-none outline-none placeholder:text-muted-foreground text-sm"
						/>
					</div>
				</div>
			</form>
			<NewListDialog
				isOpen={showNewListDialog}
				onClose={() => setShowNewListDialog(false)}
				onCreateList={(name) => {
					onCreateList?.(name)
					setShowNewListDialog(false)
				}}
			/>
		</>
	)
}
