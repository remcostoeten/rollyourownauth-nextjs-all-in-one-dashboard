import type { Metadata } from 'next'
import './globals.css'
import { cookies } from "next/headers"
import { verifyToken } from "../modules/auth/utils/jwt"
import { AuthProvider } from "../modules/auth/components/auth-provider"
import { AuthGuard } from "../modules/auth/components/auth-guard"

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const token = cookies().get("auth_token")
  let user = null

  if (token) {
    try {
      const payload = await verifyToken(token.value)
      if (payload) {
        user = {
          id: payload.userId,
          email: payload.email,
          role: payload.role,
        }
      }
    } catch (error) {
      console.error("Token verification failed:", error)
    }
  }

  return (
    <html lang="en">
      <body>
        <AuthProvider initialUser={user}>
          <AuthGuard>{children}</AuthGuard>
        </AuthProvider>
      </body>
    </html>
  )
}
