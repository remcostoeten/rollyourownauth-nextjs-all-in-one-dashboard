'use client'

import type React from 'react'
import { useState, useRef, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Search, Pin, PinOff, MoreVertical, Plus, FolderPlus } from 'lucide-react'
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
import { UserMenu } from './user-menu'
import { useKeyboardShortcuts } from '../hooks/use-keyboard-shortcuts'

type NavItem = {
	id: string
	label: string
	icon?: React.ElementType
	emoji?: string
	color?: string
	isHidden?: boolean
	href?: string
	isCategory?: boolean
	categoryId?: string
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
	className?: string
}

export function Sidebar({
	isVisible,
	isLocked,
	onToggleLock,
	activeItem,
	onItemClick,
	className
}: SidebarProps) {
	const [mounted, setMounted] = useState(false)
	const [navItems, setNavItems] = useState(initialNavItems)
	const [searchQuery, setSearchQuery] = useState('')
	const searchResults = useSearch(searchQuery)
	const { lists, categories, addCategory } = useListsStore()
	const user = mockUser as MockUser

	useKeyboardShortcuts(() => {
		if (!isLocked) {
			onToggleLock()
		}
	})

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

	const handleCreateCategory = () => {
		addCategory({
			id: crypto.randomUUID(),
			name: 'New Category',
			emoji: '📁'
		})
	}

	if (!mounted) {
		return null
	}

	return (
		<aside
			className={cn(
				'fixed inset-y-0 left-0 z-20 flex h-full w-64 flex-col border-r border-[#1C1C1C] bg-[#0A0A0A] transition-transform duration-300 ease-in-out',
				!isVisible && '-translate-x-full',
				className
			)}
		>
			<div className="flex flex-col flex-1 overflow-y-auto">
				<div className="p-2">
					<CreateNewDropdown />
				</div>
				<div className="relative p-2">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<input
						type="text"
						placeholder="Search..."
						className="w-full rounded-md border border-[#1C1C1C] bg-[#0A0A0A] py-2 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none"
					/>
				</div>
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
								<div className="flex items-center justify-between mb-2 px-3">
									<h3 className="text-xs font-medium text-muted-foreground">
										MY LISTS
									</h3>
									<Button
										variant="ghost"
										size="icon"
										className="h-5 w-5 text-muted-foreground hover:text-gray-300"
										onClick={handleCreateCategory}
									>
										<FolderPlus className="h-4 w-4" />
									</Button>
								</div>
								<nav className="space-y-4">
									{/* Uncategorized Lists */}
									<div className="space-y-1">
										<AnimatePresence>
											{lists
												.filter(list => !list.categoryId)
												.map((list) => (
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
																emoji: list.emoji,
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
									</div>

									{/* Categories */}
									<AnimatePresence>
										{categories.map((category) => (
											<motion.div
												key={category.id}
												initial={{ opacity: 0, y: -10 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, y: -10 }}
												className="space-y-1"
											>
												<NavItemComponent
													item={{
														id: category.id,
														label: category.name,
														emoji: category.emoji,
														isCategory: true
													}}
													isActive={false}
													onClick={() => {}}
													colorVariant="monochrome"
													colorConfig={{
														opacity: 70,
														saturation: 0,
														lightness: 50,
														borderWidth: 2,
														glow: false,
														gradient: false
													}}
												/>
												<div className="pl-4 space-y-1">
													<AnimatePresence>
														{lists
															.filter(list => list.categoryId === category.id)
															.map((list) => (
																<motion.div
																	key={list.id}
																	initial={{ opacity: 0, x: -10 }}
																	animate={{ opacity: 1, x: 0 }}
																	exit={{ opacity: 0, x: -10 }}
																>
																	<NavItemComponent
																		item={{
																			id: list.id,
																			label: list.name,
																			emoji: list.emoji,
																			href: `/lists/${list.id}`,
																			categoryId: category.id
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
												</div>
											</motion.div>
										))}
									</AnimatePresence>
								</nav>
							</motion.div>
						)}
					</div>
				</div>
			)}

			<div className="mt-auto p-2">
				<UserMenu />
			</div>
		</aside>
	)
}

type ColorConfig = {
	opacity?: number
	saturation?: number
	lightness?: number
	borderWidth?: 1 | 2 | 4 | 8
	glow?: boolean
	gradient?: boolean
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
		borderWidth: 4 as 1 | 2 | 4 | 8,
		glow: true,
		gradient: true
	}
}: {
	item: NavItem
	isActive: boolean
	onClick: () => void
	colorVariant?: 'random' | 'rainbow' | 'monochrome'
	colorConfig?: ColorConfig
}) {
	const activeColor = useActiveItemColor(item.id, colorVariant, colorConfig)
	const { updateList, removeList, updateCategory, removeCategory } = useListsStore()
	const [isEditing, setIsEditing] = useState(false)
	const [editedName, setEditedName] = useState(item.label)
	const inputRef = useRef<HTMLInputElement>(null)

	const handleEdit = () => {
		if (!item.href && !item.isCategory) return // Only edit custom lists and categories
		setIsEditing(true)
		setEditedName(item.label)
	}

	const handleSave = () => {
		if (!editedName.trim()) return
		if (item.isCategory) {
			updateCategory(item.id, { name: editedName.trim() })
		} else if (item.href) {
			updateList(item.id, { name: editedName.trim() })
		}
		setIsEditing(false)
	}

	const handleDelete = () => {
		if (item.isCategory) {
			removeCategory(item.id)
		} else if (item.href) {
			removeList(item.id)
		}
	}

	const handleDoubleClick = (e: React.MouseEvent) => {
		if (!item.href && !item.isCategory) return // Only edit custom lists and categories
		e.preventDefault()
		e.stopPropagation()
		handleEdit()
	}

	// Focus input when editing starts
	useEffect(() => {
		if (isEditing && inputRef.current) {
			inputRef.current.focus()
		}
	}, [isEditing])

	return (
		<div className="group relative">
			<button
				onClick={onClick}
				onDoubleClick={handleDoubleClick}
				className={cn(
					"relative w-full text-left px-3 py-2 text-sm",
					"transition-all duration-200",
					"hover:bg-[#1C1C1C]",
					"focus:outline-none",
					isActive && !item.isCategory && [
						"bg-[#1C1C1C]",
						"before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-3/5 before:w-0.5",
						"before:bg-blue-500",
						"before:rounded-full",
					],
					item.isCategory && "font-medium"
				)}
			>
				<div className="flex items-center gap-2">
					{item.icon ? (
						<item.icon className="w-4 h-4 text-gray-400" />
					) : (
						<span className="text-base select-none">{item.emoji || '📝'}</span>
					)}
					{isEditing ? (
						<input
							ref={inputRef}
							type="text"
							value={editedName}
							onChange={(e) => setEditedName(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									handleSave()
								} else if (e.key === 'Escape') {
									setIsEditing(false)
									setEditedName(item.label)
								}
								e.stopPropagation() // Prevent button's keydown from firing
							}}
							onClick={(e) => e.stopPropagation()} // Prevent button's click from firing
							onDoubleClick={(e) => e.stopPropagation()} // Prevent button's double click from firing
							onBlur={handleSave}
							className={cn(
								"flex-1 bg-transparent text-sm",
								"focus:outline-none focus:ring-1 focus:ring-blue-500/20 rounded px-1 -mx-1",
								"placeholder:text-gray-500",
								item.isCategory ? "text-gray-300" : "text-gray-200"
							)}
							placeholder={item.isCategory ? "Enter category name..." : "Enter list name..."}
							autoFocus
						/>
					) : (
						<span className={cn(
							"flex-1 transition-colors duration-200 select-none",
							item.isCategory 
								? "text-gray-400 group-hover:text-gray-300" 
								: isActive 
									? "text-gray-200" 
									: "text-gray-400 group-hover:text-gray-300"
						)}>
							{item.label}
						</span>
					)}
				</div>
			</button>

			{(item.href || item.isCategory) && (
				<div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="h-6 w-6 hover:bg-[#2C2C2C]"
							>
								<MoreVertical className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className="z-50 min-w-[8rem] overflow-hidden rounded-md border border-[#2C2C2C] bg-[#1C1C1C] p-1"
							align="end"
						>
							<DropdownMenuItem
								className="flex cursor-pointer items-center px-2 py-1.5 text-sm text-gray-300 hover:bg-[#2C2C2C] hover:text-gray-100"
								onClick={(e) => {
									e.stopPropagation()
									handleEdit()
								}}
							>
								Edit {item.isCategory ? 'category' : 'list'}
							</DropdownMenuItem>
							<DropdownMenuItem
								className="flex cursor-pointer items-center px-2 py-1.5 text-sm text-red-400 hover:bg-[#2C2C2C] hover:text-red-300"
								onClick={(e) => {
									e.stopPropagation()
									handleDelete()
								}}
							>
								Delete {item.isCategory ? 'category' : 'list'}
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			)}
		</div>
	)
}
