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

    if (RELAYER_URL && RELAYER_KEY) {
      const res = await fetch(RELAYER_URL + "/register-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${RELAYER_KEY}` },
        body: JSON.stringify({ agentData, signer, signature }),
      })
      const j = await res.json()
      return NextResponse.json({ raw: j, contractAddress: j.contractAddress || j.address || null, tokenId: j.tokenId || null })
    }

    // Mock response for local development
    const mockAddress = "0x" + crypto.randomBytes(16).toString("hex")
    const mockTokenId = "token-" + Date.now()
    return NextResponse.json({ contractAddress: mockAddress, tokenId: mockTokenId, note: "mocked register (no relayer configured)" })
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 })
  }
}
