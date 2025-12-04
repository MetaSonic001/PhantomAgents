"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"

export default function Onboarding() {
  const [step, setStep] = useState(1)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            <h1 className="text-2xl font-bold mb-2">Welcome to PhantomAgents</h1>
            <p className="text-muted-foreground mb-6">We'll guide you through creating your first agent.</p>

            <div className="border border-border rounded-lg p-6 bg-card">
              {step === 1 && (
                <div>
                  <h2 className="font-semibold mb-2">Step 1: Choose a Template</h2>
                  <p className="text-sm text-muted-foreground mb-4">Pick a starter template for your agent.</p>
                  <button onClick={() => setStep(2)} className="px-3 py-2 bg-primary text-primary-foreground rounded">Next</button>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="font-semibold mb-2">Step 2: Configure Identity</h2>
                  <p className="text-sm text-muted-foreground mb-4">Name your agent and choose capabilities.</p>
                  <button onClick={() => setStep(3)} className="px-3 py-2 bg-primary text-primary-foreground rounded">Next</button>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="font-semibold mb-2">Step 3: Test Run</h2>
                  <p className="text-sm text-muted-foreground mb-4">Run a quick test in the sandbox.</p>
                  <button onClick={() => setStep(4)} className="px-3 py-2 bg-primary text-primary-foreground rounded">Next</button>
                </div>
              )}

              {step === 4 && (
                <div>
                  <h2 className="font-semibold mb-2">Done</h2>
                  <p className="text-sm text-muted-foreground mb-4">You're ready to publish or save your agent as a draft.</p>
                  <button onClick={() => setStep(1)} className="px-3 py-2 border border-border rounded">Start Over</button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
