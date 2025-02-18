import { db } from "../../../../server/db"
import { userProfiles } from "../schemas/user-profile"
import { eq } from "drizzle-orm"
import { userProfileSchema } from "../models/user-profile.z"

export async function getUserProfile(userId: string) {
  const result = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).get()
  return result ? userProfileSchema.parse(result) : null
}

