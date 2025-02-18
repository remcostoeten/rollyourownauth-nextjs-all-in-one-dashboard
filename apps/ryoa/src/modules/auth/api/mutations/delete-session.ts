import { db } from "../../../../server/db"
import { sessions } from "../schemas/session"
import { eq } from "drizzle-orm"

export async function deleteSession(id: string) {
  await db.delete(sessions).where(eq(sessions.id, id))
}

