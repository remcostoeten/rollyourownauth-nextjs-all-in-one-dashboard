'use client'
import { MoreHorizontal } from 'lucide-react'
import type { Task } from '../types/task'
import { Checkbox } from '@/src/shared/components/ui/checkbox'
import { cn } from '@/src/shared/helpers/cn'

interface TaskItemProps {
	task: Task
	level?: number
	onToggle?: (task: Task) => void
	onSelect?: (task: Task) => void
}

export function TaskItem({
	task,
	level = 0,
	onToggle,
	onSelect
}: TaskItemProps) {
	return (
		<div className="group">
			<div
				className={cn(
					'flex items-center gap-2 py-1 px-2 rounded-lg group-hover:bg-primary/10 transition-colors',
					task.completed && 'opacity-50'
				)}
				style={{ paddingLeft: `${level * 24 + 8}px` }}
			>
				<Checkbox
					checked={task.completed}
					onCheckedChange={() => onToggle?.(task)}
					className="rounded-full border-2 border-muted-foreground"
				/>
				<span className="flex-1 text-sm text-foreground">
					{task.title}
				</span>
				{task.dueDate && (
					<span className="text-xs text-muted-foreground">
						{task.dueDate}
					</span>
				)}
				{task.labels && task.labels.length > 0 && (
					<span className="text-xs text-muted-foreground">
						{task.labels.join(', ')}
					</span>
				)}
				<button
					onClick={() => onSelect?.(task)}
					className="p-1 opacity-0 group-hover:opacity-100 hover:bg-primary/20 rounded transition-all"
				>
					<MoreHorizontal className="w-4 h-4 text-muted-foreground" />
				</button>
			</div>
			{task.subtasks?.map((subtask) => (
				<TaskItem
					key={subtask.id}
					task={subtask}
					level={level + 1}
					onToggle={onToggle}
					onSelect={onSelect}
				/>
			))}
		</div>
	)
}
