"use client"

import * as React from "react"
import { GlassSelect } from "@/components/ui/glass-select"

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

  const save = async () => {
    // Save to backend for encryption
    try {
      const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"
      const response = await fetch(`${BASE_URL}/api/keys/store`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          api_key: apiKey,
        }),
      })
      
      if (response.ok) {
        // Also save model preference locally
        const obj = { provider, model }
        localStorage.setItem(key, JSON.stringify(obj))
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      } else {
        const error = await response.json()
        alert(`Failed to save key: ${error.detail || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Failed to save key:", error)
      alert("Failed to save API key to backend")
    }
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Bring Your Own API Key</h3>
      <p className="text-sm text-muted-foreground">Provide an API key and model selection for upstream LLM providers. Storing keys in localStorage is for development only — move keys to a secure server in production.</p>

      <div className="grid grid-cols-2 gap-2">
        <label className="text-xs">Provider</label>
        <label className="text-xs">Model</label>

        <GlassSelect
          value={provider}
          onChange={(v) => setProvider(v as Provider)}
          options={[
            { value: "groqcloud", label: "GroqCloud" },
            { value: "gemini", label: "Gemini" },
          ]}
        />

        <GlassSelect
          value={model}
          onChange={setModel}
          options={
            provider === "groqcloud"
              ? [
                  { value: "", label: "Select Groq model" },
                  { value: "groq-1", label: "groq-1" },
                  { value: "groq-1-mini", label: "groq-1-mini" },
                ]
              : [
                  { value: "", label: "Select Gemini model" },
                  { value: "gemini-1.5", label: "gemini-1.5" },
                  { value: "gemini-pro", label: "gemini-pro" },
                ]
          }
        />
      </div>

      <div>
        <label className="text-xs">API Key</label>
        <input value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="sk-..." className="glass-input font-mono" />
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
