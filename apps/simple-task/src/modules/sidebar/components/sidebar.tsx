'use client'

import type React from 'react'
import { useState, useRef, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Search, Pin, PinOff, MoreVertical } from 'lucide-react'
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
	TooltipTrigger,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from 'ui'
import { ThemeSwitcher } from '@/src/components/theme-switcher'
import { SettingsMenu } from './settings-menu'
import { motion, AnimatePresence } from 'framer-motion'
import { CreateNewDropdown } from './create-new-dropdown'
import { useSearch } from '../../quick-task/hooks/use-search'
import { SearchResults } from './search-results'
import type { DropResult } from 'react-beautiful-dnd'
import { useListsStore } from '../../quick-task/state/lists'
import Image from 'next/image'
import { mockUser } from 'config'
import type { MockUser } from 'config'
import { useActiveItemColor } from '../helpers/randomize-color'
import { ListTodo } from 'lucide-react'

type NavItem = {
	id: string
	icon: React.ElementType
	label: string
	color?: string
	isHidden?: boolean
	href?: string
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

	const handleNewListCreated = (listId: string) => {
		onItemClick(listId)
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
						className={cn(
							"w-full rounded-md border bg-background px-9 py-2 text-sm",
							"transition-all duration-200",
							"border-input/10",
							"focus:outline-none focus:border-input/20 focus:ring-0"
						)}
					/>
				</div>
				<CreateNewDropdown onListCreated={handleNewListCreated} />
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
								<Droppable droppableId="sidebar-list" isDropDisabled={false}>
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
																	colorVariant="rainbow"
																	colorConfig={{
																		opacity: 100,
																		saturation: 70,
																		lightness: 50,
																		borderWidth: 4,
																		glow: true,
																		gradient: true
																	}}
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

						{lists.length > 0 && (
							<motion.div
								initial={{ opacity: 0, y: -20 }}
								animate={{ opacity: 1, y: 0 }}
								className="mt-6"
							>
								<h3 className="text-xs font-medium text-muted-foreground mb-2 px-3">
									MY LISTS
								</h3>
								<nav className="space-y-1">
									<AnimatePresence>
										{lists.map((list) => (
											<motion.div
												key={list.id}
												initial={{ opacity: 0, y: -10 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, y: -10 }}
											>
												<NavItemComponent
													item={{
														id: list.id,
														label: list.name,
														icon: ListTodo,
														href: `/lists/${list.id}`
													}}
													isActive={activeItem === list.id}
													onClick={() => onItemClick(list.id)}
													colorVariant="rainbow"
													colorConfig={{
														opacity: 100,
														saturation: 70,
														lightness: 50,
														borderWidth: 4,
														glow: true,
														gradient: true
													}}
												/>
											</motion.div>
										))}
									</AnimatePresence>
								</nav>
							</motion.div>
						)}
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
	onClick,
	colorVariant = 'random',
	colorConfig = {
		opacity: 100,
		saturation: 80,
		lightness: 60,
		borderWidth: 4,
		glow: true,
		gradient: true
	}
}: {
	item: NavItem
	isActive: boolean
	onClick: () => void
	colorVariant?: 'random' | 'rainbow' | 'monochrome'
	colorConfig?: {
		opacity?: number
		saturation?: number
		lightness?: number
		borderWidth?: 1 | 2 | 4 | 8
		glow?: boolean
		gradient?: boolean
	}
}) {
	const activeColor = useActiveItemColor(item.id, colorVariant, colorConfig)

	return (
		<div className="group relative">
			<button
				onClick={onClick}
				className={cn(
					"relative w-full text-left px-3 py-2 text-sm",
					"transition-all duration-200",
					"hover:bg-accent/10",
					"focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
					isActive && [
						"bg-accent/10",
						"before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1",
						"before:bg-gradient-to-b before:from-[hsl(var(--random-hue),80%,60%)] before:to-[hsl(calc(var(--random-hue)+30),80%,60%)]",
						"before:shadow-[0_0_10px_hsl(var(--random-hue),80%,60%)]",
						activeColor
					]
				)}
				style={isActive ? { '--random-hue': `${Math.random() * 360}` } as React.CSSProperties : undefined}
			>
				<span>{item.label}</span>
			</button>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 top-1/2 -translate-y-1/2"
					>
						<MoreVertical className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem>
						Edit list
					</DropdownMenuItem>
					<DropdownMenuItem>
						Share list
					</DropdownMenuItem>
					<DropdownMenuItem className="text-destructive">
						Delete list
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}
