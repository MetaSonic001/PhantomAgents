// Helper to normalize signing across StarkNet connectors
export async function signMessageNormalized(account: any, message: string) {
  if (!account) throw new Error("No account available to sign")

  // Try common signMessage API
  try {
    if (typeof account.signMessage === "function") {
      const sig = await account.signMessage(message)
      // Normalize to hex string if object
      if (typeof sig === "string") return sig
      try {
        return JSON.stringify(sig)
      } catch (e) {
        return String(sig)
      }
    }
  } catch (e) {
    // fallthrough
  }

  // Try generic request method (some connectors expose request)
  try {
    if (typeof account.request === "function") {
      const res = await account.request({ method: "starknet_signMessage", params: [message] })
      return typeof res === "string" ? res : JSON.stringify(res)
    }
  } catch (e) {
    // fallthrough
  }

  throw new Error("No supported signing method on account")
}
