	'use client'

import type React from 'react'
import { useState, useRef, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Search, Pin, PinOff, PencilIcon, TrashIcon } from 'lucide-react'
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
import { mockUser } from 'config'
import type { NavItem, NavItemProps, SidebarProps } from '../types'
import { Kbd } from 'ui'
import type { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd'
import Image from 'next/image'

const initialNavItems: NavItem[] = [
	{ id: 'inbox', icon: InboxIcon, label: 'Inbox' },
	{ id: 'today', icon: TodayIcon, label: 'Today' },
	{ id: 'tasks', icon: TasksIcon, label: 'Tasks' },
	{ id: 'updates', icon: UpdatesIcon, label: 'Updates' },
	{ id: 'lists', icon: ListsIcon, label: 'Lists' }
]

interface NavItemComponentProps extends NavItemProps {
	dragHandleProps?: DraggableProvidedDragHandleProps;
}

const NavItemComponent = ({ 
	item, 
	isActive, 
	onClick, 
	onEdit, 
	onDelete,
	dragHandleProps 
}: NavItemComponentProps) => {
	const [hovering, setHovering] = useState(false)
	const [isEditing, setIsEditing] = useState(false)
	const [editValue, setEditValue] = useState(item.label)
	const buttonRef = useRef<HTMLDivElement>(null)
	const inputRef = useRef<HTMLInputElement>(null)
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
	const [isDeleting, setIsDeleting] = useState(false)

	const handleMouseMove = (e: React.MouseEvent) => {
		if (buttonRef.current) {
			const rect = buttonRef.current.getBoundingClientRect()
			setMousePosition({
				x: e.clientX - rect.left,
				y: e.clientY - rect.top
			})
		}
	}

	const handleEditClick = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation()
		setIsEditing(true)
		setTimeout(() => inputRef.current?.focus(), 0)
	}

	const handleEditSubmit = () => {
		if (editValue.trim() !== item.label) {
			onEdit({ ...item, label: editValue.trim() })
		}
		setIsEditing(false)
	}

	const handleDeleteClick = async (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation()
		setIsDeleting(true)
		await new Promise(resolve => setTimeout(resolve, 300))
		onDelete(item.id)
	}

	const handleKeyboardEdit = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault()
			setIsEditing(true)
			setTimeout(() => inputRef.current?.focus(), 0)
		}
	}

	const handleKeyboardDelete = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault()
			setIsDeleting(true)
			setTimeout(async () => {
				await new Promise(resolve => setTimeout(resolve, 300))
				onDelete(item.id)
			}, 0)
		}
	}

	return (
		<motion.div
			className="group relative"
			onHoverStart={() => setHovering(true)}
			onHoverEnd={() => setHovering(false)}
			initial={{ opacity: 1, height: "auto" }}
			animate={{ 
				opacity: isDeleting ? 0 : 1,
				height: isDeleting ? 0 : "auto",
				scale: isDeleting ? 0.8 : 1
			}}
			transition={{ duration: 0.3 }}
		>
			<div
				role="button"
				tabIndex={0}
				ref={buttonRef}
				{...dragHandleProps}
				className={cn(
					'relative flex items-center w-full rounded-sm px-3 py-1.5 text-sm transition-colors overflow-hidden cursor-pointer',
					isActive
						? 'text-foreground bg-primary/5'
						: 'text-muted-foreground hover:text-foreground'
				)}
				style={{ color: item.color }}
				onClick={onClick}
				onMouseMove={handleMouseMove}
				onKeyDown={handleKeyboardEdit}
			>
				<div className="flex items-center gap-3 flex-1">
					<item.icon />
					{isEditing ? (
						<div className="flex-1 flex items-center gap-2">
							<input
								ref={inputRef}
								type="text"
								value={editValue}
								onChange={(e) => setEditValue(e.target.value)}
								onBlur={handleEditSubmit}
								onKeyDown={(e) => {
									if (e.key === 'Enter') handleEditSubmit()
									if (e.key === 'Escape') {
										setEditValue(item.label)
										setIsEditing(false)
										inputRef.current?.blur()
									}
								}}
								onClick={(e) => e.stopPropagation()}
								className={cn(
									"bg-transparent border-none outline-none focus:ring-0 focus:outline-none rounded px-1 w-full",
									"text-foreground placeholder:text-muted-foreground",
									!isEditing && "cursor-default caret-transparent"
								)}
							/>
							<Kbd>enter ↵</Kbd>
						</div>
					) : (
						<span className="cursor-default">{item.label}</span>
					)}
				</div>
				
				{/* Action buttons - absolutely positioned */}
				<div 
					className={cn(
						"absolute right-2 flex items-center gap-1 transition-opacity duration-200",
						hovering && !isEditing ? "opacity-100" : "opacity-0 pointer-events-none"
					)}
				>
					<div
						role="button"
						tabIndex={0}
						className="h-6 w-6 flex items-center justify-center rounded-sm hover:bg-primary/10 transition-colors cursor-pointer"
						onClick={handleEditClick}
						onKeyDown={handleKeyboardEdit}
					>
						<PencilIcon className="h-3 w-3" />
					</div>
					<div
						role="button"
						tabIndex={0}
						className="h-6 w-6 flex items-center justify-center rounded-sm hover:bg-primary/10 transition-colors cursor-pointer"
						onClick={handleDeleteClick}
						onKeyDown={handleKeyboardDelete}
					>
						<TrashIcon className="h-3 w-3" />
					</div>
				</div>

				{/* Hover effect - absolutely positioned */}
				{hovering && !isEditing && (
					<div
						className={cn(
							"absolute inset-0 rounded-sm pointer-events-none transition-opacity duration-300 ease-in-out",
							hovering && !isEditing ? "opacity-5" : "opacity-0"
						)}
						style={{
							background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, var(--primary) 0%, transparent 100%)`
						}}
					/>
				)}
			</div>
		</motion.div>
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
		const [removed] = items.splice(result.source.index, 1)
		items.splice(result.destination.index, 0, removed)

		setNavItems(items)
	}

	return (
		<div className="flex flex-col gap-2">
			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable droppableId="navItems">
					{(provided) => (
						<div
							ref={provided.innerRef}
							{...provided.droppableProps}
							className="flex flex-col gap-2"
						
							>
							{navItems.map((item, index) => (
								<Draggable key={item.id} draggableId={item.id} index={index}>	
								</Draggable>
								))}
								{provided.placeholder}
						</div>
					)}
				</Droppable>
			</DragDropContext>
		</div>
	)
}