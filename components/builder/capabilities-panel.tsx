"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const CAPABILITIES = [
  { id: "predictions", name: "Predictions & Forecasting", icon: "🔮" },
  { id: "trading", name: "Trading & Signals", icon: "📈" },
  { id: "governance", name: "Governance & Voting", icon: "🗳️" },
  { id: "research", name: "Research & Analysis", icon: "📚" },
  { id: "tasks", name: "Task & Workflow Management", icon: "✓" },
  { id: "social", name: "Social & Communication", icon: "💬" },
]

export interface CapabilitiesPanelProps {
  onComplete: () => void
}

export function CapabilitiesPanel({ onComplete }: CapabilitiesPanelProps) {
  const [enabledCapabilities, setEnabledCapabilities] = useState<Record<string, boolean>>({})
  const [expandedCapability, setExpandedCapability] = useState<string | null>(null)

  const toggleCapability = (id: string) => {
    setEnabledCapabilities((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
    setExpandedCapability(expandedCapability === id ? null : id)
  }

  const isValid = Object.values(enabledCapabilities).some((v) => v)

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Capabilities & Actions</h2>

      <div className="space-y-4 mb-6">
        {CAPABILITIES.map((capability) => (
          <div key={capability.id} className="border border-border rounded-lg overflow-hidden bg-card">
            <button
              onClick={() => toggleCapability(capability.id)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-secondary/50 transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{capability.icon}</span>
                <span className="font-semibold">{capability.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={enabledCapabilities[capability.id] || false}
                  onChange={() => {}}
                  className="w-5 h-5 cursor-pointer"
                />
                <ChevronDown
                  className={`w-5 h-5 transition ${expandedCapability === capability.id ? "rotate-180" : ""}`}
                />
              </div>
            </button>

            {expandedCapability === capability.id && enabledCapabilities[capability.id] && (
              <div className="border-t border-border px-6 py-4 bg-secondary/30 space-y-4">
                {capability.id === "predictions" && (
                  <>
                    <div>
                      <label className="text-sm font-medium block mb-2">Prediction Categories</label>
                      <div className="space-y-2">
                        {["Crypto", "Stocks", "Events", "Sports", "Politics"].map((cat) => (
                          <label key={cat} className="flex items-center gap-2">
                            <input type="checkbox" className="w-4 h-4" />
                            <span className="text-sm">{cat}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-2">Confidence Threshold: 75%</label>
                      <input type="range" min="0" max="100" defaultValue="75" className="w-full" />
                    </div>
                  </>
                )}
                {capability.id === "trading" && (
                  <>
                    <div>
                      <label className="text-sm font-medium block mb-2">Signal Types</label>
                      <div className="space-y-2">
                        {["Long", "Short", "Neutral", "Buy", "Sell"].map((sig) => (
                          <label key={sig} className="flex items-center gap-2">
                            <input type="checkbox" className="w-4 h-4" />
                            <span className="text-sm">{sig}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-2">Risk Tolerance</label>
                      <select className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm">
                        <option>Conservative</option>
                        <option>Moderate</option>
                        <option>Aggressive</option>
                      </select>
                    </div>
                  </>
                )}
                <p className="text-xs text-muted-foreground italic">Configuration saved automatically</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={onComplete}
        disabled={!isValid}
        className={`w-full py-2 rounded-md font-medium transition ${
          isValid
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "bg-muted text-muted-foreground cursor-not-allowed"
        }`}
      >
        {isValid ? "Continue to Data Sources" : "Enable at least one capability"}
      </button>
    </div>
  )
}
