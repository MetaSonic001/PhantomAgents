"use client"

import * as React from "react"

export default function Scheduler({ agentName }: { agentName?: string }) {
  const key = `phantom.agent.${agentName || "default"}.scheduler`
  const [enabled, setEnabled] = React.useState(false)
  const [cron, setCron] = React.useState("0 0 * * *")

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw) {
        const obj = JSON.parse(raw)
        setEnabled(Boolean(obj.enabled))
        setCron(obj.cron || "0 0 * * *")
      }
    } catch (e) {}
  }, [key])

  const save = () => {
    const obj = { enabled, cron }
    localStorage.setItem(key, JSON.stringify(obj))
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Scheduler</h3>
      <p className="text-sm text-muted-foreground">Schedule automatic runs for your agent. This is a local placeholder; use a server cron or job runner in production.</p>

      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
          <span className="text-sm">Enable schedule</span>
        </label>
      </div>

      <div>
        <label className="text-xs block mb-1">Cron expression</label>
        <input value={cron} onChange={(e) => setCron(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
      </div>

      <div>
        <button onClick={save} className="px-3 py-1 bg-primary text-primary-foreground rounded-md">Save Schedule</button>
      </div>
    </div>
  )
}
