"use client"

import { useState } from "react"
import { CheckCircle2, Copy } from "lucide-react"

export interface AgentIdentityProps {
  data: {
    name: string
    tagline: string
    description: string
    type: string
    personality: string[]
    visibility: "private" | "public"
  }
  onChange: (data: any) => void
  onComplete: () => void
}

export function AgentIdentity({ data, onChange, onComplete }: AgentIdentityProps) {
  const [copied, setCopied] = useState(false)
  const characterCount = data.tagline.length
  const maxCharacters = 80
  const isValid = data.name && data.description && data.type

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Agent Name */}
      <div className="space-y-3">
        <label className="text-sm font-semibold block">Agent Name</label>
        <p className="text-xs text-muted-foreground">Give your agent a memorable name that reflects its purpose.</p>
        <div className="relative">
          <input
            type="text"
            value={data.name}
            onChange={(e) => onChange({ ...data, name: e.target.value })}
            maxLength={50}
            className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            placeholder="e.g., Crypto Trader Pro"
          />
          <div className="absolute right-3 top-2.5 text-xs text-muted-foreground">{data.name.length}/50</div>
        </div>
      </div>

      {/* Tagline */}
      <div className="space-y-3">
        <label className="text-sm font-semibold block">Tagline</label>
        <p className="text-xs text-muted-foreground">A short, catchy description of what your agent does.</p>
        <div className="relative">
          <input
            type="text"
            value={data.tagline}
            onChange={(e) => onChange({ ...data, tagline: e.target.value.slice(0, maxCharacters) })}
            className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            placeholder="Short description of your agent"
          />
          <div className="absolute right-3 top-2.5 text-xs text-muted-foreground">
            {characterCount}/{maxCharacters}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-3">
        <label className="text-sm font-semibold block">Description</label>
        <p className="text-xs text-muted-foreground">Detailed explanation of capabilities, use cases, and behavior.</p>
        <textarea
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition resize-none"
          placeholder="Detailed description of your agent's purpose and capabilities..."
          rows={5}
        ></textarea>
        <p className="text-xs text-muted-foreground">Markdown formatting supported</p>
      </div>

      {/* Agent Type */}
      <div className="space-y-3">
        <label className="text-sm font-semibold block">Agent Type</label>
        <p className="text-xs text-muted-foreground">Choose the primary category for your agent.</p>
        <select
          value={data.type}
          onChange={(e) => onChange({ ...data, type: e.target.value })}
          className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
        >
          <option>Trading Agent</option>
          <option>Prediction Oracle</option>
          <option>Governance Delegate</option>
          <option>Research Assistant</option>
          <option>Task Manager</option>
          <option>Social Agent</option>
          <option>Customer Support</option>
          <option>Custom</option>
        </select>
      </div>

      {/* Personality Traits */}
      <div className="space-y-3">
        <label className="text-sm font-semibold block">Personality Style</label>
        <p className="text-xs text-muted-foreground">Select traits that match your agent's communication style.</p>
        <div className="grid grid-cols-2 gap-2">
          {["Analytical", "Aggressive", "Cautious", "Humorous", "Formal", "Creative", "Professional", "Friendly"].map(
            (trait) => (
              <button
                key={trait}
                onClick={() => {
                  const updated = data.personality.includes(trait)
                    ? data.personality.filter((t) => t !== trait)
                    : [...data.personality, trait]
                  onChange({ ...data, personality: updated })
                }}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  data.personality.includes(trait)
                    ? "bg-primary text-primary-foreground ring-2 ring-primary/50"
                    : "border border-border hover:bg-secondary/50 text-foreground"
                }`}
              >
                {trait}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Visibility */}
      <div className="space-y-3">
        <label className="text-sm font-semibold block">Visibility</label>
        <p className="text-xs text-muted-foreground">Control who can see and use your agent.</p>
        <div className="space-y-2">
          {[
            { value: "private", label: "Private", desc: "Only you can access this agent" },
            { value: "public", label: "Public (Marketplace)", desc: "List on marketplace for others to rent" },
          ].map((option) => (
            <label
              key={option.value}
              className={`flex items-start gap-3 cursor-pointer p-3 rounded-lg border transition ${
                data.visibility === option.value ? "border-primary bg-primary/5" : "border-border hover:bg-secondary/30"
              }`}
            >
              <input
                type="radio"
                name="visibility"
                value={option.value}
                checked={data.visibility === option.value}
                onChange={(e) => onChange({ ...data, visibility: e.target.value as any })}
                className="w-4 h-4 mt-0.5"
              />
              <div>
                <p className="text-sm font-medium">{option.label}</p>
                <p className="text-xs text-muted-foreground">{option.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Configuration Export */}
      <div className="border border-border rounded-lg p-4 bg-secondary/30">
        <div className="flex items-start justify-between mb-2">
          <h4 className="text-sm font-semibold">Configuration</h4>
          <button
            onClick={handleCopy}
            className="text-xs px-2 py-1 rounded hover:bg-secondary transition flex items-center gap-1"
          >
            <Copy className="w-3 h-3" />
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <pre className="text-xs bg-background rounded p-3 overflow-x-auto border border-border">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>

      {/* Continue Button */}
      <button
        onClick={onComplete}
        disabled={!isValid}
        className={`w-full py-2.5 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
          isValid
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "bg-muted text-muted-foreground cursor-not-allowed"
        }`}
      >
        <CheckCircle2 className="w-4 h-4" />
        {isValid ? "Identity Complete - Continue" : "Complete Identity Setup"}
      </button>
    </div>
  )
}
