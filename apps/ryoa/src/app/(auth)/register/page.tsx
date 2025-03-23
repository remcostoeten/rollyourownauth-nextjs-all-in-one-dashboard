import type { Metadata } from "next"
import { RegisterView } from "../../modules/auth/views/register-view"
import { Navigation } from "../../components/navigation"

export const metadata: Metadata = {
  title: "Register",
  description: "Create a new account",
}

export default function RegisterPage() {
  return (
    <>
      <Navigation />
      <RegisterView />
    </>
  )
}

