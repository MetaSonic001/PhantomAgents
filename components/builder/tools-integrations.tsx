"use client"

import * as React from "react"

export default function ToolsIntegrations({ agentName }: { agentName?: string }) {
  const key = `phantom.agent.${agentName || "default"}.tools`
  const [tools, setTools] = React.useState<string[]>([])
  const [input, setInput] = React.useState("")

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw) setTools(JSON.parse(raw))
    } catch (e) {}
  }, [key])

  const addTool = () => {
    if (!input) return
    const next = [...tools, input]
    setTools(next)
    localStorage.setItem(key, JSON.stringify(next))
    setInput("")
  }

  const removeTool = (idx: number) => {
    const next = tools.filter((_, i) => i !== idx)
    setTools(next)
    localStorage.setItem(key, JSON.stringify(next))
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Tools & Integrations</h3>
      <p className="text-sm text-muted-foreground">Add external tools or integrations the agent can call.</p>

      <div className="flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="e.g. google-search" className="flex-1 px-3 py-2 border rounded" />
        <button onClick={addTool} className="px-3 py-2 bg-primary text-primary-foreground rounded">Add</button>
      </div>

      <div className="space-y-2">
        {tools.map((t, i) => (
          <div key={i} className="flex items-center justify-between p-2 border rounded">
            <div className="font-mono text-sm">{t}</div>
            <button onClick={() => removeTool(i)} className="text-xs text-destructive">Remove</button>
          </div>
        ))}
        {tools.length === 0 && <div className="text-sm text-muted-foreground">No tools configured.</div>}
      </div>
    </div>
  )
}
