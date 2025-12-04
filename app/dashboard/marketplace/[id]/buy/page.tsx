"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import WalletConnector from "@/components/wallet-connector"
import { explorerLink } from "@/lib/starknet-client"
import { useAccount } from "@starknet-react/core"
import { signMessageNormalized } from "@/lib/starknet-sign"

export default function BuyPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = React.use(params)
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)

  // Buyer address will be read from connected wallet in a real flow; here we accept an optional override
  const [buyerAddress, setBuyerAddress] = useState<string | undefined>(undefined)
  const { account, address } = useAccount() as any

  const handleBuy = async () => {
    setProcessing(true)
    try {
      // Auto-fill buyer address from connected wallet if available
      const buyer = buyerAddress || account?.address || account

      // Try to sign a purchase intent if possible
      let signature = null
      if (account) {
        try {
          signature = await signMessageNormalized(account, JSON.stringify({ action: "buy", listingId: id, buyer }))
        } catch (e) {
          console.warn("buy signature failed", e)
        }
      }

      const res = await fetch("/api/starknet/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId: id, buyer, signature }),
      })
      const j = await res.json()
      setProcessing(false)
      if (j?.txHash) {
        setTxHash(j.txHash)
        setSuccess(true)
      } else {
        setSuccess(true)
      }
    } catch (err) {
      console.error(err)
      setProcessing(false)
    }
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

            <div className="border border-border rounded-lg p-4 bg-card">
              <h4 className="text-sm font-semibold mb-2">On-chain purchase</h4>
              <p className="text-xs text-muted-foreground mb-2">Connect your wallet and submit the on-chain buy transaction.</p>
              <div className="mb-2">
                <WalletConnector />
              </div>
              <div className="mb-2">
                <label className="text-xs">Buyer address (optional override)</label>
                <input value={buyerAddress ?? ""} onChange={(e) => setBuyerAddress(e.target.value)} placeholder="0x..." className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div className="flex gap-2">
                <button onClick={handleBuy} disabled={processing} className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
                  {processing ? "Processing..." : "Buy On-Chain"}
                </button>
                <button onClick={() => router.back()} className="px-4 py-2 border rounded-md">Cancel</button>
              </div>
              {txHash && (
                <div className="mt-3 text-sm">
                  Submitted tx: <a href={explorerLink(txHash)} className="text-primary font-mono" target="_blank" rel="noreferrer">{txHash}</a>
                </div>
              )}
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
