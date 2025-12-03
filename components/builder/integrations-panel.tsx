"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const INTEGRATIONS = [
  { id: "blockchain", name: "Blockchain & Web3", icon: "⛓️" },
  { id: "external", name: "External Tools", icon: "🔧" },
  { id: "communication", name: "Communication Platforms", icon: "💬" },
  { id: "code", name: "Custom Code", icon: "</>" },
  { id: "ai", name: "AI Model Configuration", icon: "🤖" },
]

export interface IntegrationsPanelProps {
  onComplete: () => void
}

export function IntegrationsPanel({ onComplete }: IntegrationsPanelProps) {
  const [expandedIntegration, setExpandedIntegration] = useState<string | null>(null)

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Integrations & Tools</h2>

      <div className="space-y-4 mb-6">
        {INTEGRATIONS.map((integration) => (
          <div key={integration.id} className="border border-border rounded-lg overflow-hidden bg-card">
            <button
              onClick={() => setExpandedIntegration(expandedIntegration === integration.id ? null : integration.id)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-secondary/50 transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{integration.icon}</span>
                <span className="font-semibold">{integration.name}</span>
              </div>
              <ChevronDown
                className={`w-5 h-5 transition ${expandedIntegration === integration.id ? "rotate-180" : ""}`}
              />
            </button>

            {expandedIntegration === integration.id && (
              <div className="border-t border-border px-6 py-4 bg-secondary/30 space-y-4">
                {integration.id === "blockchain" && (
                  <>
                    <div>
                      <label className="text-sm font-medium block mb-2">Wallet Monitoring (View-only)</label>
                      <input
                        type="text"
                        placeholder="0x..."
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-2">Smart Contract ABI</label>
                      <textarea
                        placeholder="Paste contract ABI..."
                        rows={3}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
                      ></textarea>
                    </div>
                  </>
                )}
                {integration.id === "external" && (
                  <div className="space-y-2">
                    {["Zapier", "Make.com", "IFTTT"].map((tool) => (
                      <label key={tool} className="flex items-center gap-2">
                        <input type="checkbox" className="w-4 h-4" />
                        <span className="text-sm">{tool}</span>
                      </label>
                    ))}
                  </div>
                )}
                {integration.id === "communication" && (
                  <div className="space-y-3">
                    {["Slack", "Discord", "Telegram", "Email"].map((platform) => (
                      <div key={platform}>
                        <label className="text-sm font-medium block mb-2">{platform}</label>
                        <input
                          type="text"
                          placeholder={`${platform} configuration...`}
                          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
                        />
                      </div>
                    ))}
                  </div>
                )}
                {integration.id === "code" && (
                  <>
                    <div>
                      <label className="text-sm font-medium block mb-2">Language</label>
                      <select className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm">
                        <option>JavaScript</option>
                        <option>Python</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-2">Code</label>
                      <textarea
                        placeholder="Your custom code..."
                        rows={4}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm font-mono text-xs"
                      ></textarea>
                    </div>
                  </>
                )}
                {integration.id === "ai" && (
                  <>
                    <div>
                      <label className="text-sm font-medium block mb-2">Model Provider</label>
                      <select className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm">
                        <option>OpenAI</option>
                        <option>Anthropic</option>
                        <option>Groq</option>
                        <option>Gemini</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-2">Model</label>
                      <select className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm">
                        <option>GPT-4 Turbo</option>
                        <option>Claude 3 Sonnet</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-2">Temperature: 0.7</label>
                      <input type="range" min="0" max="2" step="0.1" defaultValue="0.7" className="w-full" />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={onComplete}
        className="w-full py-2 rounded-md font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition"
      >
        Continue to Rules
      </button>
    </div>
  )
}
