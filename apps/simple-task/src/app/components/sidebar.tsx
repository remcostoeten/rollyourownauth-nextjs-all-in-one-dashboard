import { Calendar, Inbox, List, Star, Clock } from 'lucide-react'
import { cn } from '@/shared/helpers/cn'

const navItems = [
	{ icon: Inbox, label: 'Inbox', active: true },
	{ icon: Calendar, label: 'Today' },
	{ icon: List, label: 'Tasks' },
	{ icon: Clock, label: 'Updates' },
	{ icon: Star, label: 'Lists' }
]

export function Sidebar() {
	return (
		<div className="w-48 border-r border-gray-800 p-4 flex flex-col">
			<div className="space-y-1">
				{navItems.map((item) => (
					<button
						key={item.label}
						className={cn(
							'flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md',
							item.active ? 'bg-blue-600' : 'hover:bg-gray-800'
						)}
					>
						<item.icon className="w-4 h-4" />
						{item.label}
					</button>
				))}
			</div>
		</div>
	)
}
