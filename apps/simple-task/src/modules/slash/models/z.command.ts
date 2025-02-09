import { z } from 'zod'

export const zCommand = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string().optional(),
	icon: z.string().optional(),
	shortcut: z.string().optional(),
	action: z.function().args(z.any()).returns(z.void())
})

export type Command = z.infer<typeof zCommand>
