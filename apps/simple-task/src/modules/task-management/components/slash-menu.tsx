import type React from 'react'

export interface SlashMenuItem {
	id: string
	title: string
	icon: React.ReactNode
	description: string
}

interface SlashMenuProps {
	items: SlashMenuItem[]
	onSelect: (item: SlashMenuItem) => void
}

export function SlashMenu({ items, onSelect }: SlashMenuProps) {
	return (
		<div className="bg-popover border rounded-lg shadow-lg overflow-hidden">
			<div className="p-2">
				{items.map((item) => (
					<button
						key={item.id}
						onClick={() => onSelect(item)}
						className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
					>
						{item.icon}
						<div className="flex flex-col items-start">
							<span className="font-medium">{item.title}</span>
							<span className="text-xs text-muted-foreground">
								{item.description}
							</span>
						</div>
					</button>
				))}
			</div>
		</div>
	)
}
