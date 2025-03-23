import type { InferModel } from 'drizzle-orm'
import { users, sessions, oauthConnections, userProfiles } from '.'

export type User = InferModel<typeof users>
export type Session = InferModel<typeof sessions>
export type OAuthConnection = InferModel<typeof oauthConnections>
export type UserProfile = InferModel<typeof userProfiles>

// Add insert types if needed
export type NewUser = InferModel<typeof users, "insert">
export type NewSession = InferModel<typeof sessions, "insert">
export type NewOAuthConnection = InferModel<typeof oauthConnections, "insert">
export type NewUserProfile = InferModel<typeof userProfiles, "insert"> 