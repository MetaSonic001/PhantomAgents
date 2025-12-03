"use client"

import { Plus, Trash2 } from "lucide-react"
import { useState } from "react"

export interface RulesPanelProps {
  onComplete: () => void
}

export function RulesPanel({ onComplete }: RulesPanelProps) {
  const [rules, setRules] = useState<any[]>([])

  const addRule = () => {
    setRules([...rules, { condition: "", action: "" }])
  }

  const deleteRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index))
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Rules & Constraints</h2>

      <div className="space-y-6">
        {/* Input Validation */}
        <div className="border border-border rounded-lg p-6 bg-card">
          <h3 className="font-semibold mb-4">Input Validation</h3>
          <div className="space-y-3">
            {rules.map((rule, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Condition"
                  value={rule.condition}
                  onChange={(e) => {
                    const updated = [...rules]
                    updated[i].condition = e.target.value
                    setRules(updated)
                  }}
                  className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
                />
                <button
                  onClick={() => deleteRule(i)}
                  className="p-2 hover:bg-secondary rounded-md transition text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={addRule}
              className="w-full py-2 px-3 border border-dashed border-border rounded-md hover:bg-secondary transition text-sm font-medium flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Rule
            </button>
          </div>
        </div>

        {/* Output Filters */}
        <div className="border border-border rounded-lg p-6 bg-card">
          <h3 className="font-semibold mb-4">Output Filters</h3>
          <label className="flex items-center gap-2 mb-4">
            <input type="checkbox" className="w-4 h-4" />
            <span className="text-sm">Enable Content Moderation</span>
          </label>
          <div>
            <label className="text-sm font-medium block mb-2">Blocked Words</label>
            <textarea
              placeholder="word1, word2, word3..."
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
            ></textarea>
          </div>
        </div>

        {/* Rate Limits */}
        <div className="border border-border rounded-lg p-6 bg-card">
          <h3 className="font-semibold mb-4">Rate Limits</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Per Hour", placeholder: "100" },
              { label: "Per Day", placeholder: "1000" },
              { label: "Per Week", placeholder: "5000" },
            ].map((item) => (
              <div key={item.label}>
                <label className="text-xs font-medium block mb-2">{item.label}</label>
                <input
                  type="number"
                  placeholder={item.placeholder}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onComplete}
          className="w-full py-2 rounded-md font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition"
        >
          Continue to Monetization
        </button>
      </div>
    </div>
  )
}
