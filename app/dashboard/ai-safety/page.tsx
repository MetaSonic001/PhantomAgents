"use client"

import { useState } from "react"
import { AlertCircle, CheckCircle, AlertTriangle, Info } from "lucide-react"

const mockSafetyMetrics = {
  overall: 92,
  hallucination: 95,
  bias: 88,
  toxicity: 98,
  pii: 91,
}

const mockIssues = [
  {
    id: "1",
    type: "hallucination",
    severity: "medium",
    description: "Agent generated unverified claim about market data",
    content: '"Ethereum will reach $10,000 by next week"',
    suggestion: "Add source attribution and confidence scoring",
  },
  {
    id: "2",
    type: "bias",
    severity: "low",
    description: "Potential gender bias detected in outputs",
    content: "Preferential language toward certain demographics",
    suggestion: "Review training data and add bias mitigation",
  },
]

export default function AISafetyPage() {
  const [issues, setIssues] = useState(mockIssues)

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-600 bg-red-50"
      case "medium":
        return "text-yellow-600 bg-yellow-50"
      case "low":
        return "text-blue-600 bg-blue-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertTriangle className="w-4 h-4" />
      case "medium":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Info className="w-4 h-4" />
    }
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">AI Safety & Compliance</h1>
        <p className="text-foreground/60">Monitor and manage responsible AI metrics</p>
      </div>

      {/* Safety Score Meters */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Overall", score: mockSafetyMetrics.overall, color: "bg-blue-500" },
          { label: "Hallucination", score: mockSafetyMetrics.hallucination, color: "bg-green-500" },
          { label: "Bias", score: mockSafetyMetrics.bias, color: "bg-orange-500" },
          { label: "Toxicity", score: mockSafetyMetrics.toxicity, color: "bg-green-500" },
          { label: "PII", score: mockSafetyMetrics.pii, color: "bg-yellow-500" },
        ].map((metric) => (
          <div key={metric.label} className="border border-border rounded-lg p-4 bg-background">
            <p className="text-xs text-foreground/60 mb-3">{metric.label}</p>
            <div className="relative w-16 h-16 mx-auto">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-secondary"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={`${(metric.score / 100) * 282.7} 282.7`}
                  className={metric.color}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold">{metric.score}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detected Issues */}
      <div className="border border-border rounded-lg p-6 bg-background">
        <h2 className="text-xl font-semibold mb-4">Detected Issues</h2>

        <div className="space-y-4">
          {issues.length > 0 ? (
            issues.map((issue) => (
              <div key={issue.id} className={`p-4 border border-border rounded-lg ${getSeverityColor(issue.severity)}`}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="mt-0.5">{getSeverityIcon(issue.severity)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold capitalize">{issue.type}</h3>
                      <span className="text-xs font-medium capitalize">{issue.severity}</span>
                    </div>
                    <p className="text-sm">{issue.description}</p>
                  </div>
                </div>

                <div className="bg-black/5 rounded p-3 mb-3 text-sm italic">"{issue.content}"</div>

                <div className="text-sm">
                  <p className="font-medium mb-1">Suggestion:</p>
                  <p>{issue.suggestion}</p>
                </div>

                <div className="mt-3 flex gap-2">
                  <button className="px-3 py-1.5 text-xs bg-black/10 rounded hover:bg-black/20 transition">
                    Dismiss
                  </button>
                  <button className="px-3 py-1.5 text-xs bg-black/20 rounded hover:bg-black/30 transition">
                    Review
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <p className="text-foreground/60">No safety issues detected</p>
            </div>
          )}
        </div>
      </div>

      {/* Compliance Checklist */}
      <div className="border border-border rounded-lg p-6 bg-background">
        <h2 className="text-xl font-semibold mb-4">Compliance Checklist</h2>

        <div className="space-y-3">
          {[
            { label: "GDPR Compliance", checked: true },
            { label: "Data Residency", checked: true },
            { label: "Audit Logging", checked: false },
            { label: "Encryption", checked: true },
            { label: "PII Protection", checked: true },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-secondary/30 transition"
            >
              <input type="checkbox" checked={item.checked} readOnly className="w-4 h-4 rounded" />
              <span className="text-sm">{item.label}</span>
              {item.checked && <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
