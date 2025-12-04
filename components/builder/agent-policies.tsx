"use client"

import * as React from "react"

type Policy = {
  id: string
  name: string
  rule: string
}

export default function AgentPolicies({ agentName }: { agentName?: string }) {
  const key = `phantom.agent.${agentName || "default"}.policies`
  const [policies, setPolicies] = React.useState<Policy[]>([])
  const [name, setName] = React.useState("")
  const [rule, setRule] = React.useState("")

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw) setPolicies(JSON.parse(raw))
    } catch (e) {}
  }, [key])

  const add = () => {
    if (!name || !rule) return
    const next = [...policies, { id: `${Date.now()}`, name, rule }]
    setPolicies(next)
    localStorage.setItem(key, JSON.stringify(next))
    setName("")
    setRule("")
  }

  const remove = (id: string) => {
    const next = policies.filter((p) => p.id !== id)
    setPolicies(next)
    localStorage.setItem(key, JSON.stringify(next))
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Agent Policies</h3>
      <p className="text-sm text-muted-foreground">Define simple enforcement rules for your agent. These are local placeholders and should be enforced server-side in production.</p>

      <div className="grid grid-cols-2 gap-2">
        <input className="input" placeholder="Policy name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="input" placeholder="Rule expression (e.g., allow:read; deny:write)" value={rule} onChange={(e) => setRule(e.target.value)} />
      </div>
      <div>
        <button className="btn" onClick={add}>
          Add Policy
        </button>
      </div>

      <div className="space-y-2">
        {policies.map((p) => (
          <div key={p.id} className="p-3 border rounded flex items-start justify-between">
            <div>
              <div className="font-medium">{p.name}</div>
              <div className="text-sm text-muted-foreground">{p.rule}</div>
            </div>
            <div>
              <button className="btn-ghost" onClick={() => remove(p.id)}>
                Remove
              </button>
            </div>
          </div>
        ))}
        {policies.length === 0 && <div className="text-sm text-muted-foreground">No policies defined.</div>}
      </div>
    </div>
  )
}
