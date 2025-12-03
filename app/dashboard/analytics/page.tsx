"use client"

import { useState } from "react"
import { Download, TrendingUp, TrendingDown, Calendar, Filter } from "lucide-react"

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("Last 30 Days")
  const [selectedAgent, setSelectedAgent] = useState("all")

  const agents = ["all", "Crypto Trader Pro", "Market Oracle", "DAO Delegate"]

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics</h1>
          <p className="text-muted-foreground">Deep performance insights for your agents</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-secondary transition font-medium text-sm">
          <Download className="w-4 h-4" />
          Export Data
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          {["Last 7 Days", "Last 30 Days", "Last 90 Days", "All Time"].map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                dateRange === range ? "bg-primary text-primary-foreground" : "border border-border hover:bg-secondary"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
            className="px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {agents.map((agent) => (
              <option key={agent} value={agent}>
                {agent === "all" ? "All Agents" : agent}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Actions", value: "12,456", change: "+22%", positive: true },
          { label: "Success Rate", value: "94.2%", change: "+3.1%", positive: true },
          { label: "Avg Response Time", value: "245ms", change: "-12%", positive: true },
          { label: "Error Count", value: "234", change: "-5%", positive: true },
        ].map((metric) => (
          <div
            key={metric.label}
            className="border border-border rounded-lg p-6 bg-card hover:border-accent transition"
          >
            <p className="text-sm text-muted-foreground mb-2">{metric.label}</p>
            <p className="text-3xl font-bold mb-2">{metric.value}</p>
            <p className={`text-xs flex items-center gap-1 ${metric.positive ? "text-green-600" : "text-red-600"}`}>
              {metric.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {metric.change} from last period
            </p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border border-border rounded-lg p-6 bg-card">
          <h2 className="text-lg font-bold mb-4">Action Volume</h2>
          <div className="h-64 bg-secondary/30 rounded-lg flex items-center justify-center">
            <span className="text-muted-foreground">Chart: Actions over time</span>
          </div>
        </div>

        <div className="border border-border rounded-lg p-6 bg-card">
          <h2 className="text-lg font-bold mb-4">Success Rate by Type</h2>
          <div className="h-64 bg-secondary/30 rounded-lg flex items-center justify-center">
            <span className="text-muted-foreground">Chart: Success rate breakdown</span>
          </div>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border border-border rounded-lg p-6 bg-card">
          <h2 className="text-lg font-bold mb-4">Cost Breakdown</h2>
          <div className="h-64 bg-secondary/30 rounded-lg flex items-center justify-center">
            <span className="text-muted-foreground">Chart: Cost distribution</span>
          </div>
        </div>

        <div className="border border-border rounded-lg p-6 bg-card">
          <h2 className="text-lg font-bold mb-4">Performance Trends</h2>
          <div className="h-64 bg-secondary/30 rounded-lg flex items-center justify-center">
            <span className="text-muted-foreground">Chart: Performance over time</span>
          </div>
        </div>
      </div>

      {/* Agent Performance Comparison */}
      <div className="border border-border rounded-lg p-6 bg-card">
        <h2 className="text-lg font-bold mb-4">Agent Performance Comparison</h2>
        <div className="space-y-4">
          {[
            { name: "Crypto Trader Pro", actions: 4250, success: 96, cost: 156.5 },
            { name: "Market Oracle", actions: 3180, success: 92, cost: 89.2 },
            { name: "DAO Delegate", actions: 5026, success: 89, cost: 234.8 },
          ].map((agent) => (
            <div
              key={agent.name}
              className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/50 transition"
            >
              <div className="flex-1">
                <p className="font-medium text-sm mb-1">{agent.name}</p>
                <div className="flex gap-6 text-xs text-muted-foreground">
                  <span>Actions: {agent.actions.toLocaleString()}</span>
                  <span>Success: {agent.success}%</span>
                  <span>Cost: ${agent.cost.toFixed(2)}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-green-600">{agent.success}%</p>
                <p className="text-xs text-muted-foreground">Success Rate</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Table */}
      <div className="border border-border rounded-lg overflow-hidden bg-card">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-bold">Action Log</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Timestamp</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Agent</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Action Type</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Duration</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Cost</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  time: "12:34 PM",
                  agent: "Crypto Trader",
                  action: "Trade",
                  status: "✓",
                  duration: "245ms",
                  cost: "$0.05",
                },
                {
                  time: "12:33 PM",
                  agent: "Market Oracle",
                  action: "Prediction",
                  status: "✓",
                  duration: "189ms",
                  cost: "$0.03",
                },
                {
                  time: "12:32 PM",
                  agent: "DAO Delegate",
                  action: "Vote",
                  status: "✓",
                  duration: "312ms",
                  cost: "$0.08",
                },
                {
                  time: "12:31 PM",
                  agent: "Research Bot",
                  action: "Analysis",
                  status: "✓",
                  duration: "567ms",
                  cost: "$0.12",
                },
                {
                  time: "12:30 PM",
                  agent: "Signal Generator",
                  action: "Signal",
                  status: "✓",
                  duration: "134ms",
                  cost: "$0.02",
                },
              ].map((row, i) => (
                <tr key={i} className="border-b border-border hover:bg-secondary/50 transition last:border-b-0">
                  <td className="py-3 px-6 text-sm text-muted-foreground">{row.time}</td>
                  <td className="py-3 px-6 text-sm font-medium">{row.agent}</td>
                  <td className="py-3 px-6 text-sm">{row.action}</td>
                  <td className="py-3 px-6 text-sm text-green-600">{row.status}</td>
                  <td className="py-3 px-6 text-sm">{row.duration}</td>
                  <td className="py-3 px-6 text-sm font-medium">{row.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
