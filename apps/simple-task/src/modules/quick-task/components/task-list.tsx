import { AnimatePresence, motion } from 'framer-motion'
import { EmptyState } from '@/shared/components/common'
import type { Task } from '@/modules/quick-task/models/z.task'
import { TaskItem } from './task-item'
import { FileText, Link, Files } from 'lucide-react'

interface TaskListProps {
	tasks: Task[]
	onToggle: (task: Task) => void
	onSelect: (taskId: string) => void
}

export function TaskList({ tasks, onToggle, onSelect }: TaskListProps) {
	if (tasks.length === 0) {
		return (
			<div className="flex-1 flex items-center justify-center">
				<EmptyState
					title="No tasks yet"
					description="Create your first task to get started on your journey to productivity"
					icons={[FileText, Link, Files]}
					action={{
						label: 'Create Task',
						onClick: () => {
							const input =
								document.getElementById('new-task-input')
							if (input) {
								input.focus()
							}
						}
					}}
				/>
			</div>
		)
	}

	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className="space-y-1"
			>
				{tasks.map((task) => (
					<TaskItem
						key={task.id}
						task={task}
						onToggle={onToggle}
						onSelect={onSelect}
					/>
				))}
			</motion.div>
		</AnimatePresence>
	)
}
