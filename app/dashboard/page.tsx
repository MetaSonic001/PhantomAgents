"use client"

import { MoreVertical, ArrowUpRight, Play, ShoppingCart } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

// Mock data for agents
const mockAgents = [
  {
    id: "1",
    name: "Crypto Trader Pro",
    status: "active",
    lastAction: "2 mins ago",
    actionsToday: 24,
    revenue: 1240.5,
    type: "Trading Agent",
  },
  {
    id: "2",
    name: "Market Oracle",
    status: "active",
    lastAction: "5 mins ago",
    actionsToday: 18,
    revenue: 890.25,
    type: "Prediction Oracle",
  },
  {
    id: "3",
    name: "DAO Delegate",
    status: "idle",
    lastAction: "1 hour ago",
    actionsToday: 0,
    revenue: 450.0,
    type: "Governance Delegate",
  },
]

const mockActivities = [
  { agent: "Crypto Trader Pro", action: "Trade Executed", type: "success", time: "2 mins ago" },
  { agent: "Market Oracle", action: "Prediction Published", type: "success", time: "5 mins ago" },
  { agent: "DAO Delegate", action: "Vote Cast", type: "success", time: "1 hour ago" },
  { agent: "Crypto Trader Pro", action: "Signal Generated", type: "success", time: "15 mins ago" },
]

export default function DashboardPage() {
  const [agents, setAgents] = useState(mockAgents)

  const totalAgents = agents.length
  const activeAgents = agents.filter((a) => a.status === "active").length
  const totalRevenue = agents.reduce((sum, a) => sum + a.revenue, 0)
  const totalActions = agents.reduce((sum, a) => sum + a.actionsToday, 0)

  return (
    <div className="p-8 space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="border border-border rounded-lg p-6 bg-card hover:border-accent transition">
          <p className="text-sm text-muted-foreground mb-2">Total Agents</p>
          <p className="text-3xl font-bold">{totalAgents}</p>
          <p className="text-xs text-muted-foreground mt-2">All agents</p>
        </div>
        <div className="border border-border rounded-lg p-6 bg-card hover:border-accent transition">
          <p className="text-sm text-muted-foreground mb-2">Active Now</p>
          <p className="text-3xl font-bold">{activeAgents}</p>
          <p className="text-xs text-muted-foreground mt-2">Running agents</p>
        </div>
        <div className="border border-border rounded-lg p-6 bg-card hover:border-accent transition">
          <p className="text-sm text-muted-foreground mb-2">Today's Actions</p>
          <p className="text-3xl font-bold">{totalActions}</p>
          <p className="text-xs text-muted-foreground mt-2">24 hour period</p>
        </div>
        <div className="border border-border rounded-lg p-6 bg-card hover:border-accent transition">
          <p className="text-sm text-muted-foreground mb-2">Revenue</p>
          <p className="text-3xl font-bold">${totalRevenue.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-2">Total earned</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Feed */}
        <div className="lg:col-span-2 border border-border rounded-lg p-6 bg-card">
          <h2 className="text-lg font-semibold mb-6">Activity Feed</h2>
          <div className="space-y-4">
            {mockActivities.map((activity, i) => (
              <div key={i} className="flex items-center justify-between py-4 border-b border-border last:border-b-0">
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.agent}</p>
                  <p className="text-xs text-muted-foreground">{activity.action}</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded ${activity.type === "success" ? "bg-green-500/10 text-green-700" : "bg-red-500/10 text-red-700"}`}
                >
                  {activity.type === "success" ? "✓" : "✕"} {activity.type}
                </span>
                <p className="text-xs text-muted-foreground ml-4">{activity.time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <div className="border border-border rounded-lg p-6 bg-card">
            <h3 className="text-sm font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link
                href="/builder"
                className="flex items-center justify-between p-3 rounded-md border border-border hover:bg-secondary transition text-sm font-medium"
              >
                <span>Create New Agent</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard/marketplace"
                className="flex items-center justify-between p-3 rounded-md border border-border hover:bg-secondary transition text-sm font-medium"
              >
                <span>Browse Marketplace</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard/analytics"
                className="flex items-center justify-between p-3 rounded-md border border-border hover:bg-secondary transition text-sm font-medium"
              >
                <span>View Analytics</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="border border-border rounded-lg p-6 bg-card">
            <h3 className="text-sm font-semibold mb-4">Account Balance</h3>
            <div className="mb-4">
              <p className="text-3xl font-bold">$5,847.90</p>
              <p className="text-xs text-muted-foreground">Available</p>
            </div>
            <button className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition text-sm font-medium">
              Withdraw
            </button>
          </div>
        </div>
      </div>

      {/* Agents Table */}
      <div className="border border-border rounded-lg overflow-hidden bg-card">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold">Your Agents</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Agent Name</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Type</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Last Action</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Today</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Revenue</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => (
                <tr key={agent.id} className="border-b border-border hover:bg-secondary/50 transition">
                  <td className="py-4 px-6 text-sm font-medium">{agent.name}</td>
                  <td className="py-4 px-6 text-sm text-muted-foreground">{agent.type}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${agent.status === "active" ? "bg-green-500/10 text-green-700" : "bg-yellow-500/10 text-yellow-700"}`}
                    >
                      {agent.status === "active" ? "● Active" : "○ Idle"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-muted-foreground">{agent.lastAction}</td>
                  <td className="py-4 px-6 text-sm">{agent.actionsToday}</td>
                  <td className="py-4 px-6 text-sm font-medium">${agent.revenue.toFixed(2)}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 hover:bg-secondary rounded-md transition">
                        <Play className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-secondary rounded-md transition">
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-secondary rounded-md transition">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
