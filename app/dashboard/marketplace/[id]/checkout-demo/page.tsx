"use client"

import * as React from "react"
import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { CreditCard, Shield, Clock } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CheckoutDemo({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = React.use(params)
  const [name, setName] = useState("")
  const [card, setCard] = useState("")
  const [useTrial, setUseTrial] = useState(true)
  const [processing, setProcessing] = useState(false)

  const handlePay = () => {
    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      alert("Demo payment successful (no real charge).")
      router.push("/dashboard/marketplace")
    }, 900)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Checkout — Demo Payment</h1>
              <p className="text-muted-foreground">Listing ID: {id} — demo flow only</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="border border-border rounded-lg p-6 bg-card">
                <h3 className="font-semibold mb-4 flex items-center gap-2"><CreditCard className="w-4 h-4" /> Payment</h3>
                <label className="text-xs">Cardholder name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border border-border rounded mb-3" />
                <label className="text-xs">Card number (demo)</label>
                <input value={card} onChange={(e) => setCard(e.target.value)} placeholder="4242 4242 4242 4242" className="w-full px-3 py-2 border border-border rounded mb-3" />
                <div className="flex items-center gap-2 mb-3">
                  <input id="trial" type="checkbox" checked={useTrial} onChange={() => setUseTrial(!useTrial)} />
                  <label htmlFor="trial" className="text-sm">Use trial credits (demo)</label>
                </div>
                <div className="flex gap-2">
                  <button onClick={handlePay} disabled={processing} className="px-4 py-2 bg-primary text-primary-foreground rounded">
                    {processing ? "Processing…" : useTrial ? "Apply Trial & Confirm" : "Pay (Demo)"}
                  </button>
                  <button onClick={() => router.back()} className="px-4 py-2 border border-border rounded">Cancel</button>
                </div>
              </div>

              <div className="border border-border rounded-lg p-6 bg-card">
                <h3 className="font-semibold mb-4 flex items-center gap-2"><Shield className="w-4 h-4" /> Security</h3>
                <p className="text-sm text-muted-foreground mb-3">This is a demo payments UI. No real card data is sent or stored.</p>
                <p className="text-xs flex items-center gap-2"><Clock className="w-4 h-4" /> Demo tokens valid for 7 days.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
