import { db } from "../../../../server/db"
import { users } from "../schemas/user"
import { eq } from "drizzle-orm"
import { userSchema } from "../models/user.z"

export async function getUserById(id: string) {
  const result = await db.select().from(users).where(eq(users.id, id)).get()
  return result ? userSchema.parse(result) : null
}

