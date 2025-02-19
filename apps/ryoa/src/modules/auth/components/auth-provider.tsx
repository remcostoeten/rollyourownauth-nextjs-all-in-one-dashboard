"use client"

import { useEffect } from "react"
import { useAuthStore } from "../state/use-auth-store"
import type { AuthStore } from "../state/use-auth-store"

type User = {
  id: string
  email: string
  role: "user" | "admin"
}

export function AuthProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode
  initialUser: User | null
}) {
  const setUser = useAuthStore((state: AuthStore) => state.setUser)

  useEffect(() => {
    if (initialUser) {
      setUser(initialUser)
    }
  }, [initialUser, setUser])

  return <>{children}</>
} 