import { NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const listingId: string = body.listingId || body.id || ""
    const buyer: string = body.buyer || ""

    const RELAYER_URL = process.env.STARKNET_RELAYER_URL
    const RELAYER_KEY = process.env.STARKNET_RELAYER_KEY
    const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || null

    if (RELAYER_URL && RELAYER_KEY) {
      const res = await fetch(RELAYER_URL + "/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${RELAYER_KEY}` },
        body: JSON.stringify({ listingId, buyer }),
      })
      const j = await res.json()
      return NextResponse.json({ txHash: j.txHash || null, raw: j })
    }

    if (BACKEND) {
      // Map local listing/buy to backend subscription flow
      const res = await fetch(`${BACKEND}/api/marketplace/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent_id: listingId }),
      })
      const j = await res.json()
      return NextResponse.json(j)
    }

    // Mock tx for local testing
    const mockTx = "0x" + crypto.randomBytes(16).toString("hex")
    return NextResponse.json({ txHash: mockTx, note: "mocked buy tx (no relayer/backend configured)" })
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 })
  }
}
