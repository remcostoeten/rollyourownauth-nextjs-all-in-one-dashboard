import { db } from "../../../../server/db"
import { sessions } from "../schemas/session"
import { nanoid } from "nanoid"
import { generateToken } from "../../utils/jwt"

export async function createSession(userId: string) {
  const id = nanoid()
  const token = await generateToken({ userId, sessionId: id })
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

  await db.insert(sessions).values({ id, userId, expiresAt })

  return { token, expiresAt }
}

