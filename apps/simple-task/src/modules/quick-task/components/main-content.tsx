'use client'

import { useState, useEffect, Suspense, lazy } from 'react'
import type { Task } from '@/modules/quick-task/models/z.task'
import { cn } from '@/shared/helpers'
import { taskService } from '@/modules/quick-task/services/task-service'
import { Loader2 } from 'lucide-react'
import { Search } from './search-input'
import { TaskList } from './task-list'
import { useListsStore } from '@/modules/quick-task/state/lists'
import { AddTask } from '@/modules/task-management/components/add-task'

const TaskDetail = lazy(() => import('./task-detail'))

interface MainContentProps {
	activeItem: string
	onTaskSelect: (task: Task) => void
}

export function MainContent({ activeItem, onTaskSelect }: MainContentProps) {
	const [tasks, setTasks] = useState<Task[]>([])
	const [loading, setLoading] = useState(true)
	const [searchQuery, setSearchQuery] = useState('')

	useEffect(() => {
		const loadTasks = async () => {
			setLoading(true)
			try {
				const fetchedTasks = await taskService.getTasks()
				setTasks(fetchedTasks)
			} catch (error) {
				console.error('Failed to load tasks:', error)
			} finally {
				setLoading(false)
			}
		}

		loadTasks()
	}, [])

	const filteredTasks = tasks.filter((task) =>
		task.title.toLowerCase().includes(searchQuery.toLowerCase())
	)

	const handleAddTask = async (title: string) => {
		try {
			const newTask = await taskService.createTask({ title })
			setTasks((prev) => [...prev, newTask])
		} catch (error) {
			console.error('Failed to create task:', error)
		}
	}

	const handleTaskSelect = (taskId: string) => {
		const task = tasks.find(t => t.id === taskId)
		if (task) {
			onTaskSelect(task)
		}
	}

	const handleToggleTask = async (task: Task) => {
		try {
			const updatedTask = await taskService.updateTask(task.id, {
				completed: !task.completed
			})
			setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t))
		} catch (error) {
			console.error('Failed to toggle task:', error)
		}
	}

	return (
		<div className={cn('flex-1 p-4 space-y-4')}>
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">{activeItem}</h1>
				<AddTask onAddTask={handleAddTask} />
			</div>
			<Search onSearch={setSearchQuery} />
			{loading ? (
				<div className="flex justify-center items-center h-32">
					<Loader2 className="w-6 h-6 animate-spin" />
				</div>
			) : (
				<TaskList 
					tasks={filteredTasks} 
					onSelect={handleTaskSelect}
					onToggle={handleToggleTask}
				/>
			)}
		</div>
	)
}

export default MainContent
