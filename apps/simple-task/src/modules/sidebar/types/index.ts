export interface NavItem {
	id: string
	icon: React.ElementType
	label: string
	color?: string
	isHidden?: boolean
}

export interface SidebarProps {
	isVisible: boolean
	isLocked: boolean
	onToggleLock: () => void
	activeItem: string
	onItemClick: (id: string) => void
}

export interface NavItemProps {
	item: NavItem
	isActive: boolean
	onClick: () => void
	onEdit: (updatedItem: NavItem) => void
	onDelete: (id: string) => void
}
