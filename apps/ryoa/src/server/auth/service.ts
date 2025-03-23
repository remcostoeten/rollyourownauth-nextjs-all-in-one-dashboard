import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { db } from '../db'
import { createId } from '@paralleldrive/cuid2'
import { hash, verify } from '@node-rs/argon2'
import { eq } from 'drizzle-orm'
import type { User, Session } from '../db/schema'
import { sessions, users } from '../db/schema'
import { ResponseCookies } from 'next/dist/server/web/spec-extension/cookies'

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set')
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

export async function hashPassword(password: string) {
  return await hash(password)
}

export async function verifyPassword(hashedPassword: string, password: string) {
  return await verify(hashedPassword, password)
}

export async function createSession(userId: string): Promise<Session> {
  const sessionId = createId()
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

  await db.insert(sessions).values({
    id: sessionId,
    userId,
    expiresAt
  })

  const session = await db.query.sessions.findFirst({
    where: eq(sessions.id, sessionId)
  })
  
  if (!session) throw new Error('Failed to create session')

  const token = await new SignJWT({ sessionId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('30d')
    .sign(secret)

  const cookieStore = new ResponseCookies(new Headers())
  cookieStore.set({
    name: 'auth-token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt
  })

  return session
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = cookies()
  const token = cookieStore.get('auth-token')
  if (!token) return null

  try {
    const { payload } = await jwtVerify(token.value, secret)
    const session = await db.query.sessions.findFirst({
      where: eq(sessions.id, payload.sessionId as string)
    })
    
    if (!session || new Date(session.expiresAt) < new Date()) {
      const responseCookies = new ResponseCookies(new Headers())
      responseCookies.delete('auth-token')
      return null
    }

    return session
  } catch {
    const responseCookies = new ResponseCookies(new Headers())
    responseCookies.delete('auth-token')
    return null
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession()
  if (!session) return null

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.userId)
  })
  
  return user || null
}

export async function signOut() {
  const session = await getSession()
  if (session) {
    await db.delete(sessions).where(eq(sessions.id, session.id))
  }
  const responseCookies = new ResponseCookies(new Headers())
  responseCookies.delete('auth-token')
} 