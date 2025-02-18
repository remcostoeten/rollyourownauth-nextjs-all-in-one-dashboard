import { db } from "../../../../server/db"
import { sessions } from "../schemas/session"
import { eq } from "drizzle-orm"
import { sessionSchema } from "../models/session.z"

export async function getSessionById(id: string) {
  const result = await db.select().from(sessions).where(eq(sessions.id, id)).get()
  return result ? sessionSchema.parse(result) : null
}

