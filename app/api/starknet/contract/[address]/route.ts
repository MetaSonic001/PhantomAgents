import { NextResponse } from "next/server"

export async function GET(req: Request, { params }: { params: { address: string } }) {
  try {
    const address = params.address
    const RELAYER_URL = process.env.STARKNET_RELAYER_URL
    const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || null

    if (RELAYER_URL) {
      const res = await fetch(`${RELAYER_URL}/contract/${address}`)
      const j = await res.json()
      return NextResponse.json(j)
    }

    if (BACKEND) {
      // Try to fetch agent by id from backend (agent_id expected)
      const res = await fetch(`${BACKEND}/api/agents/${address}`)
      if (res.ok) {
        const j = await res.json()
        return NextResponse.json(j)
      }
    }

    // Mock metadata for local dev
    const meta = {
      address,
      name: `Agent ${address.slice(0, 6)}`,
      description: `On-chain agent registered at ${address}. This is mock metadata for local development.`,
      tokenId: `token-${address.slice(-6)}`,
      creator: "0xcreator",
      createdAt: new Date().toISOString(),
      latestVerifiedActions: [
        { id: "a1", action: "price_check", resultHash: "0xdeadbeef", timestamp: new Date().toISOString() },
      ],
      proofHashes: ["0xdeadbeef"],
      runtimeLogs: [
        { ts: new Date().toISOString(), level: "info", msg: "Agent instantiated (mock)" },
      ],
    }

    return NextResponse.json(meta)
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 })
  }
}
