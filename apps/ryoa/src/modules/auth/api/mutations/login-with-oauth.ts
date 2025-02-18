import { getUserByEmail } from "../queries/get-user-by-email"
import { createUser } from "./create-user"
import { createSession } from "./create-session"
import { createOAuthConnection } from "./create-oauth-connection"
import { nanoid } from "nanoid"

export async function loginWithOAuth(profile: { email: string; id: string; name?: string }) {
  let user = await getUserByEmail(profile.email)

  if (!user) {
    // Create a new user if they don't exist
    user = await createUser({
      email: profile.email,
      password: nanoid(), // Generate a random password for OAuth users
    })
  }

  // Create or update OAuth connection
  await createOAuthConnection(user.id, "github", profile.id)

  // Create a new session
  const { token, expiresAt } = await createSession(user.id)

  return { user, token, expiresAt }
}

