"use server"

import { db } from "../../../../server/db"
import { nanoid } from "nanoid"
import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"
import { cookies } from "next/headers"
import { createUserSchema, userSchema } from "../models/user.z"
import { env } from "@/src/server/env"
import { users } from "../schemas/user"
import { ZodError } from "zod"

export async function createUserAction(data: {
  email: string
  password: string
}) {
  try {
    const input = createUserSchema.parse(data)
    const { email, password, role = "user" } = input
    const id = nanoid()
    const passwordHash = await bcrypt.hash(password, 10)
    const now = new Date()

    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email)).get()
    if (existingUser) {
      return {
        success: false,
        error: "Email already registered",
      }
    }

    const isAdminEmail = env.ADMIN_EMAILS?.split(",").includes(email)
    const finalRole = isAdminEmail ? "admin" : role

    const result = await db.insert(users).values({
      id,
      email,
      passwordHash,
      role: finalRole,
      createdAt: now,
      updatedAt: now,
    })

    if (!result) {
      throw new Error("Failed to create user")
    }

    const createdUser = await db.select().from(users).where(eq(users.id, id)).get()
    if (!createdUser) {
      throw new Error("Failed to retrieve created user")
    }

    const parsedUser = userSchema.parse({
      ...createdUser,
      createdAt: new Date(createdUser.createdAt),
      updatedAt: new Date(createdUser.updatedAt),
    })

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
      user: { ...parsedUser, role: finalRole },
      redirect: finalRole === "admin" ? "/dashboard/admin" : "/dashboard",
    }
  } catch (error) {
    console.error("Registration error details:", error)
    
    if (error instanceof ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      }
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred during registration.",
    }
  }
}



// import { db } from "../../../../server/db"
// import { users } from "../schemas/user"
// import { createUserSchema, userSchema } from "../models/user.z"
// import { nanoid } from "nanoid"
// import bcrypt from "bcryptjs"
// import { env } from "../../../../server/env"
// import { eq } from "drizzle-orm"

// export async function createUser(rawInput: unknown) {
//   const input = createUserSchema.parse(rawInput)
//   const { email, password, role = "user" } = input
//   const id = nanoid()
//   const passwordHash = await bcrypt.hash(password, 10)

//   // Check if the email is an admin email and set role accordingly
//   const isAdminEmail = env.ADMIN_EMAILS?.split(",").includes(email)
//   const finalRole = isAdminEmail ? "admin" : role

//   await db.insert(users).values({ id, email, passwordHash, role: finalRole })

//   const createdUser = await db.select().from(users).where(eq(users.id, id)).get()
//   const parsedUser = userSchema.parse(createdUser)
//   return { ...parsedUser, role: finalRole }
// }

