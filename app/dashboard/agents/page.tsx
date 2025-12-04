"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Grid2x2, List, MoreVertical, Play, Pause, Trash2, Share2, Eye } from "lucide-react"
import { signMessageNormalized } from "@/lib/starknet-sign"
import Animated from "@/components/Animated"
import AmbientBackground from "@/components/ambient"
import { motion } from "framer-motion"

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
    <div className="relative min-h-screen bg-background">
      <AmbientBackground />
      <Animated className="p-8 space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">My Agents</h1>
            <p className="text-muted-foreground">Manage and monitor your created agents</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              {/* WalletConnector */}
            </div>
            <Link
              href="/builder"
              className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-violet-600 to-indigo-600 text-white rounded-md hover:opacity-90 transition font-medium"
            >
              <Plus className="w-4 h-4" />
              New Agent
            </Link>
          </div>
        </motion.div>

            {/* Controls */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="flex items-center justify-between">
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
            </motion.div>

            {/* Agents Grid View */}
            {viewMode === "grid" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockUserAgents.map((agent, index) => (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="rounded-2xl overflow-hidden hover:border-violet-500/30 transition group bg-card border border-border backdrop-blur-sm cursor-pointer"
                    onClick={() => setSelectedAgent(agent.id)}
                  >
                    {/* Card Header */}
                    <div className="p-6 border-b border-border">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-12 h-12 rounded-lg bg-secondary"></div>
                        <button className="p-1.5 hover:bg-secondary rounded-md opacity-0 group-hover:opacity-100 transition">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                      <h3 className="font-semibold text-base mb-1 text-foreground">{agent.name}</h3>
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
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Agents List View */}
            {viewMode === "list" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="rounded-2xl overflow-hidden bg-card border border-border backdrop-blur-sm">
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
                    {mockUserAgents.map((agent, index) => (
                      <motion.tr
                        key={agent.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="border-b border-border hover:bg-secondary/50 transition"
                      >
                        <td className="py-4 px-6">
                          <div>
                            <p className="text-sm font-medium text-foreground">{agent.name}</p>
                            <p className="text-xs text-muted-foreground">{agent.lastModified}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-muted-foreground">{agent.type}</td>
                        <td className="py-4 px-6">
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium inline-block ${
                              agent.status === "active"
                                ? "bg-green-500/10 text-green-600"
                                : "bg-yellow-500/10 text-yellow-600"
                            }`}
                          >
                            {agent.status === "active" ? "● Active" : "○ Inactive"}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm font-medium text-primary">{agent.performance}</td>
                        <td className="py-4 px-6 text-sm text-foreground">{agent.subscribers}</td>
                        <td className="py-4 px-6 text-sm font-medium text-foreground">${agent.revenue.toFixed(2)}</td>
                        <td className="py-4 px-6">
                          <div className="flex gap-2">
                            <button className="p-1.5 hover:bg-secondary rounded-md transition text-muted-foreground hover:text-foreground">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 hover:bg-secondary rounded-md transition text-muted-foreground hover:text-foreground">
                              {agent.status === "active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </button>
                            <button className="p-1.5 hover:bg-secondary rounded-md transition text-red-600 hover:text-red-500">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}
      </Animated>
    </div>
  )
}
