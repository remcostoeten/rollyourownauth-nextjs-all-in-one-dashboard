"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogoutButton } from "../modules/auth/components/logout-button"
import { useEffect, useState } from "react"

export function Navigation() {
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const checkAuthStatus = async () => {
      const response = await fetch("/api/auth/status")
      const data = await response.json()
      setIsLoggedIn(data.isLoggedIn)
    }

    checkAuthStatus()
  }, [])

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-indigo-600">
                AuthApp
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className={`${
                  pathname === "/"
                    ? "border-indigo-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Home
              </Link>
              {isLoggedIn && (
                <Link
                  href="/dashboard"
                  className={`${
                    pathname === "/dashboard"
                      ? "border-indigo-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="ml-3 relative">
              <div className="flex space-x-4">
                {isLoggedIn ? (
                  <LogoutButton />
                ) : (
                  <>
                    <Link
                      href="/login"
                      className={`${
                        pathname === "/login"
                          ? "bg-gray-100 text-gray-700"
                          : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                      } px-3 py-2 rounded-md text-sm font-medium`}
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className={`${
                        pathname === "/register"
                          ? "bg-indigo-700 text-white"
                          : "bg-indigo-600 text-white hover:bg-indigo-700"
                      } px-3 py-2 rounded-md text-sm font-medium`}
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

