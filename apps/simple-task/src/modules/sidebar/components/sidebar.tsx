'use client'

import type React from 'react'
import { useState, useRef, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Search, Pin, PinOff } from 'lucide-react'
import {
	InboxIcon,
	TodayIcon,
	TasksIcon,
	UpdatesIcon,
	ListsIcon
} from '@/src/components/icons'
import { cn } from 'helpers'
import {
	Button,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from 'ui'
import { ThemeSwitcher } from '@/src/components/theme-switcher'
import { SettingsMenu } from './settings-menu'
import { motion } from 'framer-motion'
import { CreateNewDropdown } from './create-new-dropdown'
import { useSearch } from '../../quick-task/hooks/use-search'
import { SearchResults } from './search-results'
import type { DropResult } from 'react-beautiful-dnd'
import { useListsStore } from '../../quick-task/state/lists'
import Image from 'next/image'
import { mockUser } from 'config'
import type { MockUser } from 'config'

type NavItem = {
	id: string
	icon: React.ElementType
	label: string
	color?: string
	isHidden?: boolean
}

const initialNavItems: NavItem[] = [
	{
		id: 'inbox',
		icon: InboxIcon,
		label: 'Inbox'
	},
	{
		id: 'today',
		icon: TodayIcon,
		label: 'Today'
	},
	{
		id: 'tasks',
		icon: TasksIcon,
		label: 'Tasks'
	},
	{
		id: 'updates',
		icon: UpdatesIcon,
		label: 'Updates'
	},
	{
		id: 'lists',
		icon: ListsIcon,
		label: 'Lists'
	}
]

interface SidebarProps {
	isVisible: boolean
	isLocked: boolean
	onToggleLock: () => void
	activeItem: string
	onItemClick: (id: string) => void
}

export function Sidebar({
	isVisible,
	isLocked,
	onToggleLock,
	activeItem,
	onItemClick
}: SidebarProps) {
	const [mounted, setMounted] = useState(false)
	const [navItems, setNavItems] = useState(initialNavItems)
	const [searchQuery, setSearchQuery] = useState('')
	const searchResults = useSearch(searchQuery)
	const { lists } = useListsStore()
	const user = mockUser as MockUser

	// Only render after component is mounted to prevent hydration mismatch
	useEffect(() => {
		setMounted(true)
	}, [])

	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isVisible && !isLocked) {
				onToggleLock()
			}
		}

		window.addEventListener('keydown', handleEscape)
		return () => window.removeEventListener('keydown', handleEscape)
	}, [isVisible, isLocked, onToggleLock])

	const onDragEnd = (result: DropResult) => {
		if (!result.destination) return

		const items = Array.from(navItems)
		const [reorderedItem] = items.splice(result.source.index, 1)
		items.splice(result.destination.index, 0, reorderedItem)

		setNavItems(items)
	}

	const handleSearchSelect = (result: {
		type: 'task' | 'list'
		id: string
	}) => {
		if (result.type === 'list') {
			onItemClick(result.id)
		} else {
			const task = lists
				.flatMap((list) => list.tasks as Array<{ id: string }>)
				.find((task) => task.id === result.id)
			if (task) {
				onItemClick(task.id)
			}
		}
		setSearchQuery('')
	}

	if (!mounted) {
		return null // Return null on server-side and first render
	}

	return (
		<aside
			className={cn(
				'fixed inset-y-0 left-0 z-20 flex h-full w-64 flex-col border-r bg-background transition-transform duration-300 ease-in-out',
				!isVisible && '-translate-x-full'
			)}
		>
			<div className="flex items-center justify-between p-4">
				<div className="flex items-center gap-2">
					<Image
						src={user.profile.avatar}
						alt={user.profile.firstName}
						width={32}
						height={32}
						className="rounded-full"
					/>
					<div className="flex flex-col">
						<span className="text-sm font-medium">
							{user.profile.firstName} {user.profile.lastName}
						</span>
						<span className="text-xs text-muted-foreground">
							{user.email}
						</span>
					</div>
				</div>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								onClick={onToggleLock}
							>
								{isLocked ? (
									<Pin className="h-4 w-4" />
								) : (
									<PinOff className="h-4 w-4" />
								)}
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							{isLocked ? 'Unlock sidebar' : 'Lock sidebar'}
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>

			<div className="flex flex-col gap-4 p-4">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<input
						type="text"
						placeholder="Search..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full rounded-md border bg-background px-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
					/>
				</div>
				<CreateNewDropdown />
			</div>

			{searchQuery.trim() ? (
				<SearchResults
					results={searchResults}
					query={searchQuery}
					onSelect={handleSearchSelect}
				/>
			) : (
				<div className="flex-1 overflow-auto py-4">
					<div className="px-3 mb-2">
						<h3 className="text-xs font-medium text-muted-foreground mb-2 px-3">
							QUICK ACCESS
						</h3>
						<nav className="space-y-1">
							<DragDropContext onDragEnd={onDragEnd}>
								<Droppable droppableId="sidebar-list">
									{(provided) => (
										<div
											{...provided.droppableProps}
											ref={provided.innerRef}
										>
											{navItems
												.filter(
													(item) => !item.isHidden
												)
												.map((item, index) => (
													<Draggable
														key={item.id}
														draggableId={item.id}
														index={index}
													>
														{(provided) => (
															<div
																ref={
																	provided.innerRef
																}
																{...provided.draggableProps}
																{...provided.dragHandleProps}
																className="relative group"
															>
																<NavItemComponent
																	item={item}
																	isActive={
																		item.id ===
																		activeItem
																	}
																	onClick={() =>
																		onItemClick(
																			item.id
																		)
																	}
																/>
															</div>
														)}
													</Draggable>
												))}
											{provided.placeholder}
										</div>
									)}
								</Droppable>
							</DragDropContext>
						</nav>
					</div>
				</div>
			)}

			<div className="mt-auto p-4">
				<div className="flex items-center justify-between">
					<ThemeSwitcher />
					<SettingsMenu />
				</div>
			</div>
		</aside>
	)
}

function NavItemComponent({
	item,
	isActive,
	onClick
}: {
	item: NavItem
	isActive: boolean
	onClick: () => void
}) {
	return (
		<motion.button
			whileTap={{ scale: 0.98 }}
			onClick={onClick}
			className={cn(
				'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
				'hover:bg-accent/10',
				'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent',
				isActive && 'bg-accent/10 text-accent'
			)}
		>
			<item.icon className="h-4 w-4" />
			<span>{item.label}</span>
		</motion.button>
	)
}
