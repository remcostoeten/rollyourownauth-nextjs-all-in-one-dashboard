import { Plus, ListIcon, X } from 'lucide-react'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	Button,
	Input,
	DropdownMenuShortcut,
	Kbd,
} from 'ui'
import { cn } from 'helpers'
import { useState, useRef, useEffect } from 'react'
import { useListsStore } from '../../quick-task/state/lists'
import { motion } from 'framer-motion'
import { useKeyboardShortcut } from '@/src/modules/quick-task'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'

const popoverAnimation = {
	initial: { opacity: 0, y: -8 },
	animate: { 
		opacity: 1, 
		y: 0,
		transition: {
			type: "spring",
			stiffness: 400,
			damping: 25
		}
	},
	exit: { 
		opacity: 0,
		y: -8,
		transition: {
			duration: 0.2,
			ease: [0.4, 0, 1, 1]
		}
	}
}

interface CreateNewDropdownProps {
	className?: string
	onListCreated?: (listId: string) => void
}

export function CreateNewDropdown({ className, onListCreated }: CreateNewDropdownProps) {
	const [isOpen, setIsOpen] = useState(false)
	const [newListName, setNewListName] = useState('')
	const inputRef = useRef<HTMLInputElement>(null)
	const { addList } = useListsStore()

	useKeyboardShortcut('shift+alt+n', () => {
		setIsOpen(true)
	})

	useEffect(() => {
		if (isOpen && inputRef.current) {
			inputRef.current.focus()
		}
	}, [isOpen])

	const handleCreateList = () => {
		if (newListName.trim()) {
			const newList = {
				id: crypto.randomUUID(),
				name: newListName.trim(),
				tasks: []
			}
			addList(newList)
			setNewListName('')
			setIsOpen(false)
			onListCreated?.(newList.id)
		}
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleCreateList()
		} else if (e.key === 'Escape') {
			setIsOpen(false)
			setNewListName('')
		}
	}

	return (
		<DropdownMenu 
			open={isOpen} 
			onOpenChange={(open) => {
				setIsOpen(open)
				if (!open) {
					setNewListName('')
				}
			}}
		>
			<DropdownMenuTrigger asChild>
				<Button
					className={cn(
						'w-full flex items-center justify-between px-4 py-2 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors',
						'focus:ring-0 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent/20',
						className
					)}
				>
					<div className="flex items-center gap-2">
						<div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center">
							<Plus className="w-4 h-4 text-accent-foreground" />
						</div>
						<span className="text-sm">Create new</span>
					</div>
					<kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
						<span className="text-xs">⇧</span>
						<span className="text-xs">⌥</span>
						<span className="text-xs">N</span>
					</kbd>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent 
				align="start" 
				sideOffset={5} 
				className="w-[220px] p-2"
				onInteractOutside={() => {
					setIsOpen(false)
					setNewListName('')
				}}
			>
				<motion.div
					initial="initial"
					animate="animate"
					exit="exit"
					variants={popoverAnimation}
					className="space-y-2"
				>
					<div className="relative group">
						<Input
							ref={inputRef}
							value={newListName}
							onChange={(e) => setNewListName(e.target.value)}
							onKeyDown={handleKeyDown}
							placeholder="List name..."
							className={cn(
								'w-full bg-transparent',
								'transition-all duration-200',
								'border-input/10',
								'focus:outline-none focus:border-input/20 focus:ring-0'
							)}
						/>
						{newListName && (
							<Button
								size="icon"
								variant="ghost"
								className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
								onClick={() => setNewListName('')}
							>
								<span className="sr-only">Clear input</span>
								<X className="h-3 w-3" />
							</Button>
						)}
					</div>
					<div className="flex justify-between items-center text-xs text-muted-foreground/60">
						<div className="flex items-center gap-1.5">
							<Kbd>enter</Kbd>
							<span>to create</span>
						</div>
						<div className="flex items-center gap-1.5">
							<Kbd>esc</Kbd>
							<span>to cancel</span>
						</div>
					</div>
				</motion.div>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
