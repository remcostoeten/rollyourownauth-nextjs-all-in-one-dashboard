import type { Metadata } from "next"
import { LoginView } from "../../modules/auth/views/login-view"
import { Navigation } from "../../components/navigation"

export const metadata: Metadata = {
  title: "Login",
  description: "Log in to your account",
}

export default function LoginPage() {
  return (
    <>
      <Navigation />
      <LoginView />
    </>
  )
}

