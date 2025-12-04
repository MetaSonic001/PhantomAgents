"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { BarChart3, TrendingUp, Zap, DollarSign } from "lucide-react"

export default function UsagePage() {
  const [timeframe, setTimeframe] = useState("month")

  const usage = {
    month: {
      apiCalls: { used: 45234, limit: 100000, percentage: 45 },
      agents: { used: 12, limit: 50, percentage: 24 },
      storage: { used: 2.4, limit: 10, percentage: 24 },
      executions: { used: 1234, limit: 5000, percentage: 25 },
      cost: { used: 234.56, limit: 1000, percentage: 23 },
    },
    year: {
      apiCalls: { used: 524000, limit: 1200000, percentage: 44 },
      agents: { used: 12, limit: 50, percentage: 24 },
      storage: { used: 2.4, limit: 10, percentage: 24 },
      executions: { used: 15000, limit: 60000, percentage: 25 },
      cost: { used: 2800, limit: 12000, percentage: 23 },
    },
  }

  const current = usage[timeframe as keyof typeof usage]

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">Usage & Billing</h1>
                <p className="text-gray-400">Monitor your resource consumption</p>
              </div>
              <div className="flex gap-2">
                {["month", "year"].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      timeframe === tf ? "bg-violet-600 text-white" : "bg-gray-800/30 hover:bg-gray-800/80 text-gray-300"
                    }`}
                  >
                    {tf === "month" ? "This Month" : "This Year"}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              {[
                {
                  title: "API Calls",
                  icon: BarChart3,
                  data: current.apiCalls,
                  color: "text-blue-600",
                  bgColor: "bg-blue-500/10",
                },
                {
                  title: "Active Agents",
                  icon: Zap,
                  data: current.agents,
                  color: "text-yellow-600",
                  bgColor: "bg-yellow-500/10",
                },
                {
                  title: "Storage",
                  icon: BarChart3,
                  data: { ...current.storage, used: current.storage.used, limit: current.storage.limit },
                  color: "text-green-600",
                  bgColor: "bg-green-500/10",
                },
                {
                  title: "Executions",
                  icon: TrendingUp,
                  data: current.executions,
                  color: "text-purple-600",
                  bgColor: "bg-purple-500/10",
                },
                {
                  title: "Costs",
                  icon: DollarSign,
                  data: current.cost,
                  color: "text-red-600",
                  bgColor: "bg-red-500/10",
                },
              ].map((item, idx) => (
                <div key={idx} className="border border-gray-800 rounded-lg p-4 bg-linear-to-br from-gray-900/50 to-gray-800/30">
                  <div className={`p-2 rounded-lg ${item.bgColor} w-fit mb-3`}>
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <p className="text-xs text-gray-400 mb-1">{item.title}</p>
                  <p className="text-lg font-semibold mb-3">
                    {typeof item.data.used === "number" && item.data.used.toLocaleString()}
                    {item.title === "Storage" ? " GB" : item.title === "Costs" ? "" : ""}
                  </p>
                  <div className="bg-muted rounded-full h-2 mb-2">
                    <div
                      className="bg-violet-500 rounded-full h-2 transition-all"
                      style={{ width: `${Math.min(item.data.percentage, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-400">{item.data.percentage}% of limit used</p>
                </div>
              ))}
            </div>

            {/* Detailed Table */}
            <div className="border border-gray-800 rounded-lg bg-linear-to-br from-gray-900/50 to-gray-800/30 overflow-hidden">
              <div className="p-6 border-b border-border">
                <h2 className="text-xl font-semibold">Resource Details</h2>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 bg-gray-800/30">
                    <th className="px-6 py-3 text-left font-semibold">Resource</th>
                    <th className="px-6 py-3 text-left font-semibold">Used</th>
                    <th className="px-6 py-3 text-left font-semibold">Limit</th>
                    <th className="px-6 py-3 text-left font-semibold">Usage %</th>
                    <th className="px-6 py-3 text-left font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      name: "API Calls",
                      used: `${current.apiCalls.used.toLocaleString()}`,
                      limit: `${current.apiCalls.limit.toLocaleString()}`,
                    },
                    {
                      name: "Agent Executions",
                      used: `${current.executions.used.toLocaleString()}`,
                      limit: `${current.executions.limit.toLocaleString()}`,
                    },
                    { name: "Active Agents", used: `${current.agents.used}`, limit: `${current.agents.limit}` },
                    { name: "Storage", used: `${current.storage.used} GB`, limit: `${current.storage.limit} GB` },
                    { name: "Monthly Costs", used: `$${current.cost.used}`, limit: `$${current.cost.limit}` },
                  ].map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-800 hover:bg-gray-800/20 transition">
                      <td className="px-6 py-3 font-medium">{row.name}</td>
                      <td className="px-6 py-3">{row.used}</td>
                      <td className="px-6 py-3">{row.limit}</td>
                      <td className="px-6 py-3">{Math.round(((idx + 1) * 25) / 5)}%</td>
                      <td className="px-6 py-3">
                        <span className="px-2 py-1 bg-green-500/10 text-green-600 rounded text-xs font-medium">
                          Healthy
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
