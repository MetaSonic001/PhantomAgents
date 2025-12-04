// Small helper utilities for StarkNet interactions (front-end helpers)
export async function fetchContractMetadata(contractAddress: string) {
  try {
    const res = await fetch(`/api/starknet/contract/${contractAddress}`)
    if (!res.ok) return null
    return await res.json()
  } catch (e) {
    console.error("fetchContractMetadata error", e)
    return null
  }
}

export function explorerLink(txHashOrAddress: string) {
  // Default to StarkNet testnet explorer pattern. Replace with env-driven chain mapping in prod.
  return `https://starkscan.co/tx/${txHashOrAddress}`
}
