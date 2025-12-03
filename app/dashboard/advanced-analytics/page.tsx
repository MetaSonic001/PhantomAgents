"use client"

import { useState } from "react"
import { TrendingUp, Zap, AlertCircle, Target, BarChart3, TrendingDown } from "lucide-react"

export default function AdvancedAnalyticsPage() {
  const [predictiveData] = useState({
    nextMonthCost: 2847.5,
    costTrend: 12.5,
    anomalies: 3,
    benchmarkPosition: 23,
  })

  const costAttribution = [
    { model: "GPT-4", percentage: 45, cost: 1278.75 },
    { model: "Claude 3", percentage: 28, cost: 795.3 },
    { model: "Llama 2", percentage: 18, cost: 512.1 },
    { model: "Other", percentage: 9, cost: 256.05 },
  ]

  const anomalies = [
    { type: "Unusual Traffic Spike", agent: "Crypto Trader", severity: "high", time: "3 hours ago" },
    { type: "High Error Rate", agent: "Market Oracle", severity: "medium", time: "1 hour ago" },
    { type: "API Response Lag", agent: "DAO Governor", severity: "low", time: "30 mins ago" },
  ]

  const improvements = [
    { suggestion: "Optimize model selection - Claude 3 could replace GPT-4 for 30% cost savings", savings: "$383" },
    { suggestion: "Batch API calls to reduce integration costs by 15%", savings: "$427" },
    { suggestion: "Cache frequent queries - save 22% on API calls", savings: "$625" },
  ]

  return (
    <div className="p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Advanced Analytics 2.0</h1>
        <p className="text-muted-foreground">Predictive insights, anomaly detection, and cost optimization</p>
      </div>

      {/* Predictive Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border border-border rounded-lg p-4 bg-card">
          <p className="text-xs text-muted-foreground mb-1">Predicted Next Month Cost</p>
          <p className="text-3xl font-bold">${predictiveData.nextMonthCost.toFixed(2)}</p>
          <p
            className={`text-xs mt-1 flex items-center gap-1 ${predictiveData.costTrend > 0 ? "text-red-600" : "text-green-600"}`}
          >
            {predictiveData.costTrend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(predictiveData.costTrend)}% from average
          </p>
        </div>
        <div className="border border-border rounded-lg p-4 bg-card">
          <p className="text-xs text-muted-foreground mb-1">Anomalies Detected</p>
          <p className="text-3xl font-bold text-yellow-600">{predictiveData.anomalies}</p>
          <p className="text-xs text-muted-foreground mt-1">Require attention</p>
        </div>
        <div className="border border-border rounded-lg p-4 bg-card">
          <p className="text-xs text-muted-foreground mb-1">Performance Benchmark</p>
          <p className="text-3xl font-bold">{predictiveData.benchmarkPosition}%</p>
          <p className="text-xs text-green-600 mt-1">Better than average</p>
        </div>
        <div className="border border-border rounded-lg p-4 bg-card">
          <p className="text-xs text-muted-foreground mb-1">Potential Monthly Savings</p>
          <p className="text-3xl font-bold text-green-600">$1,435</p>
          <p className="text-xs text-muted-foreground mt-1">With recommendations</p>
        </div>
      </div>

      {/* Cost Attribution */}
      <div className="border border-border rounded-lg bg-card p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Cost Attribution by Model
        </h2>
        <div className="space-y-4">
          {costAttribution.map((item, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-sm">{item.model}</p>
                <span className="text-sm font-mono">${item.cost.toFixed(2)}</span>
              </div>
              <div className="w-full bg-secondary/50 rounded-full h-2">
                <div
                  className="bg-primary h-full rounded-full transition-all"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">{item.percentage}% of total</p>
            </div>
          ))}
        </div>
      </div>

      {/* Anomaly Detection */}
      <div className="border border-border rounded-lg bg-card p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Anomaly Detection
        </h2>
        <div className="space-y-3">
          {anomalies.map((anomaly, idx) => (
            <div key={idx} className="border border-border rounded-lg p-4 flex items-start gap-4">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  anomaly.severity === "high"
                    ? "bg-red-500/10 text-red-600"
                    : anomaly.severity === "medium"
                      ? "bg-yellow-500/10 text-yellow-600"
                      : "bg-blue-500/10 text-blue-600"
                }`}
              >
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">{anomaly.type}</p>
                <p className="text-xs text-muted-foreground">{anomaly.agent}</p>
              </div>
              <div className="text-right">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    anomaly.severity === "high"
                      ? "bg-red-500/10 text-red-700"
                      : anomaly.severity === "medium"
                        ? "bg-yellow-500/10 text-yellow-700"
                        : "bg-blue-500/10 text-blue-700"
                  }`}
                >
                  {anomaly.severity}
                </span>
                <p className="text-xs text-muted-foreground mt-1">{anomaly.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI-Powered Recommendations */}
      <div className="border border-border rounded-lg bg-card p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Cost Optimization Recommendations
        </h2>
        <div className="space-y-3">
          {improvements.map((improvement, idx) => (
            <div key={idx} className="border border-border rounded-lg p-4 bg-green-500/5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Zap className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{improvement.suggestion}</p>
                  <p className="text-xs text-green-600 mt-1">Potential monthly savings: {improvement.savings}</p>
                </div>
                <button className="px-3 py-1 border border-border rounded text-xs font-medium hover:bg-secondary transition">
                  Apply
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
