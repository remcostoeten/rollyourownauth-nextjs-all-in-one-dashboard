import { z } from "zod"

export const oauthConnectionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  provider: z.string(),
  providerUserId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type OAuthConnection = z.infer<typeof oauthConnectionSchema>

