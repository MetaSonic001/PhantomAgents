"use client"

import { useState } from "react"
import { GitBranch, GitCompare, RotateCcw, Tag, Zap } from "lucide-react"

const mockVersions = [
  {
    id: "1",
    version: "v2.1.0",
    tag: "stable",
    date: "2 days ago",
    author: "Alice",
    changes: ["Added rate limiting", "Improved error handling", "Updated API endpoints"],
    status: "production",
  },
  {
    id: "2",
    version: "v2.0.5",
    tag: "patch",
    date: "1 week ago",
    author: "Bob",
    changes: ["Fixed memory leak", "Updated dependencies"],
    status: "production",
  },
  {
    id: "3",
    version: "v2.0.0",
    date: "2 weeks ago",
    author: "Alice",
    changes: ["Major feature release", "New AI model integration"],
    status: "archived",
  },
]

const mockABTest = {
  versionA: "v2.1.0",
  versionB: "v2.0.5",
  trafficSplit: 70,
  successRateA: 94.2,
  successRateB: 91.8,
  costA: 0.042,
  costB: 0.038,
  winner: "v2.1.0",
}

export default function VersionControlPage() {
  const [showABTest, setShowABTest] = useState(false)

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Version Control & A/B Testing</h1>
        <p className="text-foreground/60">Manage agent versions and run performance tests</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Version History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-border rounded-lg p-6 bg-background">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <GitBranch className="w-5 h-5" />
              Version History
            </h2>

            <div className="space-y-3">
              {mockVersions.map((ver) => (
                <div key={ver.id} className="p-4 border border-border rounded-lg hover:bg-secondary/30 transition">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{ver.version}</span>
                        {ver.tag && (
                          <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">{ver.tag}</span>
                        )}
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          ver.status === "production" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {ver.status}
                      </span>
                    </div>
                    <p className="text-xs text-foreground/60">{ver.date}</p>
                  </div>

                  <p className="text-xs text-foreground/60 mb-2">by {ver.author}</p>

                  <div className="flex flex-wrap gap-1">
                    {ver.changes.map((change, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 bg-secondary rounded">
                        {change}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-3">
                    <button className="px-3 py-1 text-xs bg-primary/10 text-primary rounded hover:bg-primary/20 transition">
                      Rollback
                    </button>
                    <button className="px-3 py-1 text-xs border border-border rounded hover:bg-secondary/50 transition">
                      Compare
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* A/B Test */}
          {showABTest && (
            <div className="border border-border rounded-lg p-6 bg-background">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <GitCompare className="w-5 h-5" />
                Active A/B Test
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    {
                      version: mockABTest.versionA,
                      traffic: mockABTest.trafficSplit,
                      success: mockABTest.successRateA,
                      cost: mockABTest.costA,
                    },
                    {
                      version: mockABTest.versionB,
                      traffic: 100 - mockABTest.trafficSplit,
                      success: mockABTest.successRateB,
                      cost: mockABTest.costB,
                    },
                  ].map((variant, idx) => (
                    <div key={idx} className="border border-border rounded-lg p-4">
                      <h3 className="font-semibold mb-4">{variant.version}</h3>

                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="text-foreground/60 mb-1">Traffic Split</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                              <div className="h-full bg-primary" style={{ width: `${variant.traffic}%` }}></div>
                            </div>
                            <span className="font-medium">{variant.traffic}%</span>
                          </div>
                        </div>

                        <div>
                          <p className="text-foreground/60">Success Rate</p>
                          <p className="text-lg font-semibold">{variant.success}%</p>
                        </div>

                        <div>
                          <p className="text-foreground/60">Cost/Call</p>
                          <p className="text-lg font-semibold">${variant.cost}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                  <p className="text-sm font-medium text-primary">
                    Recommended: Promote {mockABTest.winner} to production
                  </p>
                  <p className="text-xs text-primary/70 mt-1">
                    {mockABTest.successRateA - mockABTest.successRateB}% higher success rate
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="border border-border rounded-lg p-6 bg-background">
            <h3 className="font-semibold mb-4">Quick Actions</h3>

            <div className="space-y-3">
              <button className="w-full flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-secondary/50 transition text-sm font-medium">
                <RotateCcw className="w-4 h-4" />
                Rollback to Previous
              </button>

              <button
                onClick={() => setShowABTest(!showABTest)}
                className="w-full flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition text-sm font-medium"
              >
                <Zap className="w-4 h-4" />
                {showABTest ? "Close" : "Run A/B Test"}
              </button>

              <button className="w-full flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-secondary/50 transition text-sm font-medium">
                <Tag className="w-4 h-4" />
                Create Release Tag
              </button>
            </div>
          </div>

          {/* Version Stats */}
          <div className="border border-border rounded-lg p-6 bg-background">
            <h3 className="font-semibold mb-4">Version Stats</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-foreground/60">Total Versions</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/60">Production</span>
                <span className="font-semibold">2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/60">Beta</span>
                <span className="font-semibold">1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/60">Archived</span>
                <span className="font-semibold">9</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
