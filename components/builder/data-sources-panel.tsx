"use client"

import { useState } from "react"
import { Upload, Plus } from "lucide-react"

const TABS = [
  { id: "documents", label: "Documents" },
  { id: "web", label: "Web Sources" },
  { id: "memory", label: "Memory" },
  { id: "api", label: "APIs" },
  { id: "database", label: "Database" },
]

export interface DataSourcesPanelProps {
  onComplete: () => void
}

export function DataSourcesPanel({ onComplete }: DataSourcesPanelProps) {
  const [activeTab, setActiveTab] = useState("documents")

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Data Sources & Knowledge Base</h2>

      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex gap-2 border-b border-border">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition ${
                activeTab === tab.id
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="border border-border rounded-lg p-6 bg-card">
          {activeTab === "documents" && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:bg-secondary/50 transition cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                <p className="font-medium mb-1">Drag & drop files here</p>
                <p className="text-xs text-muted-foreground">PDF, TXT, MD, CSV, JSON</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Supported formats:</p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• PDF documents for analysis</p>
                  <p>• CSV/JSON for structured data</p>
                  <p>• Markdown for documentation</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "web" && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://example.com"
                  className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
                />
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition font-medium text-sm flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">RSS Feed Support</span>
                </label>
              </div>
            </div>
          )}

          {activeTab === "memory" && (
            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input type="checkbox" className="w-5 h-5" defaultChecked />
                <div>
                  <p className="text-sm font-medium">Enable Agent Memory</p>
                  <p className="text-xs text-muted-foreground">Store conversations and learnings</p>
                </div>
              </label>
              <div>
                <label className="text-sm font-medium block mb-2">Retention Period</label>
                <select className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm">
                  <option>1 day</option>
                  <option>1 week</option>
                  <option>1 month</option>
                  <option>Permanent</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === "api" && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">Pre-built Integrations</label>
                <div className="space-y-2">
                  {["CoinGecko", "Alpha Vantage", "Weather API", "News API"].map((api) => (
                    <label
                      key={api}
                      className="flex items-center gap-3 p-3 border border-border rounded-md hover:bg-secondary/50 transition cursor-pointer"
                    >
                      <input type="checkbox" className="w-4 h-4" />
                      <span className="text-sm font-medium">{api}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <label className="text-sm font-medium block mb-2">Custom REST API</label>
                <input
                  type="url"
                  placeholder="API Endpoint"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm mb-2"
                />
                <input
                  type="text"
                  placeholder="API Key (encrypted)"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
                />
              </div>
            </div>
          )}

          {activeTab === "database" && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">Database Type</label>
                <select className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm">
                  <option>PostgreSQL</option>
                  <option>MySQL</option>
                  <option>MongoDB</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Connection String</label>
                <input
                  type="password"
                  placeholder="postgresql://..."
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
                />
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onComplete}
          className="w-full py-2 rounded-md font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition"
        >
          Continue to Integrations
        </button>
      </div>
    </div>
  )
}
