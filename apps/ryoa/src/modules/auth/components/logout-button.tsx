"use client"

import { useRouter } from "next/navigation"
import { useAuthStore } from "../state/use-auth-store"

export function LogoutButton() {
  const router = useRouter()
  const logout = useAuthStore((state) => state.logout)

  async function handleLogout() {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Logout failed")
      }

      logout()
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm font-medium text-gray-700 hover:text-gray-800"
    >
      Logout
    </button>
  )
}

