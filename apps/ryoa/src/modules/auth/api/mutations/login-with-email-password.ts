"use server"

import { db } from "../../../../server/db"
import { users } from "../schemas/user"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"
import { nanoid } from "nanoid"

export async function loginWithEmailPassword(data: { email: string; password: string }) {
  try {
    const user = await db.select().from(users).where(eq(users.email, data.email)).get()

    if (!user || !user.passwordHash) {
      return {
        success: false,
        error: "Invalid email or password",
      }
    }

    const isValid = await bcrypt.compare(data.password, user.passwordHash)
    if (!isValid) {
      return {
        success: false,
        error: "Invalid email or password",
      }
    }

    const token = nanoid()
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

    cookies().set("auth_token", token, {
      expires: expiresAt,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    })

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      redirect: user.role === "admin" ? "/dashboard/admin" : "/dashboard",
    }
  } catch (error) {
    console.error("Login error:", error)
    return {
      success: false,
      error: "An unexpected error occurred",
    }
  }
}

