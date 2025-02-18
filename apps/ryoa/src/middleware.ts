import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "./modules/auth/utils/jwt"
export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value

  if (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/register") {
    if (token) {
      const payload = await verifyToken(token)
      if (payload) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    }
    return NextResponse.next()
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const payload = await verifyToken(token)

  if (!payload) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Add the user ID and role to the request headers
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("X-User-ID", payload.userId)
  requestHeaders.set("X-User-Role", payload.role)

  // Check for admin routes
  if (request.nextUrl.pathname.startsWith("/dashboard/admin")) {
    if (payload.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: ["/login", "/register", "/dashboard/:path*"],
}

