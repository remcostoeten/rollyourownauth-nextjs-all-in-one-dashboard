import { Plus, List, Layout, FileText, Copy } from 'lucide-react'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	Button
} from 'ui'
import { useListStore } from '../../quick-task/store/lists'
import { cn } from 'helpers'
import { useKeyboardShortcut } from '../../quick-task/hooks/use-keyboard-shortcut'

interface CreateNewDropdownProps {
	className?: string
}

export function CreateNewDropdown({ className }: CreateNewDropdownProps) {
	const { createList } = useListStore()

	const focusNewTaskInput = () => {
		const input = document.querySelector<HTMLInputElement>(
			'input[placeholder*="Add a task"]'
		)
		if (input) {
			input.focus()
		}
	}

	useKeyboardShortcut('newTask', focusNewTaskInput)

	const createOptions = [
		{
			label: 'New List',
			icon: List,
			onClick: createList,
			description: 'Create a new list to organize tasks'
		},
		{
			label: 'New Task',
			icon: FileText,
			onClick: focusNewTaskInput,
			description: 'Add a new task to the current list',
			shortcut: 'Alt+N'
		},
		{
			label: 'New Project',
			icon: Layout,
			onClick: () => console.log('Create project'),
			description: 'Create a project to group related lists'
		},
		{
			label: 'New Template',
			icon: Copy,
			onClick: () => console.log('Create template'),
			description: 'Save current structure as a template'
		}
	]

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					className={cn(
						'w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors',
						className
					)}
				>
					<div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center">
						<Plus className="w-4 h-4 text-accent-foreground" />
					</div>
					<span className="text-sm">Create new</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-[220px]">
				{createOptions.map((option) => (
					<DropdownMenuItem
						key={option.label}
						onClick={option.onClick}
						className="flex flex-col items-start py-2 px-3 cursor-pointer"
					>
						<div className="flex items-center gap-2 w-full">
							<option.icon className="w-4 h-4" />
							<span>{option.label}</span>
							{option.shortcut && (
								<kbd className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded">
									{option.shortcut}
								</kbd>
							)}
						</div>
						<span className="text-xs text-muted-foreground mt-1">
							{option.description}
						</span>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
