"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Grid2x2, List, MoreVertical, Play, Pause, Trash2, Share2, Eye } from "lucide-react"
import { signMessageNormalized } from "@/lib/starknet-sign"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import WalletConnector from "@/components/wallet-connector"

const mockUserAgents = [
  {
    id: "1",
    name: "Crypto Trader Pro",
    type: "Trading Agent",
    status: "active",
    created: "2 weeks ago",
    lastModified: "3 days ago",
    performance: "+22.5%",
    subscribers: 24,
    revenue: 2376.0,
    private: false,
  },
  {
    id: "2",
    name: "Market Analysis Bot",
    type: "Research Assistant",
    status: "inactive",
    created: "1 month ago",
    lastModified: "1 week ago",
    performance: "-",
    subscribers: 0,
    revenue: 0,
    private: true,
  },
  {
    id: "3",
    name: "Governance Voter",
    type: "Governance Delegate",
    status: "active",
    created: "3 weeks ago",
    lastModified: "2 days ago",
    performance: "+15.2%",
    subscribers: 12,
    revenue: 588.0,
    private: false,
  },
]

export default function MyAgentsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const mockConnected = typeof window !== "undefined" && !!localStorage.getItem("phantom.mock.connected")
  const account = mockConnected ? "demo_user_account" : null
  const address = mockConnected ? "0xdemo_user_addr" : null

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto">
          <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">My Agents</h1>
                <p className="text-muted-foreground">Manage and monitor your created agents</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden md:block">
                  <WalletConnector />
                </div>
                <Link
                  href="/builder"
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition font-medium"
                >
                  <Plus className="w-4 h-4" />
                  New Agent
                </Link>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">{mockUserAgents.length} agents</div>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition ${viewMode === "grid" ? "bg-secondary" : "hover:bg-secondary"}`}
                >
                  <Grid2x2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition ${viewMode === "list" ? "bg-secondary" : "hover:bg-secondary"}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Agents Grid View */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockUserAgents.map((agent) => (
                  <div
                    key={agent.id}
                    className="border border-border rounded-lg overflow-hidden hover:border-accent transition group bg-card cursor-pointer"
                    onClick={() => setSelectedAgent(agent.id)}
                  >
                    {/* Card Header */}
                    <div className="p-6 border-b border-border">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-12 h-12 rounded-lg bg-muted"></div>
                        <button className="p-1.5 hover:bg-secondary rounded-md opacity-0 group-hover:opacity-100 transition">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                      <h3 className="font-semibold text-base mb-1">{agent.name}</h3>
                      <p className="text-xs text-muted-foreground">{agent.type}</p>
                    </div>

                    {/* Stats */}
                    <div className="p-6 space-y-3">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-xs text-muted-foreground">On-chain ID</div>
                        <div>
                          <button
                            onClick={async (e) => {
                              e.stopPropagation()
                              // Use mock connector to sign an attestation
                              if (!account && !address) {
                                alert("Connect mock wallet (top-right) before signing")
                                return
                              }

                              try {
                                const message = JSON.stringify({ action: "attest-agent", agentId: agent.id, ts: Date.now() })
                                const sig = await signMessageNormalized(account ?? address, message)
                                const key = "phantom.agent.signatures"
                                const existing = JSON.parse(localStorage.getItem(key) || "{}")
                                existing[agent.id] = { signature: sig, ts: Date.now() }
                                localStorage.setItem(key, JSON.stringify(existing))
                                alert("Signed agent attestation (mock) and saved locally")
                              } catch (err) {
                                console.error(err)
                                alert("Signing failed: " + String(err))
                              }
                            }}
                            className="px-2 py-1 text-xs border rounded-md"
                          >
                            Sign
                          </button>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">On-chain ID: <span className="font-mono">0xabc...{agent.id}</span></div>
                      <div className="text-xs text-muted-foreground">Status: <span className="font-mono">{agent.status}</span></div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Status</span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            agent.status === "active"
                              ? "bg-green-500/10 text-green-700"
                              : "bg-yellow-500/10 text-yellow-700"
                          }`}
                        >
                          {agent.status === "active" ? "● Active" : "○ Inactive"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Performance</span>
                        <span className="text-sm font-medium text-primary">{agent.performance}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Subscribers</span>
                        <span className="text-sm font-medium">{agent.subscribers}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-border">
                        <span className="text-xs text-muted-foreground">Revenue</span>
                        <span className="text-sm font-bold">${agent.revenue.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="px-6 py-4 border-t border-border flex gap-2">
                      <button className="flex-1 py-2 px-3 rounded-md border border-border hover:bg-secondary transition text-sm font-medium flex items-center justify-center gap-2">
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      <button className="flex-1 py-2 px-3 rounded-md border border-border hover:bg-secondary transition text-sm font-medium flex items-center justify-center gap-2">
                        <Share2 className="w-4 h-4" />
                        Deploy
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Agents List View */}
            {viewMode === "list" && (
              <div className="border border-border rounded-lg overflow-hidden bg-card">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Name</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Type</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Performance</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Subscribers</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Revenue</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockUserAgents.map((agent) => (
                      <tr key={agent.id} className="border-b border-border hover:bg-secondary/50 transition">
                        <td className="py-4 px-6">
                          <div>
                            <p className="text-sm font-medium">{agent.name}</p>
                            <p className="text-xs text-muted-foreground">{agent.lastModified}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm">{agent.type}</td>
                        <td className="py-4 px-6">
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium inline-block ${
                              agent.status === "active"
                                ? "bg-green-500/10 text-green-700"
                                : "bg-yellow-500/10 text-yellow-700"
                            }`}
                          >
                            {agent.status === "active" ? "● Active" : "○ Inactive"}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm font-medium text-primary">{agent.performance}</td>
                        <td className="py-4 px-6 text-sm">{agent.subscribers}</td>
                        <td className="py-4 px-6 text-sm font-medium">${agent.revenue.toFixed(2)}</td>
                        <td className="py-4 px-6">
                          <div className="flex gap-2">
                            <button className="p-1.5 hover:bg-secondary rounded-md transition">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 hover:bg-secondary rounded-md transition">
                              {agent.status === "active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </button>
                            <button className="p-1.5 hover:bg-secondary rounded-md transition text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
