"use client"

import React, { useState, useRef, FormEvent, useEffect } from "react"
import { Plus } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"
import { motion, AnimatePresence } from "framer-motion"

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
	const inputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		if (isOpen && inputRef.current) {
			inputRef.current.focus()
		}
	}, [isOpen])

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && showEmojiPicker) {
				e.preventDefault()
				setShowEmojiPicker(false)
				return
			}

			if ((e.metaKey || e.ctrlKey) && e.key === "n") {
				e.preventDefault()
				setIsOpen(true)
			}
		}

		window.addEventListener("keydown", handleKeyDown)
		return () => window.removeEventListener("keydown", handleKeyDown)
	}, [isOpen, showEmojiPicker])

	const handleCreateList = async (e: FormEvent) => {
		e.preventDefault()
		if (!newListName.trim()) return

		try {
			const response = await fetch("/api/lists", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: newListName,
					emoji: selectedEmoji
				}),
			})

			if (!response.ok) throw new Error("Failed to create list")

			setNewListName("")
			setSelectedEmoji("📝")
			setIsOpen(false)
		} catch (error) {
			console.error("Error creating list:", error)
		}
	}

	return (
		<DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
			<DropdownMenuTrigger asChild>
				<button 
					className={cn(
						"group w-full text-left px-3 py-1.5 text-sm bg-transparent rounded-sm",
						"hover:bg-[#1C1C1C] focus:bg-[#1C1C1C]",
						"transition-colors duration-150",
						"focus:outline-none",
						className
					)}
				>
					<span className="flex items-center gap-2 text-gray-400 group-hover:text-gray-300">
						<Plus className="w-3.5 h-3.5" />
						Create New...
						<kbd className="ml-auto text-[10px] font-mono opacity-50">⌘N</kbd>
					</span>
				</button>
			</DropdownMenuTrigger>
			<AnimatePresence>
				{isOpen && (
					<DropdownMenuContent 
						asChild
						forceMount
						sideOffset={4}
						className="z-50"
					>
						<motion.div
							className="w-[280px] p-2 bg-[#0A0A0A]/95 backdrop-blur-sm border border-[#1C1C1C] rounded-md shadow-2xl"
							{...dropdownAnimation}
						>
							<form onSubmit={handleCreateList} className="space-y-2">
								<div className="flex items-center gap-2">
									<button
										type="button"
										className={cn(
											"p-1.5 text-base bg-transparent rounded-md",
											"hover:bg-[#1C1C1C] transition-colors duration-150",
											"focus:outline-none"
										)}
										onClick={() => setShowEmojiPicker(!showEmojiPicker)}
									>
										{selectedEmoji}
										<AnimatePresence>
											{showEmojiPicker && (
												<motion.div
													initial={{ opacity: 0, y: -4 }}
													animate={{ opacity: 1, y: 0 }}
													exit={{ opacity: 0, y: -4 }}
													transition={{ duration: 0.15 }}
													className="fixed left-0 top-full z-[60] mt-1"
												>
													<Picker
														data={data}
														onEmojiSelect={(emoji: any) => {
															setSelectedEmoji(emoji.native)
															setShowEmojiPicker(false)
														}}
														theme="dark"
													/>
												</motion.div>
											)}
										</AnimatePresence>
									</button>
									<input
										ref={inputRef}
										type="text"
										placeholder="Enter list name..."
										value={newListName}
										onChange={(e) => setNewListName(e.target.value)}
										className={cn(
											"flex-1 bg-transparent text-sm text-white placeholder-gray-500",
											"rounded-md px-2 py-1.5",
											"focus:outline-none",
											"transition-colors duration-150"
										)}
									/>
									<button
										type="submit"
										disabled={!newListName.trim()}
										className={cn(
											"px-3 py-1.5 text-sm rounded-md",
											"bg-[#1C1C1C] hover:bg-[#2A2A2A] text-white",
											"transition-colors duration-150",
											"focus:outline-none",
											"disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#1C1C1C]"
										)}
									>
										Create
									</button>
								</div>
							</form>
						</motion.div>
					</DropdownMenuContent>
				)}
			</AnimatePresence>
		</DropdownMenu>
	)
}
