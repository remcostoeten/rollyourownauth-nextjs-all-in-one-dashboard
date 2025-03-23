"use client"

import React, { useState, useRef, FormEvent, useEffect } from "react"
import { Plus, Pencil, Trash2, Check, X, FolderPlus, ListTodo } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@radix-ui/react-dropdown-menu"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"
import { motion, AnimatePresence } from "framer-motion"
import { useListsStore, List } from "@/src/modules/quick-task/state/lists"
import { Button } from "@/components/ui/button"

function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

interface CreateNewDropdownProps {
	className?: string
}

const dropdownAnimation = {
	initial: { opacity: 0, y: -4 },
	animate: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.15, ease: "easeOut" }
	},
	exit: {
		opacity: 0,
		y: -4,
		transition: { duration: 0.1, ease: "easeIn" }
	}
}

export function CreateNewDropdown({ className }: CreateNewDropdownProps) {
	const [newListName, setNewListName] = useState("")
	const [selectedEmoji, setSelectedEmoji] = useState("📝")
	const [showEmojiPicker, setShowEmojiPicker] = useState(false)
	const [isOpen, setIsOpen] = useState(false)
	const [editingList, setEditingList] = useState<List | null>(null)
	const [editedName, setEditedName] = useState("")
	const inputRef = useRef<HTMLInputElement>(null)
	
	const { lists, addList, removeList, updateList, addCategory } = useListsStore()

	useEffect(() => {
		if (isOpen && inputRef.current && !editingList) {
			inputRef.current.focus()
		}
	}, [isOpen, editingList])

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				if (showEmojiPicker) {
					e.preventDefault()
					setShowEmojiPicker(false)
					return
				}
				if (editingList) {
					e.preventDefault()
					setEditingList(null)
					return
				}
			}

			if ((e.metaKey || e.ctrlKey) && e.key === "n") {
				e.preventDefault()
				setIsOpen(true)
			}
		}

		window.addEventListener("keydown", handleKeyDown)
		return () => window.removeEventListener("keydown", handleKeyDown)
	}, [isOpen, showEmojiPicker, editingList])

	const handleCreateList = async (e: FormEvent) => {
		e.preventDefault()
		if (!newListName.trim()) return

		try {
			const newList: List = {
				id: crypto.randomUUID(),
				name: newListName.trim(),
				emoji: selectedEmoji,
				tasks: []
			}
			
			addList(newList)
			setNewListName("")
			setSelectedEmoji("📝")
			setIsOpen(false)
		} catch (error) {
			console.error("Error creating list:", error)
		}
	}

	const handleUpdateList = async (list: List) => {
		if (!editedName.trim() || editedName === list.name) {
			setEditingList(null)
			return
		}

		try {
			updateList(list.id, { name: editedName })
			setEditingList(null)
		} catch (error) {
			console.error("Error updating list:", error)
		}
	}

	const handleDeleteList = async (id: string) => {
		try {
			removeList(id)
		} catch (error) {
			console.error("Error deleting list:", error)
		}
	}

	const handleCreateCategory = () => {
		addCategory({
			id: crypto.randomUUID(),
			name: 'New Category',
			emoji: '📁'
		})
	}

	return (
		<DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					className="w-full justify-start gap-2 border-[#2C2C2C] bg-[#1C1C1C] hover:bg-[#2C2C2C] hover:text-gray-100"
				>
					<Plus className="h-4 w-4" />
					Create New
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="z-50 min-w-[8rem] overflow-hidden rounded-md border border-[#2C2C2C] bg-[#1C1C1C] p-1"
				align="start"
			>
				<DropdownMenuItem
					className="flex cursor-pointer items-center gap-2 px-2 py-1.5 text-sm text-gray-300 hover:bg-[#2C2C2C] hover:text-gray-100"
					onClick={() => handleCreateList()}
				>
					<ListTodo className="h-4 w-4" />
					New List in Quick Access
				</DropdownMenuItem>
				<DropdownMenuItem
					className="flex cursor-pointer items-center gap-2 px-2 py-1.5 text-sm text-gray-300 hover:bg-[#2C2C2C] hover:text-gray-100"
					onClick={handleCreateCategory}
				>
					<FolderPlus className="h-4 w-4" />
					New Category
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
