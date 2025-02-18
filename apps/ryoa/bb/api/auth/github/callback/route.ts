import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { nanoid } from "nanoid"
import { eq } from "drizzle-orm"
import { db } from "../../../../../src/server/db"
import { users } from "../../../../../src/modules/auth/api/schemas/user"
import { env } from "../../../../../src/server/env"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get("code")

    if (!code) {
      return NextResponse.redirect(new URL("/login?error=No code provided", request.url))
    }

    // Exchange code for access token
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (tokenData.error) {
      return NextResponse.redirect(new URL(`/login?error=${tokenData.error}`, request.url))
    }

    // Get user data from GitHub
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    const githubUser = await userResponse.json()

    // Get or create user
    let user = await db.select().from(users).where(eq(users.email, githubUser.email)).get()

    if (!user) {
      const id = nanoid()
      const isAdminEmail = env.ADMIN_EMAILS?.split(",").includes(githubUser.email)
      const now = new Date()

      await db.insert(users).values({
        id,
        email: githubUser.email,
        role: isAdminEmail ? "admin" : "user",
        createdAt: now,
        updatedAt: now,
      })

      user = await db.select().from(users).where(eq(users.id, id)).get()
    }

    // Set auth token
    const token = nanoid()
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

    cookies().set("auth_token", token, {
      expires: expiresAt,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    })

    // Redirect based on role
    return NextResponse.redirect(
      new URL(user.role === "admin" ? "/dashboard/admin" : "/dashboard", request.url)
    )
  } catch (error) {
    console.error("GitHub OAuth error:", error)
    return NextResponse.redirect(new URL("/login?error=Authentication failed", request.url))
  }
} 