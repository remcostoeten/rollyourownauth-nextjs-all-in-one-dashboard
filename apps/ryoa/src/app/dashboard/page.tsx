import type { Metadata } from "next"
import { DashboardView } from "../../modules/dashboard/views/dashboard-view"
import { Navigation } from "../../components/navigation"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your personal dashboard",
}

export default function DashboardPage() {
  return (
    <>
      <Navigation />
      <DashboardView />
    </>
  )
}

