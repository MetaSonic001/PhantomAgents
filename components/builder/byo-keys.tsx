"use client"

import * as React from "react"

type Provider = "groqcloud" | "gemini"

export default function BYOKeys({ agentName }: { agentName?: string }) {
  const key = `phantom.agent.${agentName || "default"}.byo`
  const [provider, setProvider] = React.useState<Provider>("groqcloud")
  const [apiKey, setApiKey] = React.useState("")
  const [model, setModel] = React.useState("")
  const [saved, setSaved] = React.useState(false)

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw) {
        const obj = JSON.parse(raw)
        setProvider(obj.provider || "groqcloud")
        setApiKey(obj.apiKey || "")
        setModel(obj.model || "")
      }
    } catch (e) {}
  }, [key])

  const save = () => {
    const obj = { provider, apiKey, model }
    localStorage.setItem(key, JSON.stringify(obj))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Bring Your Own API Key</h3>
      <p className="text-sm text-muted-foreground">Provide an API key and model selection for upstream LLM providers. Storing keys in localStorage is for development only — move keys to a secure server in production.</p>

      <div className="grid grid-cols-2 gap-2">
        <label className="text-xs">Provider</label>
        <label className="text-xs">Model</label>

        <select value={provider} onChange={(e) => setProvider(e.target.value as Provider)} className="px-3 py-2 border rounded-md">
          <option value="groqcloud">GroqCloud</option>
          <option value="gemini">Gemini</option>
        </select>

        <select value={model} onChange={(e) => setModel(e.target.value)} className="px-3 py-2 border rounded-md">
          {provider === "groqcloud" ? (
            <>
              <option value="">Select Groq model</option>
              <option value="groq-1">groq-1</option>
              <option value="groq-1-mini">groq-1-mini</option>
            </>
          ) : (
            <>
              <option value="">Select Gemini model</option>
              <option value="gemini-1.5">gemini-1.5</option>
              <option value="gemini-pro">gemini-pro</option>
            </>
          )}
        </select>
      </div>

      <div>
        <label className="text-xs">API Key</label>
        <input value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="sk-..." className="w-full px-3 py-2 border rounded-md font-mono" />
      </div>

      <div className="flex items-center gap-2">
        <button onClick={save} className="px-3 py-1 bg-primary text-primary-foreground rounded-md">Save Key</button>
        {saved && <span className="text-sm text-green-600">Saved</span>}
      </div>

      <div className="text-xs text-muted-foreground">
        <div>Note: For security, move keys to server-side vault in production. LocalStorage is for demos only.</div>
      </div>
    </div>
  )
}
