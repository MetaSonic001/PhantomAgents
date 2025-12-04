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
    const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || null

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

    if (BACKEND) {
      // If proofId provided, submit to backend submit endpoint
      const proofId = (body as any).proofId || null
      if (proofId) {
        const res = await fetch(`${BACKEND}/api/proofs/${proofId}/submit`, { method: "POST" })
        const j = await res.json()
        return NextResponse.json(j)
      }

      // Otherwise generate a proof via backend then submit it
      const genRes = await fetch(`${BACKEND}/api/proofs/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent_id: agentId, action_type: proofData?.action_type || "action", action_data: proofData || {} }),
      })
      const genJson = await genRes.json()
      if (!genJson.proof_id) return NextResponse.json({ error: "generate failed" }, { status: 500 })

      const submitRes = await fetch(`${BACKEND}/api/proofs/${genJson.proof_id}/submit`, { method: "POST" })
      const submitJson = await submitRes.json()
      return NextResponse.json({ ...submitJson, proof_id: genJson.proof_id })
    }

    // No relayer or backend configured — return a mocked tx hash for local testing
    const mockTx = "0x" + crypto.randomBytes(16).toString("hex")
    return NextResponse.json({ txHash: mockTx, note: "mocked tx (no relayer configured)" })
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 })
  }
}
