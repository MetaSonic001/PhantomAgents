"use client"

import { useState } from "react"
import { FileText, CheckCircle2, Clock, Share2 } from "lucide-react"

export default function ResearchAgentsPage() {
  const [researchAgents] = useState([
    {
      id: 1,
      name: "Crypto Market Research",
      description: "Multi-source aggregation and analysis for cryptocurrency markets",
      status: "active",
      progress: 87,
      sources: 47,
      citations: 234,
      accuracy: 94.2,
      lastUpdated: "5 mins ago",
    },
    {
      id: 2,
      name: "Tech Sector Analyst",
      description: "Deep research into technology companies and market trends",
      status: "active",
      progress: 72,
      sources: 52,
      citations: 189,
      accuracy: 91.5,
      lastUpdated: "2 hours ago",
    },
    {
      id: 3,
      name: "Economic Indicators",
      description: "Global economic data collection and synthesis",
      status: "idle",
      progress: 100,
      sources: 38,
      citations: 156,
      accuracy: 96.3,
      lastUpdated: "1 day ago",
    },
  ])

  const researchProcess = [
    { step: 1, name: "Data Aggregation", desc: "Scrape 50+ sources simultaneously", status: "complete" },
    { step: 2, name: "Claim Verification", desc: "Cross-check facts across sources", status: "complete" },
    { step: 3, name: "Synthesis", desc: "Combine findings into coherent reports", status: "in-progress" },
    { step: 4, name: "Refinement", desc: "Ask clarifying questions, improve output", status: "pending" },
  ]

  return (
    <div className="p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Deep Research Agents</h1>
        <p className="text-muted-foreground">
          AI-powered research with multi-source aggregation and claim verification
        </p>
      </div>

      {/* Research Agents Grid */}
      <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
        {researchAgents.map((agent) => (
          <div key={agent.id} className="border border-border rounded-lg bg-card p-6 hover:border-accent transition">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold">{agent.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{agent.description}</p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  agent.status === "active" ? "bg-green-500/10 text-green-700" : "bg-yellow-500/10 text-yellow-700"
                }`}
              >
                ● {agent.status}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-muted-foreground">Research Progress</p>
                  <p className="text-xs font-semibold">{agent.progress}%</p>
                </div>
                <div className="w-full bg-secondary/50 rounded-full h-2">
                  <div
                    className="bg-primary h-full rounded-full transition-all"
                    style={{ width: `${agent.progress}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-secondary/30 p-2 rounded">
                  <p className="text-muted-foreground">Sources</p>
                  <p className="font-semibold">{agent.sources}</p>
                </div>
                <div className="bg-secondary/30 p-2 rounded">
                  <p className="text-muted-foreground">Citations</p>
                  <p className="font-semibold">{agent.citations}</p>
                </div>
                <div className="bg-secondary/30 p-2 rounded">
                  <p className="text-muted-foreground">Accuracy</p>
                  <p className="font-semibold text-green-600">{agent.accuracy}%</p>
                </div>
              </div>

              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Updated {agent.lastUpdated}
              </div>
            </div>

            <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition font-medium text-sm">
              View Report
            </button>
          </div>
        ))}
      </div>

      {/* Research Process */}
      <div className="border border-border rounded-lg bg-card p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Research Process Pipeline
        </h2>
        <div className="space-y-3">
          {researchProcess.map((item, idx) => (
            <div key={idx} className="flex items-start gap-4 pb-4 border-b border-border last:border-b-0">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  item.status === "complete"
                    ? "bg-green-500/10 text-green-700"
                    : item.status === "in-progress"
                      ? "bg-blue-500/10 text-blue-700"
                      : "bg-secondary/50 text-muted-foreground"
                }`}
              >
                {item.status === "complete" ? <CheckCircle2 className="w-5 h-5" /> : item.step}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
              <span className="text-xs font-semibold px-2 py-1 bg-secondary/50 rounded">{item.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Export Formats */}
      <div className="border border-border rounded-lg bg-card p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Share2 className="w-5 h-5" />
          Export Formats
        </h2>
        <div className="grid md:grid-cols-4 gap-3">
          {["PDF", "DOCX", "Notion", "Confluence"].map((format) => (
            <button
              key={format}
              className="px-4 py-3 border border-border rounded-lg hover:bg-secondary transition font-medium"
            >
              Export as {format}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
