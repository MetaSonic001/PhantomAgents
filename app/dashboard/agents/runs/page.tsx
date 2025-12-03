"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Badge } from "@/components/ui/badge"
import { Download, Eye, Trash2, Filter } from "lucide-react"

export default function AgentRunsPage() {
  const [statusFilter, setStatusFilter] = useState("all")

  const runs = [
    {
      id: "run_001",
      agent: "Trading Signal Bot",
      timestamp: "2024-12-03 14:32:01",
      status: "success",
      duration: "1.24s",
      input: { market: "crypto", symbols: ["BTC", "ETH"] },
      output: { signal: "BUY", confidence: 0.92 },
      cost: "$0.012",
    },
    {
      id: "run_002",
      agent: "Market Analysis",
      timestamp: "2024-12-03 13:15:45",
      status: "success",
      duration: "3.87s",
      input: { period: "1h", indicators: ["RSI", "MACD"] },
      output: { analysis: "Bullish momentum", score: 8.5 },
      cost: "$0.045",
    },
    {
      id: "run_003",
      agent: "Risk Monitor",
      timestamp: "2024-12-03 12:08:22",
      status: "error",
      duration: "0.45s",
      input: { portfolio: "main" },
      output: { error: "API timeout" },
      cost: "$0.005",
    },
    {
      id: "run_004",
      agent: "Research Agent",
      timestamp: "2024-12-03 11:22:10",
      status: "pending",
      duration: "—",
      input: { query: "AI market trends" },
      output: null,
      cost: "$0.000",
    },
  ]

  const filteredRuns = statusFilter === "all" ? runs : runs.filter((r) => r.status === statusFilter)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Agent Runs</h1>
              <p className="text-muted-foreground">View execution history and logs</p>
            </div>

            <div className="mb-6 flex gap-3">
              <button className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-secondary transition text-sm">
                <Filter className="w-4 h-4" />
                Filter
              </button>
              <div className="flex gap-2">
                {["all", "success", "error", "pending"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                      statusFilter === status
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary hover:bg-secondary/80"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="border border-border rounded-lg overflow-hidden bg-card">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="px-6 py-3 text-left font-semibold">Agent</th>
                    <th className="px-6 py-3 text-left font-semibold">Timestamp</th>
                    <th className="px-6 py-3 text-left font-semibold">Status</th>
                    <th className="px-6 py-3 text-left font-semibold">Duration</th>
                    <th className="px-6 py-3 text-left font-semibold">Cost</th>
                    <th className="px-6 py-3 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRuns.map((run) => (
                    <tr key={run.id} className="border-b border-border hover:bg-secondary/20 transition">
                      <td className="px-6 py-3">
                        <p className="font-medium">{run.agent}</p>
                        <p className="text-xs text-muted-foreground">{run.id}</p>
                      </td>
                      <td className="px-6 py-3 text-xs">{run.timestamp}</td>
                      <td className="px-6 py-3">
                        <Badge
                          variant={
                            run.status === "success" ? "default" : run.status === "error" ? "destructive" : "secondary"
                          }
                        >
                          {run.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-3 text-xs">{run.duration}</td>
                      <td className="px-6 py-3 font-medium text-xs">{run.cost}</td>
                      <td className="px-6 py-3">
                        <div className="flex gap-2">
                          <button className="p-1.5 hover:bg-secondary rounded-lg transition" title="View details">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 hover:bg-secondary rounded-lg transition" title="Download logs">
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1.5 hover:bg-destructive/10 rounded-lg transition text-destructive"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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
