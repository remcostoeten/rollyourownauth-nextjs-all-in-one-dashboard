import { db } from "../../../../server/db"
import { oauthConnections } from "../schemas/oauth-connection"
import { oauthConnectionSchema } from "../models/oauth-connection.z"
import { nanoid } from "nanoid"
import { eq } from "drizzle-orm"

export async function createOAuthConnection(userId: string, provider: string, providerUserId: string) {
  const id = nanoid()

  await db.insert(oauthConnections).values({ id, userId, provider, providerUserId })

  const createdConnection = await db.select().from(oauthConnections).where(eq(oauthConnections.id, id)).get()
  return oauthConnectionSchema.parse(createdConnection)
}

