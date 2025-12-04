import { NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const prompt: string = body.prompt || ""
    const agentId: string = body.agentId || ""

    let llmText = ""

    // If an upstream API key is present, proxy to it. Otherwise return a simulated response.
    const OPENAI_KEY = process.env.OPENAI_API_KEY
    if (OPENAI_KEY) {
      // Minimal proxy to OpenAI chat completions (change model and payload as needed)
      const resp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 800,
        }),
      })
      const j = await resp.json()
      llmText = (j?.choices?.[0]?.message?.content) || JSON.stringify(j)
    } else {
      // Simulated LLM response for local development
      llmText = `Simulated LLM response for agent ${agentId}: ${prompt.slice(0, 200)}...`
    }

    // Create a proof-like hash using SHA256 over response + agentId + timestamp
    const proofSource = `${llmText}|${agentId}|${Date.now()}`
    const proofHash = crypto.createHash("sha256").update(proofSource).digest("hex")

    const result = {
      response: llmText,
      proof: {
        hash: proofHash,
        createdAt: new Date().toISOString(),
        source: proofSource.slice(0, 200),
      },
    }

    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 })
  }
}
