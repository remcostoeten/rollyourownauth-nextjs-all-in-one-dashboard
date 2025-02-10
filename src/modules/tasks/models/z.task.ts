import { z } from 'zod'

export const zTaskCreate = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  listId: z.string().optional()
})

export type TaskCreate = z.infer<typeof zTaskCreate> 