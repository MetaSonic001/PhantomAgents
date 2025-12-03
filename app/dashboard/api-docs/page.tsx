"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Copy, Code2, BookOpen } from "lucide-react"

export default function ApiDocsPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState(0)
  const [copied, setCopied] = useState("")

  const endpoints = [
    {
      method: "GET",
      path: "/api/agents",
      title: "List Agents",
      description: "Retrieve all your agents with pagination support",
      params: [
        { name: "page", type: "integer", desc: "Page number (default: 1)" },
        { name: "limit", type: "integer", desc: "Items per page (default: 20)" },
      ],
      response: {
        agents: [
          {
            id: "agent_123",
            name: "Trading Bot",
            status: "active",
            created: "2024-01-15",
          },
        ],
        total: 5,
      },
    },
    {
      method: "POST",
      path: "/api/agents",
      title: "Create Agent",
      description: "Create a new AI agent",
      params: [
        { name: "name", type: "string", desc: "Agent name (required)" },
        { name: "type", type: "string", desc: "Agent type (required)" },
        { name: "description", type: "string", desc: "Agent description" },
      ],
      response: {
        id: "agent_123",
        name: "Trading Bot",
        status: "draft",
        created: "2024-12-03",
      },
    },
    {
      method: "POST",
      path: "/api/agents/:id/execute",
      title: "Execute Agent",
      description: "Run an agent with provided input",
      params: [
        { name: "id", type: "string", desc: "Agent ID (in URL)" },
        { name: "input", type: "object", desc: "Execution input parameters" },
      ],
      response: {
        runId: "run_456",
        status: "success",
        output: { signal: "BUY", confidence: 0.92 },
        duration: "1.24s",
      },
    },
    {
      method: "GET",
      path: "/api/marketplace",
      title: "List Marketplace Agents",
      description: "Browse available agents in the marketplace",
      params: [
        { name: "category", type: "string", desc: "Filter by category" },
        { name: "sort", type: "string", desc: "Sort by: popular, newest, rating" },
      ],
      response: {
        agents: [
          {
            id: "market_789",
            name: "Advanced Trading",
            creator: "Creator Name",
            rating: 4.8,
            price: "$99/month",
          },
        ],
      },
    },
  ]

  const currentEndpoint = endpoints[selectedEndpoint]

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(text)
    setTimeout(() => setCopied(""), 2000)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">API Documentation</h1>
              <p className="text-muted-foreground">Build integrations with the PhantomAgents API</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Endpoints Sidebar */}
              <div className="lg:col-span-1">
                <div className="border border-border rounded-lg bg-card p-4 sticky top-0">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Endpoints
                  </h3>
                  <div className="space-y-2">
                    {endpoints.map((endpoint, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedEndpoint(idx)}
                        className={`w-full text-left px-3 py-2.5 rounded-lg transition text-sm ${
                          selectedEndpoint === idx
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-secondary text-muted-foreground"
                        }`}
                      >
                        <div className="font-mono text-xs font-semibold mb-1">{endpoint.method}</div>
                        <div className="text-xs line-clamp-2">{endpoint.path}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Endpoint Details */}
              <div className="lg:col-span-2 space-y-6">
                <div className="border border-border rounded-lg bg-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className={`px-3 py-1 rounded-md text-xs font-semibold text-white ${
                        currentEndpoint.method === "GET"
                          ? "bg-blue-600"
                          : currentEndpoint.method === "POST"
                            ? "bg-green-600"
                            : currentEndpoint.method === "PUT"
                              ? "bg-yellow-600"
                              : "bg-red-600"
                      }`}
                    >
                      {currentEndpoint.method}
                    </span>
                    <code className="text-sm font-mono text-muted-foreground">{currentEndpoint.path}</code>
                    <button
                      onClick={() => copyToClipboard(currentEndpoint.path)}
                      className="ml-auto p-2 hover:bg-secondary rounded-lg transition"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>

                  <h2 className="text-xl font-semibold mb-2">{currentEndpoint.title}</h2>
                  <p className="text-muted-foreground mb-6">{currentEndpoint.description}</p>

                  {/* Parameters */}
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3">Parameters</h3>
                    <div className="bg-secondary/30 rounded-lg p-4 overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-2 px-0 font-semibold">Name</th>
                            <th className="text-left py-2 px-0 font-semibold">Type</th>
                            <th className="text-left py-2 px-0 font-semibold">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentEndpoint.params.map((param, idx) => (
                            <tr key={idx} className="border-b border-border/50 last:border-b-0">
                              <td className="py-2 px-0 font-mono text-xs">{param.name}</td>
                              <td className="py-2 px-0">
                                <span className="px-2 py-1 bg-muted rounded text-xs">{param.type}</span>
                              </td>
                              <td className="py-2 px-0 text-muted-foreground">{param.desc}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Response */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Code2 className="w-4 h-4" />
                      Response
                    </h3>
                    <div className="bg-secondary/30 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-xs font-mono text-muted-foreground">
                        {JSON.stringify(currentEndpoint.response, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>

                {/* Code Example */}
                <div className="border border-border rounded-lg bg-card p-6">
                  <h3 className="font-semibold mb-4">Example Request</h3>
                  <div className="bg-secondary/30 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-xs font-mono text-muted-foreground">
                      {`curl -X ${currentEndpoint.method} 'https://api.phantomagents.com${currentEndpoint.path}' \\
  -H 'Authorization: Bearer YOUR_API_KEY' \\
  -H 'Content-Type: application/json'`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
