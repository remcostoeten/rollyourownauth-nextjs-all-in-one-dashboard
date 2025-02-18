import type { Metadata } from "next"
import { AdminDashboardView } from "../../../modules/dashboard/views/admin-dashboard-view"
import { Navigation } from "../../../components/navigation"

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin dashboard to manage users",
}

export default function AdminDashboardPage() {
  return (
    <>
      <Navigation />
      <AdminDashboardView />
    </>
  )
}

