'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
	X,
	Calendar,
	Users,
	Tag,
	Clock,
	Paperclip,
	MoreVertical
} from 'lucide-react'
import type { Task } from '../types/task'
import { taskService } from '../services/task-service'

interface TaskDetailProps {
	taskId: string | null
	onClose: () => void
}

export function TaskDetail({ taskId, onClose }: TaskDetailProps) {
	const [task, setTask] = useState<Task | null>(null)

	useEffect(() => {
		if (taskId) {
			taskService.getTask(taskId).then(setTask)
		}
	}, [taskId])

	if (!task) return null

	const handleUpdate = async (update: Partial<Task>) => {
		const updatedTask = await taskService.updateTask(task.id, update)
		setTask(updatedTask)
	}

	return (
		<AnimatePresence>
			{task && (
				<motion.div
					initial={{ x: '100%' }}
					animate={{ x: 0 }}
					exit={{ x: '100%' }}
					transition={{ type: 'spring', stiffness: 300, damping: 30 }}
					className="fixed top-0 right-0 w-[400px] h-full bg-card shadow-lg overflow-hidden flex flex-col"
				>
					<div className="flex items-center justify-between p-6 border-b border-border">
						<h2 className="text-xl font-semibold text-foreground">
							Task Details
						</h2>
						<button
							onClick={onClose}
							className="p-2 rounded-full hover:bg-primary/10 transition-colors"
						>
							<X className="w-5 h-5 text-muted-foreground" />
						</button>
					</div>

					<div className="flex-1 overflow-y-auto p-6 space-y-6">
						<div className="space-y-4">
							<input
								type="text"
								value={task.title}
								onChange={(e) =>
									handleUpdate({ title: e.target.value })
								}
								className="w-full text-2xl font-bold bg-transparent text-foreground border-none focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
							/>
							<div className="flex flex-wrap gap-2">
								<button className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground bg-primary/10 rounded-full hover:bg-primary/20 transition-colors">
									<Calendar className="w-4 h-4" />
									<span>
										{task.dueDate || 'Set due date'}
									</span>
								</button>
								<button className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground bg-primary/10 rounded-full hover:bg-primary/20 transition-colors">
									<Users className="w-4 h-4" />
									<span>{task.assignee || 'Assign'}</span>
								</button>
								<button className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground bg-primary/10 rounded-full hover:bg-primary/20 transition-colors">
									<Tag className="w-4 h-4" />
									<span>
										{task.labels?.length
											? task.labels.join(', ')
											: 'Add labels'}
									</span>
								</button>
							</div>
						</div>

						<div className="space-y-2">
							<h3 className="text-sm font-medium text-muted-foreground">
								Description
							</h3>
							<textarea
								value={task.description || ''}
								onChange={(e) =>
									handleUpdate({
										description: e.target.value
									})
								}
								placeholder="Add a more detailed description..."
								className="w-full h-32 bg-secondary text-foreground rounded-md p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
							/>
						</div>

						<div className="space-y-2">
							<h3 className="text-sm font-medium text-muted-foreground">
								Subtasks
							</h3>
							{task.subtasks?.map((subtask) => (
								<div
									key={subtask.id}
									className="flex items-center gap-2"
								>
									<input
										type="checkbox"
										checked={subtask.completed}
										onChange={() => {
											const updatedSubtasks =
												task.subtasks?.map((st) =>
													st.id === subtask.id
														? {
																...st,
																completed:
																	!st.completed
															}
														: st
												)
											handleUpdate({
												subtasks: updatedSubtasks
											})
										}}
										className="rounded border-border text-primary focus:ring-primary"
									/>
									<input
										type="text"
										value={subtask.title}
										onChange={(e) => {
											const updatedSubtasks =
												task.subtasks?.map((st) =>
													st.id === subtask.id
														? {
																...st,
																title: e.target
																	.value
															}
														: st
												)
											handleUpdate({
												subtasks: updatedSubtasks
											})
										}}
										className="flex-1 bg-transparent text-foreground border-none focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
									/>
								</div>
							))}
							<button
								onClick={() => {
									const newSubtask = {
										id: Date.now().toString(),
										title: '',
										completed: false
									}
									handleUpdate({
										subtasks: [
											...(task.subtasks || []),
											newSubtask
										]
									})
								}}
								className="text-sm text-primary hover:underline"
							>
								+ Add subtask
							</button>
						</div>

						<div className="space-y-2">
							<h3 className="text-sm font-medium text-muted-foreground">
								Activity
							</h3>
							<div className="space-y-4">
								<div className="flex items-start gap-3">
									<Clock className="w-5 h-5 text-muted-foreground mt-1" />
									<div>
										<p className="text-sm text-muted-foreground">
											Created on{' '}
											{new Date(
												task.createdAt
											).toLocaleString()}
										</p>
										<p className="text-sm text-muted-foreground">
											Last updated on{' '}
											{new Date(
												task.updatedAt
											).toLocaleString()}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="p-6 border-t border-border">
						<div className="flex items-center gap-2">
							<button className="p-2 text-muted-foreground hover:text-foreground hover:bg-primary/10 rounded-full transition-colors">
								<Paperclip className="w-5 h-5" />
							</button>
							<input
								type="text"
								placeholder="Add a comment..."
								className="flex-1 bg-secondary text-foreground rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
							/>
							<button className="p-2 text-muted-foreground hover:text-foreground hover:bg-primary/10 rounded-full transition-colors">
								<MoreVertical className="w-5 h-5" />
							</button>
						</div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}

export default TaskDetail
