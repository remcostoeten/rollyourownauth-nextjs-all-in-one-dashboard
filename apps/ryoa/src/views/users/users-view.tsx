"use client"

import { use } from "react"

async function getUsers() {
  const res = await fetch("/api/users", { cache: "no-store" })
  if (!res.ok) throw new Error("Failed to fetch users")
  return res.json()
}

type User = {
  id: string
  email: string
  role: string
}

type UsersViewProps = {
  users: User[]
}

export function UsersView({ users }: UsersViewProps) {
  return <div>{JSON.stringify(users, null, 2)}</div>
} 