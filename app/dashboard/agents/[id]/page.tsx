"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import WalletConnector from "@/components/wallet-connector"
import { explorerLink, fetchContractMetadata } from "@/lib/starknet-client"

export default function AgentOnChainPage({ params }: { params: { id: string } }) {
  const { id } = React.use(params)
  const [meta, setMeta] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        // If id looks like an address, fetch contract metadata
        const isAddress = typeof id === "string" && id.startsWith("0x")
        if (isAddress) {
          const m = await fetchContractMetadata(id)
          if (mounted) setMeta(m)
        } else {
          // try to find in localStorage placeholder
          const items = JSON.parse(localStorage.getItem("phantom.seller.listings") || "[]")
          const match = items.find((it: any) => it.id === id || it.agentData?.name === id)
          if (match) setMeta(match.onChain || { agentData: match.agentData })
        }
      } catch (e) {
        console.error(e)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [id])

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Agent On-Chain Status</h1>
                <p className="text-sm text-muted-foreground">ID: <span className="font-mono">{id}</span></p>
              </div>
              <div className="flex items-center gap-4">
                <WalletConnector />
              </div>
            </div>

            <div className="border border-border rounded-lg p-6 bg-card">
              {loading ? (
                <div className="text-sm text-muted-foreground">Loading on-chain metadata…</div>
              ) : meta ? (
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-muted-foreground">Contract / Token</div>
                    <div className="font-mono">{meta.address || meta.contractAddress || meta.tokenId || id}</div>
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground">Name</div>
                    <div className="font-semibold">{meta.name || meta.agentData?.name || "—"}</div>
                    <div className="text-xs text-muted-foreground">{meta.description || meta.agentData?.description}</div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold">Latest Verified Actions</h3>
                    <div className="space-y-2 mt-2">
                      {(meta.latestVerifiedActions || []).map((a: any) => (
                        <div key={a.id} className="text-sm font-mono border border-border rounded p-2 bg-background">
                          <div>action: {a.action}</div>
                          <div>hash: {a.resultHash}</div>
                          <div className="text-xs text-muted-foreground">{a.timestamp}</div>
                        </div>
                      ))}
                      {(!meta.latestVerifiedActions || meta.latestVerifiedActions.length === 0) && <div className="text-sm text-muted-foreground">No verified actions recorded.</div>}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold">Proof Hashes</h3>
                    <div className="mt-2 space-y-2">
                      {(meta.proofHashes || []).map((h: string) => (
                        <div key={h} className="font-mono text-sm">{h}</div>
                      ))}
                      {(!meta.proofHashes || meta.proofHashes.length === 0) && <div className="text-sm text-muted-foreground">No proofs found.</div>}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold">Runtime Logs</h3>
                    <div className="mt-2 space-y-2">
                      {(meta.runtimeLogs || []).map((l: any, idx: number) => (
                        <div key={idx} className="text-sm">
                          <div className="font-mono text-xs text-muted-foreground">{l.ts}</div>
                          <div className="text-sm">{l.msg}</div>
                        </div>
                      ))}
                      {(!meta.runtimeLogs || meta.runtimeLogs.length === 0) && <div className="text-sm text-muted-foreground">No runtime logs.</div>}
                    </div>
                  </div>

                  {meta.address && (
                    <div className="mt-4">
                      <a href={explorerLink(meta.address)} target="_blank" rel="noreferrer" className="text-primary font-mono">View on explorer</a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">No on-chain metadata found for this agent.</div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
