"use client"

import * as React from "react"

type Exposure = {
  id: string
  name: string
  rule: string
}

export default function ExposureRules({ agentName }: { agentName?: string }) {
  const key = `phantom.agent.${agentName || "default"}.exposure`
  const [items, setItems] = React.useState<Exposure[]>([])
  const [name, setName] = React.useState("")
  const [rule, setRule] = React.useState("")

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw) setItems(JSON.parse(raw))
    } catch (e) {}
  }, [key])

  const add = () => {
    if (!name || !rule) return
    const next = [...items, { id: `${Date.now()}`, name, rule }]
    setItems(next)
    localStorage.setItem(key, JSON.stringify(next))
    setName("")
    setRule("")
  }

  const remove = (id: string) => {
    const next = items.filter((i) => i.id !== id)
    setItems(next)
    localStorage.setItem(key, JSON.stringify(next))
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Exposure Rules</h3>
      <p className="text-sm text-muted-foreground">Control which users or groups can call your agent. This is a local placeholder for access control rules.</p>

      <div className="grid grid-cols-2 gap-2">
        <input className="input" placeholder="Name (e.g., beta-users)" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="input" placeholder="Rule (e.g., allow:address:0xabc...)" value={rule} onChange={(e) => setRule(e.target.value)} />
      </div>
      <div>
        <button className="btn" onClick={add}>Add Exposure Rule</button>
      </div>

      <div className="space-y-2">
        {items.map((it) => (
          <div key={it.id} className="p-3 border rounded flex items-start justify-between">
            <div>
              <div className="font-medium">{it.name}</div>
              <div className="text-sm text-muted-foreground">{it.rule}</div>
            </div>
            <div>
              <button className="btn-ghost" onClick={() => remove(it.id)}>Remove</button>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="text-sm text-muted-foreground">No exposure rules defined.</div>}
      </div>
    </div>
  )
}
