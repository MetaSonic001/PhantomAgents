"use client"

import { Search, Bell, Settings } from "lucide-react"
import ThemeToggle from "./theme-toggle"

export function DashboardHeader() {
  return (
    <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div className="flex items-center justify-between px-8 h-16 gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search agents..."
              className="w-full pl-10 pr-4 py-2 rounded-md border border-border bg-input text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-secondary rounded-md transition text-muted-foreground hover:text-foreground">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-secondary rounded-md transition text-muted-foreground hover:text-foreground">
            <Settings className="w-5 h-5" />
          </button>
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}
