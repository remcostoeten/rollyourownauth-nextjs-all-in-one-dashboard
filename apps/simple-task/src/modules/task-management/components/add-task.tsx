'use client'

import { useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import { Plus } from 'lucide-react'
import { TaskInput } from './task-input'

interface AddTaskProps {
	onAddTask: (title: string) => void
}

export function AddTask({ onAddTask }: AddTaskProps) {
	const [isAdding, setIsAdding] = useState(false)
	const [title, setTitle] = useState('')
	const [isFocused, setIsFocused] = useState(false)

	const handleSubmit = async () => {
		if (!title.trim()) return
		onAddTask(title)
		setTitle('')
		setIsAdding(false)
	}

	return (
		<div className="relative">
			{isAdding ? (
				<TaskInput
					value={title}
					onChange={setTitle}
					onSubmit={handleSubmit}
					onFocus={() => setIsFocused(true)}
					onBlur={() => {
						setIsFocused(false)
						setTitle('')
						setIsAdding(false)
					}}
					isFocused={isFocused}
					shortcutKey="/"
				/>
			) : (
				<Button
					variant="ghost"
					size="sm"
					onClick={() => setIsAdding(true)}
					className="gap-2"
				>
					<Plus className="w-4 h-4" />
					Add Task
				</Button>
			)}
		</div>
	)
}
