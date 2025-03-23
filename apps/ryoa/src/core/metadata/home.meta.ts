import type { JSX } from 'react'
import { ListTodo, Calendar, Flag, AlertCircle, ListPlus, ListIcon } from 'lucide-react'
export interface NavItem {
	id: string
	icon: React.ElementType
	label: string
	color?: string
	isHidden?: boolean
}

export interface SlashMenuItem {
	id: string
	title: string
	icon: JSX.Element
	description: string
}

export const navigationItems: NavItem[] = [
	{
		id: 'inbox',
		icon: ListIcon,
		label: 'Inbox'
	},
	{
		id: 'today',
		icon: Calendar,
		label: 'Today'
	},
	{
		id: 'tasks',
		icon: ListTodo,
		label: 'Tasks'
	},
	{
		id: 'updates',
		icon: ListIcon,
		label: 'Updates'
	},
	{
		id: 'lists',
		icon: ListIcon,
		label: 'Lists'
	}
]

export const slashMenuItems: SlashMenuItem[] = [
	{
		id: 'task',
		title: 'Add Task',
		icon: ListTodo,
		description: 'Add a new task to your list'
	},
	{
		id: 'scheduled', 
		title: 'Add Scheduled Task',
		icon: Calendar,
		description: 'Add a task with a due date'
	},
	{
		id: 'priority',
		title: 'Add Priority Task',
		icon: Flag,
		description: 'Add a high priority task'
	},
	{
		id: 'blocker',
		title: 'Add Blocker',
		icon: AlertCircle,
		description: 'Add a blocking issue'
	},
	{
		id: 'new-list',
		title: 'New List',
		icon: ListPlus,
		description: 'Create a new list'
	}
]

export const createOptions = [
	{
		label: 'New List',
		icon: ListIcon,
		description: 'Create a new list to organize tasks'
	}
] 