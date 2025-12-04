// Small helper utilities for StarkNet interactions (front-end helpers)
export async function fetchContractMetadata(contractAddress: string) {
  try {
    // Always proxy through the backend API so client-side code does not talk directly to StarkNet
    const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "/api"
    const url = `${BACKEND.replace(/\/$/, "")}/api/agents/${contractAddress}`
    const res = await fetch(url)
    if (!res.ok) return null
    return await res.json()
  } catch (e) {
    console.error("fetchContractMetadata error", e)
    return null
  }
}

export function explorerLink(txHashOrAddress: string) {
  const explorerBase = process.env.NEXT_PUBLIC_EXPLORER_BASE || "https://sepolia.starkscan.co/tx"
  return `${explorerBase}/${txHashOrAddress}`
}
