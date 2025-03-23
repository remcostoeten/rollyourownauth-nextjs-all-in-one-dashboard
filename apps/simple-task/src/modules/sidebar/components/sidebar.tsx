'use client'

import type React from 'react'
import { useState, useRef, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Search, Pin, PinOff, ListPlus } from 'lucide-react'
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
import { useListsStore, type List } from '../../quick-task/state/lists'
import Image from 'next/image'
import { mockUser } from 'config'
import { EmptyState } from '@/shared/components/common'

type NavItem = {
	id: string
	icon: React.ElementType
	label: string
	color?: string
	isHidden?: boolean
}

type Category = {
	id: string
	title: string
	items: NavItem[]
}

const initialCategories: Category[] = [
	{
		id: 'quick-access',
		title: 'QUICK ACCESS',
		items: [
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
			}
		]
	},
	{
		id: 'recent-lists',
		title: 'RECENT LISTS',
		items: []
	}
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
				'relative flex items-center gap-3 w-full rounded-full px-3 py-1.5 text-sm transition-all duration-200 overflow-hidden',
				isActive
					? 'text-foreground bg-primary/10'
					: 'text-muted-foreground hover:text-foreground hover:bg-primary/5'
			)}
			style={{ color: item.color }}
			onClick={onClick}
			onMouseMove={handleMouseMove}
			onHoverStart={() => setHovering(true)}
			onHoverEnd={() => setHovering(false)}
		>
			<item.icon className="w-4 h-4" />
			<span>{item.label}</span>
			{hovering && (
				<motion.div
					className="absolute inset-0 rounded-full pointer-events-none"
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
	const [categories, setCategories] = useState<Category[]>(initialCategories)
	const [searchQuery, setSearchQuery] = useState('')
	const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
	const [editingTitle, setEditingTitle] = useState('')
	const editingInputRef = useRef<HTMLInputElement>(null)
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

	useEffect(() => {
		if (editingCategoryId && editingInputRef.current) {
			editingInputRef.current.focus()
		}
	}, [editingCategoryId])

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, categoryId: string) => {
		if (e.key === 'Enter') {
			handleSaveCategory(categoryId)
		} else if (e.key === 'Escape') {
			handleCancelEdit(categoryId)
		}
	}

	const handleSaveCategory = (categoryId: string) => {
		if (!editingTitle.trim()) {
			handleCancelEdit(categoryId)
			return
		}

		setCategories(categories.map(cat =>
			cat.id === categoryId
				? { ...cat, title: editingTitle.trim() }
				: cat
		))
		setEditingCategoryId(null)
		setEditingTitle('')
	}

	const handleCancelEdit = (categoryId: string) => {
		setEditingCategoryId(null)
		setEditingTitle('')
	}

	const onDragEnd = (result: DropResult) => {
		if (!result.destination) return

		const { source, destination } = result
		const sourceCategory = categories.find(cat => cat.id === source.droppableId)
		const destCategory = categories.find(cat => cat.id === destination.droppableId)

		if (!sourceCategory) return

		const items = Array.from(sourceCategory.items)
		const reorderedItem = items[source.index]
		if (!reorderedItem) return

		items.splice(source.index, 1)

		if (source.droppableId === destination.droppableId) {
			items.splice(destination.index, 0, reorderedItem)
			setCategories(categories.map(cat => 
				cat.id === sourceCategory.id 
					? { ...cat, items } 
					: cat
			))
		} else if (destCategory) {
			const destItems = Array.from(destCategory.items)
			destItems.splice(destination.index, 0, reorderedItem)
			setCategories(categories.map(cat => {
				if (cat.id === sourceCategory.id) {
					return { ...cat, items }
				}
				if (cat.id === destCategory.id) {
					return { ...cat, items: destItems }
				}
				return cat
			}))
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

	const addNewCategory = () => {
		const newCategory: Category = {
			id: `category-${Date.now()}`,
			title: '',
			items: []
		}
		setCategories([...categories, newCategory])
		setEditingCategoryId(newCategory.id)
		setEditingTitle('')
	}

	return (
		<div
			className={cn(
				'w-64 flex flex-col h-screen bg-background/80 backdrop-blur-xl transition-all duration-300 ease-in-out border-r border-border/40',
				'absolute top-0 left-0 origin-left shadow-lg',
				isVisible
					? 'translate-x-0 opacity-100'
					: '-translate-x-full opacity-0'
			)}
		>
			<div className="p-4 border-b border-border/40">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
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
										'h-8 w-8 rounded-full',
										isLocked
											? 'text-primary bg-primary/10'
											: 'text-muted-foreground hover:text-primary hover:bg-primary/5'
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
						className="w-full bg-background/50 border border-border/40 rounded-full pl-9 pr-4 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors"
					/>
				</div>
			</div>

			{searchQuery.trim() && (
				<div className="flex-1 overflow-auto">
					<SearchResults
						results={searchResults}
						query={searchQuery}
						onSelect={handleSearchSelect}
					/>
				</div>
			)}

			{!searchQuery.trim() && (
				<div className="flex-1 overflow-auto py-4">
					<DragDropContext onDragEnd={onDragEnd}>
						{categories.map((category) => (
							<div key={category.id} className="px-3 mb-4">
								<div className="flex items-center justify-between mb-2 px-3">
									{editingCategoryId === category.id ? (
										<motion.div
											initial={{ opacity: 0, y: -10 }}
											animate={{ opacity: 1, y: 0 }}
											className="flex-1"
										>
											<input
												ref={editingInputRef}
												type="text"
												value={editingTitle}
												onChange={(e) => setEditingTitle(e.target.value)}
												onKeyDown={(e) => handleKeyDown(e, category.id)}
												className="w-full text-xs font-medium bg-transparent border-none p-0 focus:outline-none focus:ring-0 text-primary placeholder:text-muted-foreground/30"
												placeholder="Type category name..."
											/>
										</motion.div>
									) : (
										<h3 className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">
											{category.title}
										</h3>
									)}
									{category.id === 'recent-lists' && (
										<Button
											variant="ghost"
											size="sm"
											className="h-6 px-2 text-xs rounded-full hover:bg-primary/5 hover:text-primary"
											onClick={addNewCategory}
										>
											Add Category
										</Button>
									)}
								</div>
								<nav className="space-y-1">
									<Droppable droppableId={category.id}>
										{(provided) => (
											<div
												{...provided.droppableProps}
												ref={provided.innerRef}
												className="space-y-1"
											>
												{category.id === 'recent-lists' ? (
													lists.length === 0 ? (
														<div className="px-3 py-2">
															<EmptyState
																title="No lists yet"
																description="Create your first list to organize your tasks"
																icons={[ListPlus]}
																action={{
																	label: 'Create List',
																	onClick: () => {
																		const input = document.getElementById('new-list-input')
																		if (input) {
																			input.focus()
																		}
																	}
																}}
																className="!p-4"
															/>
														</div>
													) : (
														lists.slice(0, 3).map((list: List, index) => (
															<Draggable
																key={list.id}
																draggableId={list.id}
																index={index}
															>
																{(provided) => (
																	<div
																		ref={provided.innerRef}
																		{...provided.draggableProps}
																		{...provided.dragHandleProps}
																	>
																		<button
																			onClick={() => onItemClick(list.id)}
																			className={cn(
																				'flex items-center w-full rounded-full px-3 py-1.5 text-sm transition-all duration-200 group relative overflow-hidden',
																				list.id === activeItem
																					? 'text-foreground bg-primary/10'
																					: 'text-muted-foreground hover:text-foreground hover:bg-primary/5'
																			)}
																		>
																			<ListsIcon className="w-4 h-4 mr-3" />
																			<span className="truncate">
																				{list.name}
																			</span>
																		</button>
																	</div>
																)}
															</Draggable>
														))
													)
												) : (
													<motion.div
														initial={{ opacity: 0, height: 0 }}
														animate={{ opacity: 1, height: 'auto' }}
														exit={{ opacity: 0, height: 0 }}
														transition={{ duration: 0.2 }}
													>
														{category.items.length === 0 ? (
															<div className="px-3 py-2">
																<EmptyState
																	title="No items"
																	description="Drag items here or create new ones"
																	icons={[ListPlus]}
																	action={{
																		label: 'Add Item',
																		onClick: () => {
																			// TODO: Implement add item functionality
																		}
																	}}
																	className="!p-4"
																/>
															</div>
														) : (
															category.items.map((item, index) => (
																<Draggable
																	key={item.id}
																	draggableId={item.id}
																	index={index}
																>
																	{(provided) => (
																		<div
																			ref={provided.innerRef}
																			{...provided.draggableProps}
																			{...provided.dragHandleProps}
																		>
																			<NavItemComponent
																				item={item}
																				isActive={item.id === activeItem}
																				onClick={() => onItemClick(item.id)}
																			/>
																		</div>
																	)}
																</Draggable>
															))
														)}
													</motion.div>
												)}
												{provided.placeholder}
											</div>
										)}
									</Droppable>
								</nav>
							</div>
						))}
					</DragDropContext>
				</div>
			)}

			<div className="border-t border-border/40 p-4 space-y-3">
				<div className="flex items-center gap-3 p-2 rounded-xl bg-secondary/20 backdrop-blur-sm">
					<Image
						width={32}
						height={32}
						src={user?.profile.avatar || '/placeholder.svg'}
						className="w-8 h-8 object-cover rounded-full ring-1 ring-border/40"
						alt={user?.profile.firstName}
					/>
					<div className="flex-1 min-w-0">
						<p className="text-sm font-medium text-foreground truncate">
							{user?.profile.lastName}
						</p>
						<p className="text-xs text-muted-foreground/70 truncate">
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
