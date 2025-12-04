"use client"

import { Eye, Share2, Download, Zap } from "lucide-react"

export interface PreviewPanelProps {
  agentName: string
  agentType: string
}

import * as React from "react"
import { explorerLink } from "@/lib/starknet-client"

export function PreviewPanel({ agentName, agentType }: PreviewPanelProps) {
  const [onChainInfo, setOnChainInfo] = React.useState<any | null>(null)

  React.useEffect(() => {
    try {
      const key = "phantom.seller.listings"
      const items = JSON.parse(localStorage.getItem(key) || "[]")
      // find by agent name (best-effort match)
      const match = items.find((it: any) => it.agentData?.name === agentName)
      if (match) setOnChainInfo(match.onChain || match)
      else setOnChainInfo(null)
    } catch (e) {
      setOnChainInfo(null)
    }
  }, [agentName])

  return (
    <div className="p-6 space-y-6">
      {/* Agent Card Preview */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Marketplace Preview</h3>
        <div className="group border border-border rounded-lg p-4 bg-card hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer">
          <div className="flex gap-3 mb-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
              <span className="text-lg">🤖</span>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm truncate">{agentName || "Agent Name"}</h4>
              <p className="text-xs text-muted-foreground truncate">{agentType}</p>
            </div>
          </div>

          <div className="flex gap-2 mb-3">
            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">Agent</span>
            <span className="text-xs px-2 py-1 rounded-full bg-secondary text-foreground">Production</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <span>⭐</span>
              <span className="font-medium">4.8</span>
              <span className="text-muted-foreground">(142)</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              <span className="font-medium">1.2K</span>
              <span className="text-muted-foreground">uses</span>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Stats */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Configuration</h3>
        <div className="space-y-2 bg-secondary/30 rounded-lg p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Type</span>
            <span className="font-medium">{agentType}</span>
          </div>
          <div className="border-t border-border pt-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Status</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <span className="font-medium">Draft</span>
            </div>
          </div>
          <div className="border-t border-border pt-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Visibility</span>
            <span className="font-medium">Private</span>
          </div>
        </div>
      </div>

      {/* Performance Metrics Preview */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Estimated Metrics</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-secondary/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Success Rate</p>
            <p className="text-lg font-bold text-primary">--</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Avg Latency</p>
            <p className="text-lg font-bold text-primary">--ms</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Cost per Run</p>
            <p className="text-lg font-bold text-primary">--</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Uptime</p>
            <p className="text-lg font-bold text-primary">99.9%</p>
          </div>
        </div>
      </div>

      {/* JSON Configuration */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">JSON Config</h3>
        <div className="bg-slate-950 dark:bg-black rounded-lg p-3 font-mono text-xs overflow-x-auto border border-border">
          <pre className="text-slate-300 select-all">
            {`{
  "name": "${agentName}",
  "type": "${agentType}",
  "version": "1.0.0",
  "status": "draft",
  "capabilities": [],
  "created": "${new Date().toISOString()}"
}`}
          </pre>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-border pt-4 space-y-2">
        {onChainInfo && (
          <div className="p-3 rounded bg-gradient-to-r from-green-50 to-white border border-green-200">
            <div className="text-xs text-green-700 font-semibold">On-chain</div>
            <div className="text-sm font-mono mt-1">Address: {onChainInfo.contractAddress || onChainInfo.tokenId}</div>
            {onChainInfo.contractAddress && (
              <div className="text-xs mt-1">
                <a href={explorerLink(onChainInfo.contractAddress)} target="_blank" rel="noreferrer" className="text-primary">
                  View on explorer
                </a>
              </div>
            )}
          </div>
        )}
        <button className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-secondary transition text-sm font-medium">
          <Eye className="w-4 h-4" />
          Preview Live
        </button>
        <button className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-secondary transition text-sm font-medium">
          <Share2 className="w-4 h-4" />
          Share Draft
        </button>
        <button className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition text-sm font-medium">
          <Download className="w-4 h-4" />
          Export Config
        </button>
      </div>
    </div>
  )
}
