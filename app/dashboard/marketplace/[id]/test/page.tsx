"use client"

import { useState } from "react"

export default function TestSandboxPage({ params }: { params: { id: string } }) {
  const { id } = params
  const [prompt, setPrompt] = useState("Hello, agent. Summarize market conditions.")
  const [response, setResponse] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const runTest = async () => {
    setLoading(true)
    // Simulate an LLM call (frontend only)
    await new Promise((r) => setTimeout(r, 900))
    setResponse(`Mock response for listing ${id}: Market conditions are stable. (simulated)`)
    setLoading(false)
  }

  return (
    <div className="p-8">
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold mb-2">Test Sandbox</h1>
        <p className="text-sm text-muted-foreground mb-4">Run a quick prompt against the agent in a sandbox (simulated).</p>

        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={4} className="w-full border rounded-md p-3 mb-4" />

        <div className="flex gap-2 mb-4">
          <button onClick={runTest} className="px-4 py-2 bg-primary text-primary-foreground rounded-md">{loading ? "Running..." : "Run"}</button>
        </div>

        <div className="border border-border rounded-lg p-4 bg-card">
          <h3 className="font-semibold mb-2">Response</h3>
          {response ? <pre className="whitespace-pre-wrap text-sm">{response}</pre> : <p className="text-sm text-muted-foreground">No response yet</p>}
        </div>
      </div>
    </div>
  )
}
