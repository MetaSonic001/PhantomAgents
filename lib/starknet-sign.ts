// Mock signer for demo/backend mode.
// Returns a deterministic, non-sensitive mock signature string.
export async function signMessageNormalized(_account: any, message: string) {
  try {
    let b64 = ""
    if (typeof window !== "undefined" && typeof window.btoa === "function") {
      b64 = window.btoa(message)
    } else if (typeof Buffer !== "undefined") {
      b64 = Buffer.from(String(message)).toString("base64")
    } else {
      // Fallback: simple hex-ish encoding
      b64 = Array.from(String(message)).map((c) => c.charCodeAt(0).toString(16)).join("")
    }

    return `mock_sig_${b64.slice(0, 32)}`
  } catch (e) {
    return `mock_sig_${Date.now()}`
  }
}
