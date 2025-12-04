import { NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const agentData = body.agentData || {}
    const signer = body.signer || null
    const signature = body.signature || null
    const RELAYER_URL = process.env.STARKNET_RELAYER_URL
    const RELAYER_KEY = process.env.STARKNET_RELAYER_KEY
    const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || null

    // If a relayer is configured, prefer it
    if (RELAYER_URL && RELAYER_KEY) {
      const res = await fetch(RELAYER_URL + "/register-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${RELAYER_KEY}` },
        body: JSON.stringify({ agentData, signer, signature }),
      })
      const j = await res.json()
      return NextResponse.json({ raw: j, contractAddress: j.contractAddress || j.address || null, tokenId: j.tokenId || null })
    }

    // If a backend is configured, use it (FastAPI mock)
    if (BACKEND) {
      // Create agent then register it
      const createRes = await fetch(`${BACKEND}/api/agents/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(agentData),
      })
      const createJson = await createRes.json()
      const agentId = createJson.agent_id

      if (!agentId) {
        return NextResponse.json({ error: "backend create failed" }, { status: 500 })
      }

      const regRes = await fetch(`${BACKEND}/api/agents/${agentId}/register`, { method: "POST" })
      const regJson = await regRes.json()

      return NextResponse.json({ ...regJson, agent_id: agentId })
    }

    // Mock response for local development
    const mockAddress = "0x" + crypto.randomBytes(16).toString("hex")
    const mockTokenId = "token-" + Date.now()
    return NextResponse.json({ contractAddress: mockAddress, tokenId: mockTokenId, note: "mocked register (no relayer/backend configured)" })
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 })
  }
}
