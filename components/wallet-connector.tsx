"use client"

import * as React from "react"
import { useAccount, useConnect, useDisconnect, useNetwork } from "@starknet-react/core"
import { signMessageNormalized } from "@/lib/starknet-sign"

export default function WalletConnector() {
  // Use the recommended hooks from @starknet-react/core
  const { account, address, status } = useAccount() as any
  const { connect, connectors } = useConnect() as any
  const { disconnect } = useDisconnect() as any
  const { chain } = useNetwork() as any
  const chainId = chain?.name || chain?.id

  const [sigResult, setSigResult] = React.useState<string | null>(null)
  const [loadingSig, setLoadingSig] = React.useState(false)
  const requiredNetwork = process.env.NEXT_PUBLIC_STARKNET_NETWORK || "goerli-alpha"

  const handleConnect = async () => {
    try {
      if (connect) await connect()
      else if (connectors?.length && connectors[0].connect) await connectors[0].connect()
    } catch (e) {
      console.error("connect error", e)
    }
  }

  const handleDisconnect = async () => {
    try {
      if (disconnect) await disconnect()
    } catch (e) {
      console.error("disconnect error", e)
    }
  }

  const requestSignature = async () => {
    setLoadingSig(true)
    setSigResult(null)
    try {
      if (!account && !address) {
        setSigResult("No account connected")
        return
      }
      const message = `PhantomAgents signature request @ ${new Date().toISOString()}`
      try {
        // prefer the account object (which exposes signMessage); otherwise pass address-level connector
        const signer = account ?? address
        const norm = await signMessageNormalized(signer, message)
        setSigResult(String(norm))
      } catch (e: any) {
        setSigResult(String(e?.message || e))
      }
    } catch (err: any) {
      setSigResult(String(err?.message || err))
    } finally {
      setLoadingSig(false)
    }
  }

  const short = (addr?: string) => {
    if (!addr) return "-"
    try {
      return `${String(addr).slice(0, 6)}...${String(addr).slice(-4)}`
    } catch (e) {
      return "-"
    }
  }

  return (
    <div className="flex items-center gap-3">
      <div className="text-xs text-muted-foreground">
        <div>
          Network: <span className="font-mono">{chainId ?? "unknown"}</span>
          {chainId && chainId !== requiredNetwork && (
            <span className="ml-2 text-red-500">(wrong network — expected {requiredNetwork})</span>
          )}
        </div>
        <div>Address: <span className="font-mono">{short(address ?? account?.address ?? account)}</span></div>
        <div>Status: <span className="font-mono">{String(status)}</span></div>
      </div>

      <div className="flex items-center gap-2">
        {status !== "connected" ? (
          <button
            onClick={handleConnect}
            className="px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm"
          >
            Connect
          </button>
        ) : (
          <>
            <button
              onClick={requestSignature}
              disabled={loadingSig}
              className="px-3 py-1 bg-secondary text-foreground rounded-md text-sm"
            >
              {loadingSig ? "Signing…" : "Request Signature"}
            </button>
            <button onClick={handleDisconnect} className="px-2 py-1 border rounded-md text-sm">
              Disconnect
            </button>
          </>
        )}
      </div>

      {sigResult && (
        <div className="ml-3 text-xs wrap-break-word max-w-xs text-muted-foreground">
          <div className="font-semibold">Signature result</div>
          <pre className="text-[10px] p-2 bg-muted rounded">{sigResult}</pre>
        </div>
      )}
    </div>
  )
}
