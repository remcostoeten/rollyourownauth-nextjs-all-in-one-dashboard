import { Command } from 'cmdk'
import { motion, AnimatePresence } from 'framer-motion'
import { Chrome, ChromeIcon as Firefox } from 'lucide-react'

interface CommandPaletteProps {
	open: boolean
	onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
	return (
		<AnimatePresence>
			{open && (
				<>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black/50"
						onClick={() => onOpenChange(false)}
					/>
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
						className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl"
					>
						<Command className="rounded-xl border border-gray-800 bg-[#1e1f2a] text-gray-100 shadow-2xl">
							<Command.Input
								placeholder="Type to search apps, or type ? for more options..."
								className="w-full px-4 py-3 text-sm bg-transparent border-b border-gray-800 focus:outline-none"
							/>
							<Command.List className="p-2 max-h-96 overflow-auto">
								<Command.Group heading="Browsers">
									<Command.Item className="flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-gray-800">
										<Chrome className="w-4 h-4" />
										<span>Google Chrome</span>
										<kbd className="ml-auto text-xs text-gray-400">
											⌘+2
										</kbd>
									</Command.Item>
									<Command.Item className="flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-gray-800">
										<Firefox className="w-4 h-4" />
										<span>Mozilla Firefox</span>
										<kbd className="ml-auto text-xs text-gray-400">
											⌘+3
										</kbd>
									</Command.Item>
								</Command.Group>
							</Command.List>
						</Command>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	)
}
