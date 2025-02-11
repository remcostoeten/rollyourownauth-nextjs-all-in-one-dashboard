'use client'

import { useState } from 'react'
import { MainContent, Sidebar, TaskDetail } from '../../modules/quick-task'
import type { Task } from '../../modules/quick-task/models/z.task'

export function HomeView() {
	const [isSidebarLocked, setIsSidebarLocked] = useState(true)
	const [isHovering, setIsHovering] = useState(false)
	const [activeItem, setActiveItem] = useState('inbox')
	const [selectedTask, setSelectedTask] = useState<Task | null>(null)

	return (
		<div className="flex h-screen bg-background">
			<div
				className="relative transition-[width] duration-300 ease-in-out"
				style={{
					width: isSidebarLocked || isHovering ? '240px' : '2px'
				}}
				onMouseEnter={() => setIsHovering(true)}
				onMouseLeave={() => setIsHovering(false)}
			>
				<Sidebar
					isVisible={isSidebarLocked || isHovering}
					onToggleLock={() => setIsSidebarLocked(!isSidebarLocked)}
					isLocked={isSidebarLocked}
					activeItem={activeItem}
					onItemClick={setActiveItem}
				/>
				{!isSidebarLocked && !isHovering && (
					<div className="absolute top-0 left-0 w-2 h-screen cursor-pointer" />
				)}
			</div>
			<MainContent
				activeItem={activeItem}
				onTaskSelect={setSelectedTask}
			/>
			{selectedTask && (
				<TaskDetail
					taskId={selectedTask.id}
					onClose={() => setSelectedTask(null)}
				/>
			)}
		</div>
	)
}
