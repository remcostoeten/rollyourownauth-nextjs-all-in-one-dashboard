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
} from '@/components/icons'
import { cn } from 'helpers'
import {
	Button,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from 'ui'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { SettingsMenu } from './settings-menu'
import { motion } from 'framer-motion'
import { CreateNewDropdown } from './create-new-dropdown'
import { useSearch } from '../../quick-task/hooks/use-search'
import { SearchResults } from './search-results'
import type { DropResult } from 'react-beautiful-dnd'
import { useListsStore } from '../../quick-task/state/lists'
import Image from 'next/image'
import { mockUser } from '@repo/configuration/mock-user'
type NavItem = {
	id: string
	icon: React.ElementType
	label: string
	color?: string
	isHidden?: boolean
}

const initialNavItems: NavItem[] = [
	{ id: 'inbox', icon: InboxIcon, label: 'Inbox' },
	{ id: 'today', icon: TodayIcon, label: 'Today' },
	{ id: 'tasks', icon: TasksIcon, label: 'Tasks' },
	{ id: 'updates', icon: UpdatesIcon, label: 'Updates' },
	{ id: 'lists', icon: ListsIcon, label: 'Lists' }
]

interface SidebarProps {
	isVisible: boolean
	isLocked: boolean
	onToggleLock: () => void
	activeItem: string
	onItemClick: (id: string) => void
}

interface NavItemProps {
	item: NavItem
	isActive: boolean
	onClick: () => void
}

const NavItemComponent = ({ item, isActive, onClick }: NavItemProps) => {
	const [hovering, setHovering] = useState(false)
	const buttonRef = useRef<HTMLButtonElement>(null)
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

	const handleMouseMove = (e: React.MouseEvent) => {
		if (buttonRef.current) {
			const rect = buttonRef.current.getBoundingClientRect()
			setMousePosition({
				x: e.clientX - rect.left,
				y: e.clientY - rect.top
			})
		}
	}

	return (
		<motion.button
			ref={buttonRef}
			className={cn(
				'relative flex items-center gap-3 w-full rounded-sm px-3 py-1.5 text-sm transition-colors overflow-hidden',
				isActive
					? 'text-foreground bg-primary/5'
					: 'text-muted-foreground hover:text-foreground'
			)}
			style={{ color: item.color }}
			onClick={onClick}
			onMouseMove={handleMouseMove}
			onHoverStart={() => setHovering(true)}
			onHoverEnd={() => setHovering(false)}
		>
			<item.icon />
			<span>{item.label}</span>
			{hovering && (
				<motion.div
					className="absolute inset-0 rounded-sm pointer-events-none"
					initial={{ opacity: 0 }}
					animate={{
						opacity: 0.05
					}}
					style={{
						background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, var(--primary) 0%, transparent 100%)`
					}}
					transition={{ duration: 0.15, ease: 'easeOut' }}
				/>
			)}
		</motion.button>
	)
}

export function Sidebar({
	isVisible,
	isLocked,
	onToggleLock,
	activeItem,
	onItemClick
}: SidebarProps) {
	const [navItems, setNavItems] = useState(initialNavItems)
	const [searchQuery, setSearchQuery] = useState('')
	const searchResults = useSearch(searchQuery)

	const { lists } = useListsStore()
	const user = mockUser

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
		if (reorderedItem && result.destination) {
			items.splice(result.destination.index, 0, reorderedItem)
			setNavItems(items)
		}
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

	const handleItemClick = (item: NavItem) => {
		if (item) {
			onItemClick(item.id)
		}
	}

	return (
		<div
			className={cn(
				'w-60 flex flex-col h-screen bg-background/50 backdrop-blur-sm transition-all duration-300 ease-in-out border-r border-dashed',
				'absolute top-0 left-0 origin-left',
				isVisible
					? 'translate-x-0 opacity-100'
					: '-translate-x-full opacity-0'
			)}
		>
			<div className="p-4 border-b border-dashed">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-lg font-semibold text-foreground">
						Quick Tasks
					</h2>
					<TooltipProvider delayDuration={0}>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									onClick={onToggleLock}
									className={cn(
										'h-8 w-8',
										isLocked
											? 'text-primary'
											: 'text-muted-foreground'
									)}
								>
									{isLocked ? (
										<Pin className="h-4 w-4" />
									) : (
										<PinOff className="h-4 w-4" />
									)}
								</Button>
							</TooltipTrigger>
							<TooltipContent side="right" align="center">
								<p>
									{isLocked ? 'Unpin sidebar' : 'Pin sidebar'}
								</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
				<div className="relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
					<input
						type="text"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="Search tasks, lists..."
						className="w-full bg-background/50 border border-border rounded-md pl-9 pr-4 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
					/>
				</div>
			</div>

			{searchQuery.trim() && (
				<div className="flex-1 overflow-auto">
					<SearchResults
						results={searchResults}
						query={searchQuery}
						onSelect={handleSearchSelect}
						isVisible={true}
					/>
				</div>
			)}

			{!searchQuery.trim() && (
				<div className="flex-1 overflow-auto py-4">
					<div className="px-3 mb-2">
						<h3 className="text-xs font-medium text-muted-foreground mb-2 px-3">
							QUICK ACCESS
						</h3>
						<nav className="space-y-1">
							<DragDropContext onDragEnd={onDragEnd}>
								<Droppable
									droppableId="sidebar-list"
									isDropDisabled={false}
									isCombineEnabled={false}
									ignoreContainerClipping={false}
								>
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
																		handleItemClick(
																			item
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

					<div className="px-3 mb-2">
						<h3 className="text-xs font-medium text-muted-foreground mb-2 px-3">
							RECENT LISTS
						</h3>
						<nav className="space-y-1">
							{lists.slice(0, 3).map((list) => (
								<button
									key={list.id}
									onClick={() => onItemClick(list.id)}
									className={cn(
										'flex items-center w-full rounded-sm px-3 py-1.5 text-sm transition-colors group relative overflow-hidden',
										list.id === activeItem
											? 'text-foreground bg-primary/5'
											: 'text-muted-foreground hover:text-foreground hover:bg-primary/5'
									)}
								>
									<ListsIcon className="w-4 h-4 mr-3" />
									<span className="truncate">
										{list.name}
									</span>
								</button>
							))}
						</nav>
					</div>
				</div>
			)}

			<div className="border-t border-dashed p-4 space-y-3">
				<div className="flex items-center gap-3 p-2 rounded-lg bg-secondary/30">
					<Image
						width={32}
						height={32}
						src={user?.profile.avatar || '/placeholder.svg'}
						className="w-8 h-8 object-cover rounded-full ring-1 ring-border"
						alt={user?.profile.firstName}
					/>
					<div className="flex-1 min-w-0">
						<p className="text-sm font-medium text-foreground truncate">
							{user?.profile.lastName}
						</p>
						<p className="text-xs text-muted-foreground truncate">
							{user?.email}
						</p>
					</div>
					<div className="flex items-center gap-1">
						<SettingsMenu />
						<ThemeSwitcher />
					</div>
				</div>

				<CreateNewDropdown />
			</div>
		</div>
	)
}
