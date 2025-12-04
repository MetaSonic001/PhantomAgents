"use client"

import { MoreVertical, ArrowUpRight, Play, ShoppingCart, Zap, DollarSign } from "lucide-react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { agentApi, demoApi } from "@/lib/api-client"
import { toast } from "@/components/toast"
import { getLocalAgents } from "@/lib/local-agents"

const DEMO_AGENTS = [
  {
    id: "agent_crypto_trader",
    name: "Crypto Trader Pro",
    status: "active",
    lastAction: "5 mins ago",
    actionsToday: 24,
    revenue: 2376,
    type: "Trading Agent",
  },
  {
    id: "agent_market_oracle",
    name: "Market Oracle",
    status: "active",
    lastAction: "12 mins ago",
    actionsToday: 18,
    revenue: 890,
    type: "Prediction Oracle",
  },
  {
    id: "agent_governance",
    name: "Governance Voter",
    status: "idle",
    lastAction: "1 hour ago",
    actionsToday: 4,
    revenue: 588,
    type: "Governance Delegate",
  },
]

export default function DashboardPage() {
  const [agents, setAgents] = useState<any[]>([])
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [demoLoading, setDemoLoading] = useState(false)

  useEffect(() => {
    async function loadDashboardData() {
      try {
        // Load agents
        const response = await agentApi.getAll().catch(() => ({ agents: [] }))
        const agentsList = response.agents || []

        // Map backend agents to dashboard format
        const mappedFromApi = agentsList.map((agent: any) => ({
          id: agent.id,
          name: agent.name,
          status: agent.status === "registered" ? "active" : "idle",
          lastAction: "2 mins ago",
          actionsToday: agent.action_count || 0,
          revenue: agent.revenue || 0,
          type: agent.description || "AI Agent",
        }))

        // Merge local agents created via builder
        const local = getLocalAgents().map((local) => ({
          id: local.id,
          name: local.agentData.name,
          status: "active",
          lastAction: "Just now",
          actionsToday: 0,
          revenue: 0,
          type: local.agentData.type || "AI Agent",
        }))

        const combined = [...mappedFromApi, ...local]
        setAgents(combined.length ? combined : DEMO_AGENTS)

        // Load recent activities from backend
        const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"
        try {
          // Get actions from all agents
          const activityPromises = combined.slice(0, 3).map(async (agent: any) => {
            try {
              const actResponse = await fetch(`${BASE_URL}/agents/${agent.id}/actions`)
              if (actResponse.ok) {
                const actData = await actResponse.json()
                return actData.actions?.slice(0, 2).map((action: any) => ({
                  agent: agent.name,
                  action: action.type || action.output || "Action executed",
                  type: "success",
                  time: action.timestamp || "Recently",
                })) || []
              }
            } catch (e) {
              return []
            }
            return []
          })
          
          const activityArrays = await Promise.all(activityPromises)
          const recentActivities = activityArrays.flat().slice(0, 5)
          
          // If no activities from backend, show demo data
          if (recentActivities.length === 0) {
            setActivities([
              { agent: "Demo Agent", action: "System initialized", type: "success", time: "Just now" },
              { agent: "System", action: "Backend connected", type: "success", time: "Recently" },
            ])
          } else {
            setActivities(recentActivities)
          }
        } catch (error) {
          console.error("Failed to load activities:", error)
          setActivities([])
        }
      } catch (error) {
        console.error("Failed to load agents:", error)
        // Fallback to demo + local-only agents
        const local = getLocalAgents().map((local) => ({
          id: local.id,
          name: local.agentData.name,
          status: "active",
          lastAction: "Just now",
          actionsToday: 0,
          revenue: 0,
          type: local.agentData.type || "AI Agent",
        }))
        const combined = [...local, ...DEMO_AGENTS]
        setAgents(combined)
        setActivities([
          { agent: "System", action: "Using offline demo data", type: "success", time: "Just now" },
        ])
        toast.warning("Backend unavailable. Showing demo data.")
      } finally {
        setLoading(false)
      }
    }
    loadDashboardData()
  }, [])

  const refreshDashboard = async () => {
    setLoading(true)
    try {
      const response = await agentApi.getAll().catch(() => ({ agents: [] }))
      const agentsList = response.agents || []
      const mappedFromApi = agentsList.map((agent: any) => ({
        id: agent.id,
        name: agent.name,
        status: agent.status === "registered" ? "active" : "idle",
        lastAction: "2 mins ago",
        actionsToday: agent.action_count || 0,
        revenue: agent.revenue || 0,
        type: agent.description || "AI Agent",
      }))
      const local = getLocalAgents().map((local) => ({
        id: local.id,
        name: local.agentData.name,
        status: "active",
        lastAction: "Just now",
        actionsToday: 0,
        revenue: 0,
        type: local.agentData.type || "AI Agent",
      }))
      const combined = [...mappedFromApi, ...local]
      setAgents(combined.length ? combined : DEMO_AGENTS)
      toast.success("Dashboard refreshed!")
    } catch (error) {
      console.error("Failed to refresh:", error)
      toast.error("Failed to refresh dashboard")
    } finally {
      setLoading(false)
    }
  }

  const handleDemoAction = async (agentId: string) => {
    if (demoLoading) return
    setDemoLoading(true)
    try {
      const result = await demoApi.simulateAction(agentId, "signal")
      toast.success(result.message || "Demo action executed!")
      await refreshDashboard()
    } catch (error: any) {
      console.error("Demo action failed:", error)
      toast.error(error.message || "Failed to execute demo action")
    } finally {
      setDemoLoading(false)
    }
  }

  const handleAddRevenue = async (agentId: string, amount: number) => {
    if (demoLoading) return
    setDemoLoading(true)
    try {
      const result = await demoApi.addRevenue(agentId, amount)
      toast.success(result.message || `Added $${amount} revenue!`)
      await refreshDashboard()
    } catch (error: any) {
      console.error("Add revenue failed:", error)
      toast.error(error.message || "Failed to add revenue")
    } finally {
      setDemoLoading(false)
    }
  }

  const totalAgents = agents.length
  const activeAgents = agents.filter((a) => a.status === "active").length
  const totalRevenue = agents.reduce((sum, a) => sum + a.revenue, 0)
  const totalActions = agents.reduce((sum, a) => sum + a.actionsToday, 0)

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="rounded-2xl p-6 bg-card border border-border hover:border-violet-500/30 transition">
          <p className="text-sm text-muted-foreground mb-2">Total Agents</p>
          <p className="text-3xl font-bold bg-linear-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">{totalAgents}</p>
          <p className="text-xs text-muted-foreground mt-2">All agents</p>
        </div>
        <div className="rounded-2xl p-6 bg-card border border-border hover:border-violet-500/30 transition">
          <p className="text-sm text-muted-foreground mb-2">Active Now</p>
          <p className="text-3xl font-bold bg-linear-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">{activeAgents}</p>
          <p className="text-xs text-muted-foreground mt-2">Running agents</p>
        </div>
        <div className="rounded-2xl p-6 bg-card border border-border hover:border-violet-500/30 transition">
          <p className="text-sm text-muted-foreground mb-2">Today's Actions</p>
          <p className="text-3xl font-bold bg-linear-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">{totalActions}</p>
          <p className="text-xs text-muted-foreground mt-2">24 hour period</p>
        </div>
        <div className="rounded-2xl p-6 bg-card border border-border hover:border-violet-500/30 transition">
          <p className="text-sm text-muted-foreground mb-2">Revenue</p>
          <p className="text-3xl font-bold bg-linear-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">${totalRevenue.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-2">Total earned</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Feed */}
        <motion.div layout className="lg:col-span-2 rounded-2xl p-6 bg-card border border-border">
          <motion.h2 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="text-lg font-semibold mb-6">Activity Feed</motion.h2>
          <div className="space-y-4">
            {activities.length > 0 ? activities.map((activity, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35, delay: i * 0.05 }} className="flex items-center justify-between py-4 border-b border-border last:border-b-0">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{activity.agent}</p>
                  <p className="text-xs text-muted-foreground">{activity.action}</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded ${activity.type === "success" ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"}`}
                >
                  {activity.type === "success" ? "✓" : "✕"} {activity.type}
                </span>
                <p className="text-xs text-muted-foreground ml-4">{activity.time}</p>
              </motion.div>
            )) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No recent activities</p>
                <p className="text-xs mt-2">Run an agent to see activity here</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="rounded-2xl p-6 bg-card border border-border">
            <h3 className="text-sm font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link
                href="/builder"
                className="flex items-center justify-between p-3 rounded-md border border-border hover:bg-secondary transition text-sm font-medium text-foreground"
              >
                <span>Create New Agent</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard/marketplace"
                className="flex items-center justify-between p-3 rounded-md border border-border hover:bg-secondary transition text-sm font-medium text-foreground"
              >
                <span>Browse Marketplace</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard/analytics"
                className="flex items-center justify-between p-3 rounded-md border border-border hover:bg-secondary transition text-sm font-medium text-foreground"
              >
                <span>View Analytics</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="rounded-2xl p-6 bg-card border border-border">
            <h3 className="text-sm font-semibold mb-4">Earnings Overview</h3>
            <div className="mb-4">
              <p className="text-3xl font-bold text-foreground">${totalRevenue.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">Total Revenue</p>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
              <div>
                <p className="text-xs text-muted-foreground">Active Agents</p>
                <p className="text-lg font-bold text-foreground">{activeAgents}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Actions</p>
                <p className="text-lg font-bold text-foreground">{totalActions}</p>
              </div>
            </div>
          </motion.div>

          {/* Demo Controls */}
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="rounded-2xl p-6 bg-linear-to-br from-violet-500/10 to-indigo-500/10 border border-violet-500/20">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-violet-400" />
              <h3 className="text-sm font-semibold">Demo Controls</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-4">Simulate agent actions and revenue to see live updates</p>
            
            {agents.length > 0 ? (
              <div className="space-y-3">
                {agents.slice(0, 2).map((agent) => (
                  <div key={agent.id} className="p-3 rounded-lg bg-card/50 border border-border">
                    <p className="text-xs font-medium mb-2 truncate">{agent.name}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDemoAction(agent.id)}
                        disabled={demoLoading}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Zap className="w-3 h-3" />
                        Run Action
                      </button>
                      <button
                        onClick={() => handleAddRevenue(agent.id, 25)}
                        disabled={demoLoading}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <DollarSign className="w-3 h-3" />
                        +$25
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={refreshDashboard}
                  disabled={loading}
                  className="w-full py-2 px-3 bg-secondary border border-border rounded-md hover:bg-secondary/80 transition text-xs font-medium disabled:opacity-50"
                >
                  {loading ? "Refreshing..." : "Refresh Dashboard"}
                </button>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-4">Create an agent to use demo controls</p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Agents Table */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="rounded-2xl overflow-hidden bg-card border border-border">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Your Agents</h2>
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
              {agents.map((agent, index) => (
                <motion.tr key={agent.id} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }} className="border-b border-border hover:bg-secondary/50 transition">
                  <td className="py-4 px-6 text-sm font-medium text-foreground">{agent.name}</td>
                  <td className="py-4 px-6 text-sm text-muted-foreground">{agent.type}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${agent.status === "active" ? "bg-green-500/10 text-green-600" : "bg-yellow-500/10 text-yellow-600"}`}
                    >
                      {agent.status === "active" ? "● Active" : "○ Idle"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-muted-foreground">{agent.lastAction}</td>
                  <td className="py-4 px-6 text-sm text-foreground">{agent.actionsToday}</td>
                  <td className="py-4 px-6 text-sm font-medium text-foreground">${agent.revenue.toFixed(2)}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 hover:bg-secondary rounded-md transition text-muted-foreground hover:text-foreground">
                        <Play className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-secondary rounded-md transition text-muted-foreground hover:text-foreground">
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-secondary rounded-md transition text-muted-foreground hover:text-foreground">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
