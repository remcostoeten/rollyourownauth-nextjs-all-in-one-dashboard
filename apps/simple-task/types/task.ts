export interface Task {
	id: string
	title: string
	description?: string
	completed: boolean
	dueDate?: string
	assignee?: string
	labels?: string[]
	subtasks?: Subtask[]
	createdAt: string
	updatedAt: string
}

export interface Subtask {
	id: string
	title: string
	completed: boolean
}

export type TaskCreate = Omit<
	Task,
	'id' | 'createdAt' | 'updatedAt' | 'completed' | 'subtasks'
>
export type TaskUpdate = Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>
