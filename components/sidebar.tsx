"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutGrid,
  Zap,
  ShoppingCart,
  Trophy,
  BarChart3,
  Settings,
  BookOpen,
  Plus,
  Users,
  Activity,
  Bell,
  Webhook,
  Database,
  AlertTriangle,
  GitBranch,
  DollarSign,
  Gamepad2,
  Wallet,
  Network,
  Shield,
  BookOpenCheck,
  Mic,
  TrendingUp,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { icon: LayoutGrid, label: "Dashboard", href: "/dashboard" },
  // Agents becomes a grouped section with logical sub-pages (Overview, Runs, Network)
  { icon: Zap, label: "Agents", href: "/dashboard/agents" },
  { icon: ShoppingCart, label: "Marketplace", href: "/dashboard/marketplace" },
  { icon: Trophy, label: "Competitions", href: "/dashboard/competitions" },
  { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
]

// Items that appear under Operations (kept lightweight)
const additionalItems = [
  // Agent Runs and Agent Network are surfaced under the Agents group — keep main list focused
  { icon: Users, label: "Team", href: "/dashboard/team" },
  { icon: Webhook, label: "Webhooks", href: "/dashboard/webhooks" },
  { icon: Bell, label: "Notifications", href: "/dashboard/notifications" },
  { icon: Database, label: "API Docs", href: "/dashboard/api-docs" },
]

// Advanced section: remove duplicates and consolidate (Agent NFTs merged into Marketplace)
const advancedItems = [
  { icon: Gamepad2, label: "Playground", href: "/dashboard/playground" },
  { icon: Shield, label: "Trust Center", href: "/dashboard/trust-center" },
  { icon: BookOpenCheck, label: "Research Agents", href: "/dashboard/research-agents" },
  { icon: Mic, label: "Voice Agents", href: "/dashboard/voice-agents" },
  { icon: Zap, label: "Templates", href: "/dashboard/templates" },
  { icon: AlertTriangle, label: "AI Safety", href: "/dashboard/ai-safety" },
  { icon: GitBranch, label: "Version Control", href: "/dashboard/version-control" },
  { icon: DollarSign, label: "Cost Management", href: "/dashboard/cost-management" },
]

const secondaryItems = [
  { icon: BookOpen, label: "Documentation", href: "/docs" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 border-r border-border bg-sidebar fixed left-0 top-0 h-screen flex flex-col overflow-hidden">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border flex-shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition">
          <div className="w-8 h-8 bg-sidebar-primary rounded-md flex items-center justify-center">
            <span className="text-xs font-bold text-sidebar-primary-foreground">PA</span>
          </div>
          <span className="font-semibold text-sidebar-foreground">PhantomAgents</span>
        </Link>
      </div>

      {/* Create New Agent Button */}
      <div className="p-4 flex-shrink-0">
        <Link
          href="/builder"
          className="w-full flex items-center justify-center gap-2 bg-sidebar-primary text-sidebar-primary-foreground py-2 rounded-md hover:opacity-90 transition font-medium text-sm"
        >
          <Plus className="w-4 h-4" />
          New Agent
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <div key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>

              {/* Agents grouped sub-links */}
              {item.label === "Agents" && (
                <div className="mt-1 ml-8 flex flex-col">
                  <Link
                    href="/dashboard/agents"
                    className={cn(
                      "text-xs px-2 py-1 rounded-md transition whitespace-nowrap",
                      pathname === "/dashboard/agents" || pathname.startsWith("/dashboard/agents/")
                        ? "text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/70 hover:text-sidebar-foreground",
                    )}
                  >
                    Overview
                  </Link>
                  <Link
                    href="/dashboard/agents/runs"
                    className={cn(
                      "text-xs px-2 py-1 rounded-md transition whitespace-nowrap",
                      pathname === "/dashboard/agent-runs" || pathname.startsWith("/dashboard/agents/runs")
                        ? "text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/70 hover:text-sidebar-foreground",
                    )}
                  >
                    Runs
                  </Link>
                  <Link
                    href="/dashboard/agents/network"
                    className={cn(
                      "text-xs px-2 py-1 rounded-md transition whitespace-nowrap",
                      pathname === "/dashboard/agent-network" || pathname.startsWith("/dashboard/agents/network")
                        ? "text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/70 hover:text-sidebar-foreground",
                    )}
                  >
                    Network
                  </Link>
                </div>
              )}
            </div>
          )
        })}

        {/* Operations Section */}
        <div className="pt-2 mt-4 border-t border-sidebar-border">
          <p className="text-xs font-semibold text-sidebar-foreground/50 px-4 py-2 uppercase">Operations</p>
          {additionalItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            )
          })}
        </div>

        {/* Advanced Section */}
        <div className="pt-2 mt-4 border-t border-sidebar-border">
          <p className="text-xs font-semibold text-sidebar-foreground/50 px-4 py-2 uppercase">Advanced</p>
          {advancedItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Secondary Navigation */}
      <div className="border-t border-sidebar-border p-4 flex-shrink-0 space-y-2">
        {secondaryItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50",
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          )
        })}
      </div>

      {/* User Profile */}
      <div className="border-t border-sidebar-border p-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-sidebar-accent rounded-full"></div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">You</p>
            <p className="text-xs text-sidebar-foreground/60 truncate">user@phantom.ai</p>
          </div>
        </div>
      </div>
    </div>
  )
}
