"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Badge } from "@/components/ui/badge"
import { Plus, Copy, Trash2, Eye, EyeOff, Activity } from "lucide-react"

export default function WebhooksPage() {
  const [showCreate, setShowCreate] = useState(false)
  const [webhookUrl, setWebhookUrl] = useState("")
  const [showKey, setShowKey] = useState(false)

  const webhooks = [
    {
      id: "wh_001",
      url: "https://api.example.com/webhooks/agents",
      events: ["agent.executed", "agent.failed"],
      status: "active",
      lastTriggered: "2 minutes ago",
      deliveries: 1234,
      secret: "wh_sec_••••••••••••••••",
    },
    {
      id: "wh_002",
      url: "https://slack.com/webhook/abc123",
      events: ["agent.marketplace_update"],
      status: "inactive",
      lastTriggered: "1 week ago",
      deliveries: 567,
      secret: "wh_sec_••••••••••••••••",
    },
  ]

  const events = [
    "agent.executed",
    "agent.failed",
    "agent.deployed",
    "agent.marketplace_update",
    "agent.error",
    "run.completed",
    "competition.ended",
  ]

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">Webhooks</h1>
                <p className="text-muted-foreground">Receive real-time notifications</p>
              </div>
              <button
                onClick={() => setShowCreate(!showCreate)}
                className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium"
              >
                <Plus className="w-4 h-4" />
                New Webhook
              </button>
            </div>

            {showCreate && (
              <div className="mb-8 p-6 border border-border rounded-lg bg-card">
                <h3 className="font-semibold mb-4">Create Webhook</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium block mb-2">Webhook URL</label>
                    <input
                      type="url"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="https://api.example.com/webhook"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-2">Events</label>
                    <div className="grid grid-cols-2 gap-3">
                      {events.map((event) => (
                        <label key={event} className="flex items-center gap-2 text-sm">
                          <input type="checkbox" className="rounded" />
                          {event}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium">
                      Create Webhook
                    </button>
                    <button
                      onClick={() => setShowCreate(false)}
                      className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {webhooks.map((webhook) => (
                <div key={webhook.id} className="border border-border rounded-lg bg-card overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Activity className="w-5 h-5 text-muted-foreground" />
                          <p className="font-mono text-sm break-all">{webhook.url}</p>
                          <Badge variant={webhook.status === "active" ? "default" : "secondary"}>
                            {webhook.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">ID: {webhook.id}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-secondary rounded-lg transition" title="Copy secret">
                          <Copy className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-secondary rounded-lg transition" title="Toggle visibility">
                          {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          className="p-2 hover:bg-destructive/10 rounded-lg transition text-destructive"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mb-4 pb-4 border-t border-border pt-4">
                      <p className="text-xs text-muted-foreground mb-2">Secret Key</p>
                      <div className="flex items-center gap-2 p-2 bg-background rounded text-xs font-mono">
                        <span className="flex-1 overflow-x-auto">{webhook.secret}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Events</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {webhook.events.map((event) => (
                            <Badge key={event} variant="secondary" className="text-xs">
                              {event}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Deliveries</p>
                        <p className="font-semibold text-sm mt-1">{webhook.deliveries}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Last Triggered</p>
                        <p className="font-semibold text-sm mt-1">{webhook.lastTriggered}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
