"use client"

import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Download } from "lucide-react"

const MOCK = [
  { agent: "Crypto Trader Pro", cost: 156.5, actions: 4250 },
  { agent: "Market Oracle", cost: 89.2, actions: 3180 },
  { agent: "DAO Delegate", cost: 234.8, actions: 5026 },
]

export default function CostManagement() {
  const exportCsv = () => {
    const rows = [["Agent","Cost","Actions"], ...MOCK.map((r) => [r.agent, `$${r.cost.toFixed(2)}`, String(r.actions)])]
    const csv = rows.map((r) => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "costs.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">Cost Management</h1>
                <p className="text-muted-foreground">Per-agent cost breakdown and export</p>
              </div>
              <button onClick={exportCsv} className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded">
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {MOCK.map((m) => (
                <div key={m.agent} className="border border-border rounded-lg p-4 bg-card">
                  <h3 className="font-semibold mb-2">{m.agent}</h3>
                  <p className="text-sm text-muted-foreground">Cost: <span className="font-medium">${m.cost.toFixed(2)}</span></p>
                  <p className="text-sm text-muted-foreground">Actions: <span className="font-medium">{m.actions.toLocaleString()}</span></p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
"use client"

import { useState } from "react"
import { AlertTriangle, Zap } from "lucide-react"

const mockCostData = {
  totalCost: 1250.45,
  monthlyBudget: 2000,
  forecast: 1680,
  costPerAgent: {
    "Trading Agent": 450,
    "Research Assistant": 380,
    "Lead Qualifier": 220,
    "Support Triager": 200,
  },
  costPerModel: {
    "GPT-4": 580,
    "Claude-3": 340,
    "GPT-3.5": 180,
    Gemini: 150,
  },
  recommendations: [
    {
      title: "Switch Trading Agent to GPT-3.5",
      savings: 120,
      description: "Performance similar to GPT-4 at 40% lower cost",
    },
    {
      title: "Enable Response Caching",
      savings: 85,
      description: "Cache common queries to reduce API calls",
    },
    {
      title: "Batch Process Research Tasks",
      savings: 60,
      description: "Process in batches instead of real-time",
    },
  ],
}

export default function CostManagementPage() {
  const [budgetAlert, setBudgetAlert] = useState(85)

  const usagePercent = (mockCostData.totalCost / mockCostData.monthlyBudget) * 100

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Cost Management & Optimization</h1>
        <p className="text-foreground/60">Track spending and optimize your budget</p>
      </div>

      {/* Cost Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border border-border rounded-lg p-6 bg-background">
          <p className="text-sm text-foreground/60 mb-2">Current Month</p>
          <p className="text-3xl font-bold">${mockCostData.totalCost.toFixed(2)}</p>
        </div>

        <div className="border border-border rounded-lg p-6 bg-background">
          <p className="text-sm text-foreground/60 mb-2">Budget Remaining</p>
          <p className="text-3xl font-bold">${(mockCostData.monthlyBudget - mockCostData.totalCost).toFixed(2)}</p>
        </div>

        <div className="border border-border rounded-lg p-6 bg-background">
          <p className="text-sm text-foreground/60 mb-2">Forecast (End of Month)</p>
          <p className="text-3xl font-bold">${mockCostData.forecast.toFixed(2)}</p>
        </div>

        <div className="border border-border rounded-lg p-6 bg-background">
          <p className="text-sm text-foreground/60 mb-2">Potential Savings</p>
          <p className="text-3xl font-bold text-green-600">
            ${mockCostData.recommendations.reduce((sum, r) => sum + r.savings, 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Budget Alert */}
      <div className="border border-border rounded-lg p-6 bg-background">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          Budget Alert Threshold
        </h2>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Alert me when spending reaches:</span>
                <span className="text-sm font-semibold">${budgetAlert * 20}</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                value={budgetAlert}
                onChange={(e) => setBudgetAlert(Number.parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Usage Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cost by Agent */}
        <div className="border border-border rounded-lg p-6 bg-background">
          <h2 className="text-lg font-semibold mb-4">Cost by Agent</h2>

          <div className="space-y-3">
            {Object.entries(mockCostData.costPerAgent).map(([agent, cost]) => (
              <div key={agent}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{agent}</span>
                  <span className="text-sm font-semibold">${cost}</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{
                      width: `${(cost / mockCostData.totalCost) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cost by Model */}
        <div className="border border-border rounded-lg p-6 bg-background">
          <h2 className="text-lg font-semibold mb-4">Cost by AI Model</h2>

          <div className="space-y-3">
            {Object.entries(mockCostData.costPerModel).map(([model, cost]) => (
              <div key={model}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{model}</span>
                  <span className="text-sm font-semibold">${cost}</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{
                      width: `${(cost / mockCostData.totalCost) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Optimization Recommendations */}
      <div className="border border-border rounded-lg p-6 bg-background">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-600" />
          Cost Optimization Recommendations
        </h2>

        <div className="space-y-3">
          {mockCostData.recommendations.map((rec, idx) => (
            <div key={idx} className="p-4 border border-border rounded-lg hover:bg-secondary/30 transition">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold">{rec.title}</h3>
                  <p className="text-sm text-foreground/60 mt-1">{rec.description}</p>
                </div>
                <span className="text-lg font-bold text-green-600">-${rec.savings}</span>
              </div>

              <button className="mt-3 px-4 py-2 text-sm bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition font-medium">
                Implement
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
