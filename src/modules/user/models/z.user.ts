import { z } from 'zod'

export const zUser = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  avatar: z.string().optional()
})

export type User = z.infer<typeof zUser> 