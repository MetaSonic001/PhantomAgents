"use client"

import * as React from "react"

// Simple mock connector for demo mode — no on-chain wallet required.
export default function WalletConnector() {
  const [connected, setConnected] = React.useState(() => {
    try {
      return !!localStorage.getItem("phantom.mock.connected")
    } catch (e) {
      return false
    }
  })

  const toggle = () => {
    try {
      if (connected) {
        localStorage.removeItem("phantom.mock.connected")
        setConnected(false)
      } else {
        localStorage.setItem("phantom.mock.connected", "1")
        setConnected(true)
      }
    } catch (e) {
      console.warn("storage error", e)
    }
  }

  const short = (s: string) => `${String(s).slice(0, 6)}...${String(s).slice(-4)}`

  return (
    <div className="flex items-center gap-3">
      <div className="text-xs text-muted-foreground">
        <div>Mode: <span className="font-mono">Mock Backend</span></div>
        <div>Address: <span className="font-mono">{connected ? short("demo_user_address_0xdeadbeef") : "-"}</span></div>
        <div>Status: <span className="font-mono">{connected ? "connected" : "not connected"}</span></div>
      </div>

      <div>
        <button onClick={toggle} className="px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm">
          {connected ? "Disconnect" : "Connect (Mock)"}
        </button>
      </div>
    </div>
  )
}
