import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyToken } from "../../../../modules/auth/utils/jwt"

export async function GET() {
  const cookieStore = cookies()
  const token = cookieStore.get("auth_token")

  if (!token) {
    return NextResponse.json({ isLoggedIn: false })
  }

  try {
    await verifyToken(token.value)
    return NextResponse.json({ isLoggedIn: true })
  } catch (error) {
    return NextResponse.json({ isLoggedIn: false })
  }
}

