"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Network, GitBranch, Star, Shield } from "lucide-react"

export default function AgentNetworkPage() {
  const [agents] = useState([
    {
      id: 1,
      name: "Crypto Trader Pro",
      category: "Trading",
      reputation: 4.8,
      reviews: 234,
      protocols: ["MCP", "A2A", "OpenAPI"],
      connections: 45,
      successRate: 94.2,
      image: "📈",
    },
    {
      id: 2,
      name: "Research Scholar",
      category: "Research",
      reputation: 4.6,
      reviews: 156,
      protocols: ["A2A", "OpenAPI"],
      connections: 32,
      successRate: 91.5,
      image: "📊",
    },
    {
      id: 3,
      name: "DAO Governor",
      category: "Governance",
      reputation: 4.9,
      reviews: 189,
      protocols: ["MCP", "A2A"],
      connections: 56,
      successRate: 96.3,
      image: "🏛️",
    },
    {
      id: 4,
      name: "Content Generator",
      category: "Content",
      reputation: 4.5,
      reviews: 98,
      protocols: ["OpenAPI"],
      connections: 28,
      successRate: 89.1,
      image: "✍️",
    },
  ])

  const workflowChains = [
    {
      id: 1,
      name: "Research to Trading Pipeline",
      agents: ["Research Scholar", "Crypto Trader Pro"],
      status: "active",
      success: 92.5,
      lastRun: "5 mins ago",
    },
    {
      id: 2,
      name: "Governance Analysis Flow",
      agents: ["DAO Governor", "Research Scholar"],
      status: "active",
      success: 88.3,
      lastRun: "2 hours ago",
    },
  ]

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto">
          <div className="p-8 space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Agent Network</h1>
              <p className="text-muted-foreground">Discover and collaborate with other agents using standard protocols</p>
            </div>

            {/* Network Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="border border-border rounded-lg p-4 bg-card">
                <p className="text-xs text-muted-foreground mb-1">Total Agents</p>
                <p className="text-3xl font-bold">1,247</p>
              </div>
              <div className="border border-border rounded-lg p-4 bg-card">
                <p className="text-xs text-muted-foreground mb-1">Active Connections</p>
                <p className="text-3xl font-bold">3,892</p>
              </div>
              <div className="border border-border rounded-lg p-4 bg-card">
                <p className="text-xs text-muted-foreground mb-1">Daily Workflows</p>
                <p className="text-3xl font-bold">542</p>
              </div>
              <div className="border border-border rounded-lg p-4 bg-card">
                <p className="text-xs text-muted-foreground mb-1">Network Health</p>
                <p className="text-3xl font-bold text-green-600">99.8%</p>
              </div>
            </div>

            {/* Protocol Standards */}
            <div className="border border-border rounded-lg bg-card p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Protocol Standards
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  {
                    name: "Model Context Protocol",
                    code: "MCP",
                    desc: "Standardized context sharing between agents",
                    agents: 892,
                  },
                  {
                    name: "Agent-to-Agent Protocol",
                    code: "A2A",
                    desc: "Direct peer-to-peer communication framework",
                    agents: 1043,
                  },
                  {
                    name: "OpenAPI Standards",
                    code: "OpenAPI",
                    desc: "RESTful API compatibility layer",
                    agents: 756,
                  },
                ].map((protocol, idx) => (
                  <div key={idx} className="border border-border rounded-lg p-4 hover:border-accent transition">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold">{protocol.name}</p>
                        <p className="text-xs text-muted-foreground">{protocol.code}</p>
                      </div>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{protocol.agents} agents</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{protocol.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Agent Discovery */}
            <div className="border border-border rounded-lg bg-card p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Network className="w-5 h-5" />
                Discoverable Agents
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {agents.map((agent) => (
                  <div key={agent.id} className="border border-border rounded-lg p-4 hover:border-accent transition">
                    <div className="text-4xl mb-3">{agent.image}</div>
                    <h3 className="font-semibold mb-1">{agent.name}</h3>
                    <p className="text-xs text-muted-foreground mb-3">{agent.category}</p>

                    <div className="space-y-2 mb-3 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Reputation</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                          <span className="font-semibold">{agent.reputation}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Success Rate</span>
                        <span className="font-semibold text-green-600">{agent.successRate}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Connections</span>
                        <span className="font-semibold">{agent.connections}</span>
                      </div>
                    </div>

                    <div className="flex gap-1 mb-3 flex-wrap">
                      {agent.protocols.map((proto, idx) => (
                        <span key={idx} className="text-xs bg-secondary/50 px-2 py-1 rounded">
                          {proto}
                        </span>
                      ))}
                    </div>

                    <button className="w-full px-3 py-2 border border-border rounded-md hover:bg-secondary transition text-xs font-medium">
                      Connect
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Workflow Chains */}
            <div className="border border-border rounded-lg bg-card p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <GitBranch className="w-5 h-5" />
                Active Workflow Chains
              </h2>
              <div className="space-y-4">
                {workflowChains.map((workflow) => (
                  <div key={workflow.id} className="border border-border rounded-lg p-4 hover:border-accent transition">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{workflow.name}</h3>
                        <p className="text-xs text-muted-foreground">{workflow.agents.join(" → ")}</p>
                      </div>
                      <span className="text-xs bg-green-500/10 text-green-700 px-2 py-1 rounded">● {workflow.status}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Success Rate</p>
                        <p className="font-semibold text-green-600">{workflow.success}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Last Run</p>
                        <p className="text-xs font-mono">{workflow.lastRun}</p>
                      </div>
                      <button className="px-3 py-2 border border-border rounded-md hover:bg-secondary transition text-xs font-medium h-fit">
                        View Flow
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
