import { db } from "../../../../server/db"
import { users } from "../schemas/user"
import { type createUserSchema, userSchema } from "../models/user.z"
import { nanoid } from "nanoid"
import bcrypt from "bcryptjs"
import { env } from "../../../../server/env"
import { eq } from "drizzle-orm"

export async function createUser(input: createUserSchema) {
  const { email, password, role = "user" } = input
  const id = nanoid()
  const passwordHash = await bcrypt.hash(password, 10)

  // Check if the email is an admin email and set role accordingly
  const isAdminEmail = env.ADMIN_EMAILS?.split(",").includes(email)
  const finalRole = isAdminEmail ? "admin" : role

  await db.insert(users).values({ id, email, passwordHash, role: finalRole })

  const createdUser = await db.select().from(users).where(eq(users.id, id)).get()
  const parsedUser = userSchema.parse(createdUser)
  return { ...parsedUser, role: finalRole }
}

