'use client'

import { useState } from 'react'
import { ListTodo, Calendar, Flag, AlertCircle, ListPlus } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { TaskInput } from './task-input'
import { SlashMenu, type SlashMenuItem } from './slash-menu'
import { useKeyboardShortcut } from '@/modules/quick-task'
import { NewListDialog } from '@/modules/quick-task/components/new-list-dialog'
import { useSettingsStore } from '@/modules/quick-task/state/settings'
import { useSlashCommands } from '@/shared/hooks/use-slash-commands'

interface AddTaskProps {
	onAddTask: (title: string, type?: string) => void
	onCreateList?: (name: string) => void
}

const slashMenuItems: SlashMenuItem[] = [
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
	const [newTaskTitle, setNewTaskTitle] = useState('')
	const { isOpen, setIsOpen, isFocused, setIsFocused } = useSlashCommands()
	const [showNewListDialog, setShowNewListDialog] = useState(false)
	const shortcutKey = useSettingsStore((state) => state.shortcuts.newTask)

	useKeyboardShortcut(shortcutKey.toLowerCase(), () => {
		setIsFocused(true)
	})

	const handleSubmit = () => {
		if (newTaskTitle.trim()) {
			onAddTask(newTaskTitle)
			setNewTaskTitle('')
			setIsOpen(false)
		}
	}

	const handleInputChange = (value: string) => {
		setNewTaskTitle(value)
		setIsOpen(value.startsWith('/'))
	}

	const handleMenuSelect = (item: SlashMenuItem) => {
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
			<form
				onSubmit={(e) => e.preventDefault()}
				className="my-4 relative w-full"
			>
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
				<TaskInput
					value={newTaskTitle}
					onChange={handleInputChange}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
					isFocused={isFocused}
					shortcutKey={shortcutKey}
					onSubmit={handleSubmit}
				/>
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
