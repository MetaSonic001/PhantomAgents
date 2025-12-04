import { NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const listingId: string = body.listingId || body.id || ""
    const buyer: string = body.buyer || ""

    const RELAYER_URL = process.env.STARKNET_RELAYER_URL
    const RELAYER_KEY = process.env.STARKNET_RELAYER_KEY

    if (RELAYER_URL && RELAYER_KEY) {
      const res = await fetch(RELAYER_URL + "/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${RELAYER_KEY}` },
        body: JSON.stringify({ listingId, buyer }),
      })
      const j = await res.json()
      return NextResponse.json({ txHash: j.txHash || null, raw: j })
    }

    // Mock tx for local testing
    const mockTx = "0x" + crypto.randomBytes(16).toString("hex")
    return NextResponse.json({ txHash: mockTx, note: "mocked buy tx (no relayer configured)" })
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 })
  }
}
