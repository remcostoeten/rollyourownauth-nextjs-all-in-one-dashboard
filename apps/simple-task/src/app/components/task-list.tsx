import { motion } from 'framer-motion'
import { ChevronRight, Plus } from 'lucide-react'
import { Task } from '../types'

const tasks: Task[] = [
	{
		id: '1',
		title: 'This is a main task',
		subtasks: [
			{ id: '2', title: 'This is also a top level task, but a second' },
			{ id: '3', title: 'This is a top level task' }
		]
	}
]

interface TaskListProps {
	onTaskSelect: (task: Task) => void
	selectedTaskId?: string
}

export function TaskList({ onTaskSelect, selectedTaskId }: TaskListProps) {
	return (
		<div className="flex-1 p-6 overflow-auto">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-semibold">Inbox</h1>
				<button className="p-2 hover:bg-gray-800 rounded-md">
					<Plus className="w-4 h-4" />
				</button>
			</div>
			<div className="space-y-2">
				{tasks.map((task) => (
					<TaskItem
						key={task.id}
						task={task}
						onSelect={onTaskSelect}
						isSelected={task.id === selectedTaskId}
					/>
				))}
			</div>
		</div>
	)
}

function TaskItem({
	task,
	onSelect,
	isSelected
}: {
	task: Task
	onSelect: (task: Task) => void
	isSelected: boolean
}) {
	return (
		<div className="space-y-2">
			<motion.button
				onClick={() => onSelect(task)}
				className={`w-full text-left p-3 rounded-lg flex items-center gap-2 ${
					isSelected ? 'bg-gray-800' : 'hover:bg-gray-800/50'
				}`}
				whileHover={{ scale: 1.01 }}
				whileTap={{ scale: 0.99 }}
			>
				<input
					type="checkbox"
					className="rounded-full border-gray-600"
				/>
				<span>{task.title}</span>
				<ChevronRight className="w-4 h-4 ml-auto" />
			</motion.button>
			{task.subtasks?.map((subtask) => (
				<motion.button
					key={subtask.id}
					onClick={() => onSelect(subtask)}
					className={`w-full text-left p-3 rounded-lg flex items-center gap-2 ml-6 ${
						isSelected ? 'bg-gray-800' : 'hover:bg-gray-800/50'
					}`}
					whileHover={{ scale: 1.01 }}
					whileTap={{ scale: 0.99 }}
				>
					<input
						type="checkbox"
						className="rounded-full border-gray-600"
					/>
					<span>{subtask.title}</span>
					<ChevronRight className="w-4 h-4 ml-auto" />
				</motion.button>
			))}
		</div>
	)
}
