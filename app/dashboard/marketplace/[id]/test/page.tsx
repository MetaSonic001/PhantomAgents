"use client"

import * as React from "react"
import { useState } from "react"
import { explorerLink } from "@/lib/starknet-client"
import WalletConnector from "@/components/wallet-connector"
import { signMessageNormalized } from "@/lib/starknet-sign"

export default function TestSandboxPage({ params }: { params: { id: string } }) {
  const { id } = React.use(params)
  const mockConnected = typeof window !== "undefined" && !!localStorage.getItem("phantom.mock.connected")
  const account = mockConnected ? "demo_user_account" : null
  const address = mockConnected ? "0xdemo_user_addr" : null
  const [prompt, setPrompt] = useState("Hello, agent. Summarize market conditions.")
  const [response, setResponse] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [proof, setProof] = useState<any | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)

  const runTest = async () => {
    setLoading(true)
    setResponse(null)
    setProof(null)
    setTxHash(null)

    try {
      const res = await fetch("/api/llm/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, agentId: id }),
      })
      const j = await res.json()
      setResponse(j.response || JSON.stringify(j))
      setProof(j.proof || null)
    } catch (err) {
      setResponse(String(err))
    } finally {
      setLoading(false)
    }
  }

  const submitProof = async () => {
    if (!proof) return
    setSubmitting(true)
    try {
      // Optionally request a mock signature over the proof before submitting
      let signature = null
      if (account) {
        try {
          signature = await signMessageNormalized(account, JSON.stringify({ action: "submit-proof", agentId: id, proofHash: proof.hash }))
        } catch (e) {
          console.warn("signature failed", e)
        }
      }

      const res = await fetch("/api/starknet/submit-proof", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId: id, proofHash: proof.hash, proofData: proof, signature }),
      })
      const j = await res.json()
      setTxHash(j.txHash || j.hash || null)
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold mb-2">Test Sandbox</h1>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">Run a prompt, generate a proof, and submit it to StarkNet.</p>
          <div className="hidden md:block">
            <WalletConnector />
          </div>
        </div>

        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={4} className="w-full border rounded-md p-3 mb-4" />

        <div className="flex gap-2 mb-4">
          <button onClick={runTest} className="px-4 py-2 bg-primary text-primary-foreground rounded-md">{loading ? "Running..." : "Run"}</button>
          {proof && (
            <button onClick={submitProof} disabled={submitting} className="px-4 py-2 bg-secondary text-foreground rounded-md">
              {submitting ? "Submitting…" : "Submit to StarkNet"}
            </button>
          )}
        </div>

        <div className="border border-border rounded-lg p-4 bg-card space-y-3">
          <div>
            <h3 className="font-semibold mb-2">Response</h3>
            {response ? <pre className="whitespace-pre-wrap text-sm">{response}</pre> : <p className="text-sm text-muted-foreground">No response yet</p>}
          </div>

          <div>
            <h3 className="font-semibold mb-2">Proof</h3>
            {proof ? (
              <div className="text-sm">
                <div>Hash: <span className="font-mono">{proof.hash}</span></div>
                <div>Generated: <span className="font-mono">{proof.createdAt}</span></div>
                <div className="mt-2 text-xs text-muted-foreground">Source (truncated): {String(proof.source || "").slice(0, 300)}</div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No proof generated yet</p>
            )}
          </div>

          {txHash && (
            <div>
              <h3 className="font-semibold mb-2">Transaction</h3>
              <div>
                Submitted tx: <a href={explorerLink(txHash)} target="_blank" rel="noreferrer" className="text-primary font-mono">{txHash}</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
