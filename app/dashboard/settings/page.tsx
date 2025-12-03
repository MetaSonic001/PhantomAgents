"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Copy, Trash2, Eye, EyeOff } from "lucide-react"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [showApiKey, setShowApiKey] = useState(false)

  const TABS = [
    { id: "profile", label: "Profile" },
    { id: "billing", label: "Billing" },
    { id: "api", label: "API Keys" },
    { id: "integrations", label: "Integrations" },
    { id: "security", label: "Security" },
  ]

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Settings</h1>
              <p className="text-muted-foreground">Manage your account and preferences</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-border mb-8 overflow-x-auto">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 font-medium text-sm border-b-2 transition whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div className="border border-border rounded-lg p-6 bg-card">
                  <h2 className="text-lg font-bold mb-4">Profile Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium block mb-2">Full Name</label>
                      <input
                        type="text"
                        defaultValue="John Doe"
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-2">Email</label>
                      <input
                        type="email"
                        defaultValue="john@phantom.ai"
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-2">Bio</label>
                      <textarea
                        rows={3}
                        defaultValue="Creator of premium AI agents"
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="border border-border rounded-lg p-6 bg-card">
                  <h2 className="text-lg font-bold mb-4">Avatar</h2>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-muted"></div>
                    <button className="px-4 py-2 border border-border rounded-md hover:bg-secondary transition font-medium text-sm">
                      Upload Photo
                    </button>
                  </div>
                </div>

                <button className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition font-medium">
                  Save Changes
                </button>
              </div>
            )}

            {/* Billing Tab */}
            {activeTab === "billing" && (
              <div className="space-y-6">
                <div className="border border-border rounded-lg p-6 bg-card">
                  <h2 className="text-lg font-bold mb-4">Current Plan</h2>
                  <div className="flex items-center justify-between mb-6 pb-6 border-b border-border">
                    <div>
                      <p className="text-sm text-muted-foreground">Professional Plan</p>
                      <p className="text-2xl font-bold">$99/month</p>
                    </div>
                    <button className="px-4 py-2 border border-border rounded-md hover:bg-secondary transition font-medium text-sm">
                      Upgrade
                    </button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Next billing date: Dec 24, 2024</p>
                    <p className="text-xs text-muted-foreground">Usage: 12,456 / 50,000 actions</p>
                  </div>
                </div>

                <div className="border border-border rounded-lg p-6 bg-card">
                  <h2 className="text-lg font-bold mb-4">Payment Method</h2>
                  <div className="p-4 border border-border rounded-md bg-secondary/50 mb-4">
                    <p className="text-sm font-medium">Visa ending in 4242</p>
                    <p className="text-xs text-muted-foreground">Expires 12/26</p>
                  </div>
                  <button className="px-4 py-2 border border-border rounded-md hover:bg-secondary transition font-medium text-sm">
                    Update Payment Method
                  </button>
                </div>

                <div className="border border-border rounded-lg p-6 bg-card">
                  <h2 className="text-lg font-bold mb-4">Billing History</h2>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 px-0 font-medium">Date</th>
                        <th className="text-left py-2 px-0 font-medium">Amount</th>
                        <th className="text-left py-2 px-0 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { date: "Nov 24, 2024", amount: "$99.00", status: "Paid" },
                        { date: "Oct 24, 2024", amount: "$99.00", status: "Paid" },
                      ].map((item, i) => (
                        <tr key={i} className="border-b border-border last:border-b-0">
                          <td className="py-2">{item.date}</td>
                          <td className="py-2">{item.amount}</td>
                          <td className="py-2 text-green-600">{item.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* API Keys Tab */}
            {activeTab === "api" && (
              <div className="space-y-6">
                <div className="border border-border rounded-lg p-6 bg-card">
                  <h2 className="text-lg font-bold mb-4">API Keys</h2>
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition font-medium text-sm mb-6">
                    Generate New Key
                  </button>

                  <div className="space-y-3">
                    {[
                      { name: "Production Key", created: "2 weeks ago", usage: 1234 },
                      { name: "Development Key", created: "1 month ago", usage: 56 },
                    ].map((key, i) => (
                      <div key={i} className="border border-border rounded-lg p-4 bg-secondary/30">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-medium text-sm">{key.name}</p>
                            <p className="text-xs text-muted-foreground">Created {key.created}</p>
                          </div>
                          <div className="flex gap-2">
                            <button className="p-1.5 hover:bg-secondary rounded-md transition">
                              <Copy className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 hover:bg-secondary rounded-md transition text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-background rounded text-xs font-mono">
                          <span className="flex-1 overflow-x-auto">pa_sk_live_••••••••••••••</span>
                          <button className="p-1 hover:bg-secondary rounded transition">
                            {showApiKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">{key.usage} requests this month</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Integrations Tab */}
            {activeTab === "integrations" && (
              <div className="space-y-6">
                <div className="border border-border rounded-lg p-6 bg-card">
                  <h2 className="text-lg font-bold mb-4">Connected Services</h2>
                  <div className="space-y-3">
                    {["GitHub", "Stripe", "Slack"].map((service) => (
                      <div
                        key={service}
                        className="flex items-center justify-between p-4 border border-border rounded-lg"
                      >
                        <p className="font-medium text-sm">{service}</p>
                        <button className="px-3 py-1.5 text-xs rounded-md border border-border hover:bg-secondary transition">
                          Connected
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <div className="border border-border rounded-lg p-6 bg-card">
                  <h2 className="text-lg font-bold mb-4">Two-Factor Authentication</h2>
                  <p className="text-sm text-muted-foreground mb-4">Add an extra layer of security to your account</p>
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition font-medium text-sm">
                    Enable 2FA
                  </button>
                </div>

                <div className="border border-border rounded-lg p-6 bg-card">
                  <h2 className="text-lg font-bold mb-4">Active Sessions</h2>
                  <div className="space-y-3">
                    {[
                      { device: "Chrome on Mac", location: "San Francisco, CA", date: "Active now" },
                      { device: "Safari on iPhone", location: "San Francisco, CA", date: "2 hours ago" },
                    ].map((session, i) => (
                      <div key={i} className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{session.device}</p>
                          <p className="text-xs text-muted-foreground">
                            {session.location} • {session.date}
                          </p>
                        </div>
                        <button className="text-xs text-destructive hover:underline">Revoke</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
