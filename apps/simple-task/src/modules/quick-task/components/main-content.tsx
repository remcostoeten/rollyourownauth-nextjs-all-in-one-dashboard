'use client'

import { useState, useEffect } from 'react'
import { Search, Plus, Link, FileText, Files } from 'lucide-react'
import type { Task } from '../types/task'
import { taskService } from '../services/task-service'
import { TaskItem } from './task-item'
import { EmptyState } from '@/src/shared/components/common/empty-state'
import { TaskDetail } from './task-detail'
import { useKeyboardShortcut } from '../hooks/use-keyboard-shortcut'
import { useSettingsStore } from '../store/settings'
import { cn } from '@/src/shared/helpers/cn'
import { LoaderBar, Spinner } from '@/src/shared/components/effects/loaders'
import Kbd from '@/src/shared/components/ui/kbd'
import { motion } from 'framer-motion'
import { AnimatePresence } from 'framer-motion'
import { Droppable } from 'react-beautiful-dnd'

/**
 * @author Remco Stoeten
 * @description Main content component handling tasks list, search, and task details.
 */
interface MainContentProps {
	activeItem: string
	onTaskSelect: (task: Task | null) => void
	sidebarVisible?: boolean
}

export function MainContent({
	activeItem,
	onTaskSelect,
	sidebarVisible = true
}: MainContentProps) {
	const [tasks, setTasks] = useState<Task[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [newTaskTitle, setNewTaskTitle] = useState('')
	const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
	const [isFocused, setIsFocused] = useState(false)

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (isFocused && e.key === 'Escape') {
				setIsFocused(false)
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [isFocused])
	useEffect(() => {
		loadTasks()
	}, [])

	useKeyboardShortcut('newTask', () => {
		const input = document.getElementById('new-task-input')
		if (input) {
			input.focus()
		}
	})

	async function loadTasks() {
		try {
			const tasks = await taskService.getTasks()
			setTasks(tasks)
		} catch (error) {
			console.error('Failed to load tasks:', error)
		} finally {
			setIsLoading(false)
		}
	}

	async function handleAddTask(e: React.FormEvent) {
		e.preventDefault()
		if (!newTaskTitle.trim()) return

		try {
			const newTask = await taskService.createTask({
				title: newTaskTitle.trim()
			})
			setTasks((prev) => [...prev, newTask])
			setNewTaskTitle('')
		} catch (error) {
			console.error('Failed to create task:', error)
		}
	}

	async function handleToggleTask(task: Task) {
		try {
			const updatedTask = await taskService.updateTask(task.id, {
				completed: !task.completed
			})
			setTasks((prev) =>
				prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
			)
		} catch (error) {
			console.error('Failed to update task:', error)
		}
	}

	if (isLoading) {
		return (
			<>
				<Spinner size={29} className="opacity-50" isFullScreen center />
			</>
		)
	}

	return (
		<div
			className={cn(
				'flex-1 flex flex-col bg-background pt-6 transition-all duration-300 ease-in-out',
				sidebarVisible ? 'ml-20' : 'ml-0'
			)}
		>
			<div className="px-8 py-6 flex items-center justify-between">
				<h1 className="text-2xl font-semibold text-foreground capitalize">
					{activeItem}
				</h1>
			</div>

			<div className="px-8 flex-1 overflow-auto">
				{tasks.length === 0 ? (
					<div className="flex-1 flex items-center justify-center min-h-[calc(100vh-10rem)]">
						<EmptyState
							title="No tasks yet"
							description="Create your first task to get started on your journey to productivity"
							icons={[FileText, Link, Files]}
							action={{
								label: 'Create Task',
								onClick: () => {
									const input =
										document.getElementById(
											'new-task-input'
										)
									if (input) {
										input.focus()
									}
								}
							}}
						/>
					</div>
				) : (
					<>
						<div className="flex items-center gap-2 mb-4">
							<div className="flex-1 relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
								<input
									type="text"
									placeholder="Search tasks... "
									className="w-full bg-secondary/30 border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
								/>
							</div>
						</div>

						<div className="space-y-1">
							<Droppable 
								droppableId="tasks-list" 
								isDropDisabled={false}
								isCombineEnabled={false}
								ignoreContainerClipping={false}
							>
								{(provided) => (
									<div
										{...provided.droppableProps}
										ref={provided.innerRef}
										className="space-y-1"
									>
										{tasks.map((task, index) => (
											<TaskItem
												key={task.id}
												task={task}
												onToggle={handleToggleTask}
												onSelect={() => {
													setSelectedTaskId(task.id)
													onTaskSelect(task)
												}}
												index={index}
											/>
										))}
										{provided.placeholder}
									</div>
								)}
							</Droppable>
						</div>
					</>
				)}

				<form onSubmit={handleAddTask} className="mt-4">
					<div className="flex items-center gap-2 w-full">
						<Plus className="w-4 h-4 text-muted-foreground" />
						<div className="relative flex items-center w-full">
							<input
								id="new-task-input"
								type="text"
								onFocus={() => setIsFocused(true)}
								value={newTaskTitle}
								onChange={(e) =>
									setNewTaskTitle(e.target.value)
								}
								placeholder="Add a task.."
								className="flex-1 bg-transparent text-foreground placeholder-muted-foreground focus:outline-none pr-10"
							/>
							<Kbd className="absolute right-2 text-muted-foreground">
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
											{
												useSettingsStore.getState()
													.shortcuts.newTask
											}
										</motion.span>
									)}
								</AnimatePresence>
							</Kbd>
						</div>
					</div>
				</form>
			</div>

			{selectedTaskId && (
				<TaskDetail
					taskId={selectedTaskId}
					onClose={() => {
						setSelectedTaskId(null)
						onTaskSelect(null)
					}}
				/>
			)}
		</div>
	)
}
