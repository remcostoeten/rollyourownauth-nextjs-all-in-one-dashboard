import { db } from "../../../../server/db"
import { userProfiles } from "../schemas/user-profile"
import { eq } from "drizzle-orm"
import { type updateUserProfileSchema, userProfileSchema } from "../models/user-profile.z"

export async function updateUserProfile(userId: string, input: updateUserProfileSchema) {
  await db.update(userProfiles).set(input).where(eq(userProfiles.userId, userId))

  const updatedProfile = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).get()
  return userProfileSchema.parse(updatedProfile)
}

