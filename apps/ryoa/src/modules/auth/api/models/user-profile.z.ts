import { z } from "zod"

export const userProfileSchema = z.object({
  id: z.string(),
  userId: z.string(),
  fullName: z.string().optional(),
  bio: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const updateUserProfileSchema = userProfileSchema
  .partial()
  .omit({ id: true, userId: true, createdAt: true, updatedAt: true })

export type UserProfile = z.infer<typeof userProfileSchema>
export type UpdateUserProfile = z.infer<typeof updateUserProfileSchema>

