import { z } from 'zod'

export const zCategory = z.object({
	id: z.string(),
	name: z.string(),
	icon: z.string().optional(),
	type: z.enum(['system', 'custom']),
	count: z.number().optional()
})

export type Category = z.infer<typeof zCategory>
