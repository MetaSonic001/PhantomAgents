"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"

const TEMPLATES = [
  { id: "t1", name: "Trading Bot (Starter)", desc: "Simple trading signals using exchange data" },
  { id: "t2", name: "Research Assistant", desc: "Web-retrieval + summarization" },
  { id: "t3", name: "DAO Governance Assistant", desc: "Vote summarization and proposal drafting" },
]

export default function TemplatesPage() {
  const [selected, setSelected] = useState<string | null>(null)

  const handleCreate = (id: string) => {
    // In reality you'd prefill builder state; here we just navigate to builder
    window.location.href = "/builder" // keep simple for demo
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            <h1 className="text-2xl font-bold mb-2">Agent Templates</h1>
            <p className="text-muted-foreground mb-6">Create an agent from a template to get started quickly.</p>

            <div className="grid md:grid-cols-3 gap-4">
              {TEMPLATES.map((t) => (
                <div key={t.id} className={`border border-border rounded-lg p-4 ${selected === t.id ? "bg-primary/10" : "bg-card"}`}>
                  <h3 className="font-semibold mb-1">{t.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{t.desc}</p>
                  <div className="flex gap-2">
                    <button onClick={() => setSelected(t.id)} className="px-3 py-2 border border-border rounded">Select</button>
                    <button onClick={() => handleCreate(t.id)} className="px-3 py-2 bg-primary text-primary-foreground rounded">Create</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
