"use client"

import { useEffect, useState } from "react"

export function UsersView() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch(console.error)
  }, [])

  return <div>{JSON.stringify(users, null, 2)}</div>
} 