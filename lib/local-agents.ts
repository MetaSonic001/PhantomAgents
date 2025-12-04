"use client"

export type LocalAgentData = {
  name: string
  tagline?: string
  description?: string
  type?: string
  personality?: string[]
  visibility?: "private" | "public"
}

export type LocalAgentRecord = {
  id: string
  agentData: LocalAgentData
  onChain?: any
  saved_at?: string
}

const LOCAL_AGENT_KEY = "phantom.seller.listings"

export function getLocalAgents(): LocalAgentRecord[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(LOCAL_AGENT_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((a) => a && typeof a.id === "string" && a.agentData) as LocalAgentRecord[]
  } catch {
    return []
  }
}


