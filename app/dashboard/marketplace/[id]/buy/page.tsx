"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function BuyPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = params
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleBuy = async () => {
    setProcessing(true)
    // Simulate purchase flow (frontend-only)
    await new Promise((r) => setTimeout(r, 1200))
    setProcessing(false)
    setSuccess(true)
  }

  return (
    <div className="p-8">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold mb-2">Checkout</h1>
        <p className="text-sm text-muted-foreground mb-6">Purchase access to the agent (frontend-only simulation)</p>

        {!success ? (
          <div className="space-y-4">
            <div className="border border-border rounded-lg p-4 bg-card">
              <p className="text-sm">Listing ID: {id}</p>
              <p className="text-lg font-bold mt-2">$99 — Subscription</p>
            </div>

            <div className="border border-border rounded-lg p-4 bg-card">
              <h3 className="font-semibold mb-2">Payment (simulated)</h3>
              <div className="space-y-3">
                <input placeholder="Card number" className="w-full px-3 py-2 border rounded-md" />
                <div className="grid grid-cols-2 gap-2">
                  <input placeholder="MM/YY" className="px-3 py-2 border rounded-md" />
                  <input placeholder="CVC" className="px-3 py-2 border rounded-md" />
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={handleBuy} disabled={processing} className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
                {processing ? "Processing..." : "Complete Purchase"}
              </button>
              <button onClick={() => router.back()} className="px-4 py-2 border rounded-md">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="border border-border rounded-lg p-6 bg-card">
            <h2 className="text-xl font-bold">Purchase complete</h2>
            <p className="text-sm text-muted-foreground">You now have access to this agent (simulated).</p>
            <div className="mt-4">
              <button onClick={() => router.push(`/dashboard/marketplace/${id}`)} className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
                Return to Listing
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
