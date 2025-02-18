import { db } from "../../../../server/db"
import { users } from "../schemas/user"
import { eq } from "drizzle-orm"
import { userSchema } from "../models/user.z"

export async function getUserByEmail(email: string) {
  const result = db.select().from(users).where(eq(users.email, email)).get()
  return result ? userSchema.parse(result) : null
}

