"use client"

import { MoreVertical, ArrowUpRight, Play, ShoppingCart } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"
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
        <div className="rounded-2xl p-6 bg-linear-to-br from-gray-900/50 to-gray-800/30 border border-gray-800 backdrop-blur-sm hover:border-violet-500/30 transition">
          <p className="text-sm text-gray-400 mb-2">Total Agents</p>
          <p className="text-3xl font-bold bg-linear-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">{totalAgents}</p>
          <p className="text-xs text-gray-500 mt-2">All agents</p>
        </div>
        <div className="rounded-2xl p-6 bg-linear-to-br from-gray-900/50 to-gray-800/30 border border-gray-800 backdrop-blur-sm hover:border-violet-500/30 transition">
          <p className="text-sm text-gray-400 mb-2">Active Now</p>
          <p className="text-3xl font-bold bg-linear-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">{activeAgents}</p>
          <p className="text-xs text-gray-500 mt-2">Running agents</p>
        </div>
        <div className="rounded-2xl p-6 bg-linear-to-br from-gray-900/50 to-gray-800/30 border border-gray-800 backdrop-blur-sm hover:border-violet-500/30 transition">
          <p className="text-sm text-gray-400 mb-2">Today's Actions</p>
          <p className="text-3xl font-bold bg-linear-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">{totalActions}</p>
          <p className="text-xs text-gray-500 mt-2">24 hour period</p>
        </div>
        <div className="rounded-2xl p-6 bg-linear-to-br from-gray-900/50 to-gray-800/30 border border-gray-800 backdrop-blur-sm hover:border-violet-500/30 transition">
          <p className="text-sm text-gray-400 mb-2">Revenue</p>
          <p className="text-3xl font-bold bg-linear-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">${totalRevenue.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-2">Total earned</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Feed */}
        <motion.div layout className="lg:col-span-2 rounded-2xl p-6 bg-linear-to-br from-gray-900/50 to-gray-800/30 border border-gray-800 backdrop-blur-sm">
          <motion.h2 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="text-lg font-semibold mb-6">Activity Feed</motion.h2>
          <div className="space-y-4">
            {mockActivities.map((activity, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35, delay: i * 0.05 }} className="flex items-center justify-between py-4 border-b border-gray-800 last:border-b-0">
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{activity.agent}</p>
                  <p className="text-xs text-gray-400">{activity.action}</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded ${activity.type === "success" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}
                >
                  {activity.type === "success" ? "✓" : "✕"} {activity.type}
                </span>
                <p className="text-xs text-gray-400 ml-4">{activity.time}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="rounded-2xl p-6 bg-linear-to-br from-gray-900/50 to-gray-800/30 border border-gray-800 backdrop-blur-sm">
            <h3 className="text-sm font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link
                href="/builder"
                className="flex items-center justify-between p-3 rounded-md border border-gray-700 hover:bg-gray-800 transition text-sm font-medium text-white"
              >
                <span>Create New Agent</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard/marketplace"
                className="flex items-center justify-between p-3 rounded-md border border-gray-700 hover:bg-gray-800 transition text-sm font-medium text-white"
              >
                <span>Browse Marketplace</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard/analytics"
                className="flex items-center justify-between p-3 rounded-md border border-gray-700 hover:bg-gray-800 transition text-sm font-medium text-white"
              >
                <span>View Analytics</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="rounded-2xl p-6 bg-linear-to-br from-gray-900/50 to-gray-800/30 border border-gray-800 backdrop-blur-sm">
            <h3 className="text-sm font-semibold mb-4">Account Balance</h3>
            <div className="mb-4">
              <p className="text-3xl font-bold text-white">$5,847.90</p>
              <p className="text-xs text-gray-400">Available</p>
            </div>
            <button className="w-full py-2 px-4 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition text-sm font-medium">
              Withdraw
            </button>
          </motion.div>
        </div>
      </div>

      {/* Agents Table */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="rounded-2xl overflow-hidden bg-linear-to-br from-gray-900/50 to-gray-800/30 border border-gray-800 backdrop-blur-sm">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-white">Your Agents</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Agent Name</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Type</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Status</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Last Action</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Today</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Revenue</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent, index) => (
                <motion.tr key={agent.id} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
                  <td className="py-4 px-6 text-sm font-medium text-white">{agent.name}</td>
                  <td className="py-4 px-6 text-sm text-gray-300">{agent.type}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${agent.status === "active" ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"}`}
                    >
                      {agent.status === "active" ? "● Active" : "○ Idle"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-400">{agent.lastAction}</td>
                  <td className="py-4 px-6 text-sm text-white">{agent.actionsToday}</td>
                  <td className="py-4 px-6 text-sm font-medium text-white">${agent.revenue.toFixed(2)}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 hover:bg-gray-800 rounded-md transition text-gray-400 hover:text-white">
                        <Play className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-800 rounded-md transition text-gray-400 hover:text-white">
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-800 rounded-md transition text-gray-400 hover:text-white">
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
