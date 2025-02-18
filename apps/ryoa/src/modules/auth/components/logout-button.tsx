"use client"

import { useRouter } from "next/navigation"
import { logout } from "../api/mutations/logout"

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  return (
    <button
      onClick={handleLogout}
      className="text-gray-500 hover:bg-gray-100 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
    >
      Logout
    </button>
  )
}

