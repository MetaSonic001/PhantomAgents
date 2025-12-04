import { NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const agentId: string = body.agentId || ""
    const proofHash: string = body.proofHash || ""
    const proofData = body.proofData || {}

    // If a relayer or real submitter is configured, forward the proof to it.
    const RELAYER_URL = process.env.STARKNET_RELAYER_URL
    const RELAYER_KEY = process.env.STARKNET_RELAYER_KEY

    if (RELAYER_URL && RELAYER_KEY) {
      // Example: forward to a configured relayer (implementation-specific)
      const res = await fetch(RELAYER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RELAYER_KEY}`,
        },
        body: JSON.stringify({ agentId, proofHash, proofData }),
      })
      const j = await res.json()
      return NextResponse.json({ txHash: j.txHash || j.hash || null, raw: j })
    }

    // No relayer configured — return a mocked tx hash for local testing
    const mockTx = "0x" + crypto.randomBytes(16).toString("hex")
    return NextResponse.json({ txHash: mockTx, note: "mocked tx (no relayer configured)" })
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 })
  }
}
