import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import AmbientBackground from "@/components/ambient"
import Animated from "@/components/Animated"

export default function DashboardLayout({ children, }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#030014] text-foreground">
      <AmbientBackground />
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden ml-64">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto">
            <Animated className="p-0">{children}</Animated>
          </main>
        </div>
      </div>
    </div>
  )
}
