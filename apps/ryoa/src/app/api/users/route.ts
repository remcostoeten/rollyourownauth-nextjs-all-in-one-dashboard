import { NextRequest, NextResponse } from "next/server"
import { db } from "../../../server/db"
import { users } from "../../../modules/auth/api/schemas/user"
import { verifyToken } from "../../../modules/auth/utils/jwt"

export async function GET(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const payload = await verifyToken(token)

    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const allUsers = await db
      .select({
        id: users.id,
        email: users.email,
        role: users.role,
      })
      .from(users)

    return NextResponse.json(allUsers)
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

