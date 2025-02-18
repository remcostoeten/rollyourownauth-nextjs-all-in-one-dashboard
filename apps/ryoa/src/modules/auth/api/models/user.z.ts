import { z } from "zod"

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  role: z.enum(["user", "admin"]).default("user"),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const createUserSchema = userSchema.omit({ id: true, createdAt: true, updatedAt: true }).extend({
  password: z.string().min(8),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export type User = z.infer<typeof userSchema>
export type CreateUser = z.infer<typeof createUserSchema>
export type LoginCredentials = z.infer<typeof loginSchema>

