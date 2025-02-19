"use client"

import { useAuthStore, type AuthStore } from "@/src/modules/auth/state/use-auth-store"

export function DashboardView() {
  const user = useAuthStore((state: AuthStore) => state.user)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-2">Welcome, {user?.email}</h2>
        <p className="text-gray-600">
          You are logged in as a {user?.role} user.
        </p>
      </div>
    </div>
  )
} 