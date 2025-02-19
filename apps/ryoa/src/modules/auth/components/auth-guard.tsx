"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuthStore } from "../state/use-auth-store"

const PUBLIC_ROUTES = ["/login", "/register", "/"]
const PROTECTED_ROUTES = ["/dashboard", "/dashboard/admin", "/profile"]

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, user, isLoading } = useAuthStore()

  useEffect(() => {
    // Debug logging
    console.log({
      isLoading,
      isAuthenticated,
      pathname,
      userRole: user?.role,
    })

    if (isLoading) return // Wait for auth state to be determined

    const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route))

    if (isAuthenticated && PUBLIC_ROUTES.includes(pathname)) {
      // Redirect authenticated users away from public pages
      console.log("Redirecting authenticated user from public route to dashboard")
      router.push(user?.role === "admin" ? "/dashboard/admin" : "/dashboard")
    } else if (!isAuthenticated && isProtectedRoute) {
      // Only redirect unauthenticated users from protected routes
      console.log("Redirecting unauthenticated user from protected route to login")
      router.push("/login")
    }
  }, [isAuthenticated, pathname, router, user?.role, isLoading])

  // Show nothing while loading to prevent flash of wrong content
  if (isLoading) {
    return null
  }

  return <>{children}</>
} 