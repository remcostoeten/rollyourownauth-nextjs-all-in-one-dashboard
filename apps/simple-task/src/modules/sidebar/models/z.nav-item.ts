import { z } from 'zod'

export const zNavItem = z.object({
  id: z.string(),
  icon: z.any(), // React.ElementType is not directly representable in Zod
  label: z.string(),
  color: z.string().optional(),
  isHidden: z.boolean().optional()
})

export type NavItem = z.infer<typeof zNavItem>

export const initialNavItems: NavItem[] = [
  { id: 'inbox', icon: 'InboxIcon', label: 'Inbox' },
  { id: 'today', icon: 'TodayIcon', label: 'Today' },
  { id: 'tasks', icon: 'TasksIcon', label: 'Tasks' },
  { id: 'updates', icon: 'UpdatesIcon', label: 'Updates' },
  { id: 'lists', icon: 'ListsIcon', label: 'Lists' }
] 