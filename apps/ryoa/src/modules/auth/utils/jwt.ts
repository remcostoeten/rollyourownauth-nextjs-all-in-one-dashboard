import { SignJWT, jwtVerify } from "jose"
import { env } from "../../../server/env"

const JWT_SECRET = new TextEncoder().encode(env.JWT_SECRET)
const JWT_EXPIRES_IN = "7d" // 7 days

export async function generateToken(payload: object): Promise<string> {
  return new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setExpirationTime(JWT_EXPIRES_IN).sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload
  } catch (error) {
    return null
  }
}

