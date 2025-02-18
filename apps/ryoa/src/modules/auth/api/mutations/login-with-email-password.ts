import { getUserByEmail } from "../queries/get-user-by-email"
import { createSession } from "./create-session"
import type { loginSchema } from "../models/user.z"
import bcrypt from "bcryptjs"

export async function loginWithEmailPassword(input: loginSchema) {
  const { email, password } = input

  const user = await getUserByEmail(email)
  if (!user) {
    throw new Error("Invalid email or password")
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash)
  if (!isValidPassword) {
    throw new Error("Invalid email or password")
  }

  const { token, expiresAt } = await createSession(user.id)
  return { user, token, expiresAt }
}

